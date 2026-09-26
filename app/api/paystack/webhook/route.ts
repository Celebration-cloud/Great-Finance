import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db";
import { hashWebhook, verifyPaystackSignature, verifyPaystackTransaction } from "@/features/payments/paystack";
import { paystackWebhookSchema } from "@/features/payments/schemas";
import { settleVerifiedPayment } from "@/features/payments/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ success: false, message: "Payment provider is not configured." }, { status: 503 });
  const signature = request.headers.get("x-paystack-signature");
  if (!verifyPaystackSignature(rawBody, signature, secret)) return NextResponse.json({ success: false, message: "Invalid signature." }, { status: 401 });
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON payload." }, { status: 400 });
  }
  const parsed = paystackWebhookSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid webhook payload." }, { status: 400 });
  const db = getPrisma();
  const eventHash = hashWebhook(rawBody);
  const existing = await db.webhookEvent.findUnique({ where: { eventHash } });
  if (existing?.status === "PROCESSED") return NextResponse.json({ success: true, message: "Event already processed." });
  const event = existing ?? await db.webhookEvent.create({ data: { provider: "paystack", eventHash, eventType: parsed.data.event, reference: parsed.data.data.reference, signature: signature!, payload: payload as Prisma.InputJsonValue } });
  if (parsed.data.event !== "charge.success") {
    await db.webhookEvent.update({ where: { id: event.id }, data: { status: "IGNORED", processedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Event acknowledged." });
  }
  try {
    await db.webhookEvent.update({ where: { id: event.id }, data: { status: "PROCESSING" } });
    const verification = await verifyPaystackTransaction(parsed.data.data.reference, secret);
    await settleVerifiedPayment(parsed.data.data.reference, verification.data);
    await db.webhookEvent.update({ where: { id: event.id }, data: { status: "PROCESSED", processedAt: new Date(), error: null } });
    return NextResponse.json({ success: true, message: "Event processed." });
  } catch (error) {
    console.error("paystack.webhook.failed", error);
    await db.webhookEvent.update({ where: { id: event.id }, data: { status: "FAILED", error: error instanceof Error ? error.message.slice(0, 500) : "Unknown processing failure" } });
    return NextResponse.json({ success: false, message: "Webhook processing failed." }, { status: 500 });
  }
}
