import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db";
import { AppError, errors, normalizeError } from "@/lib/errors/app-error";
import { apiMessage, withApiHandler } from "@/lib/http/api-response";
import { hashWebhook, verifyPaystackSignature, verifyPaystackTransaction } from "@/features/payments/paystack";
import { paystackWebhookSchema } from "@/features/payments/schemas";
import { settleVerifiedPayment } from "@/features/payments/service";
import { mintVendorCoupons } from "@/features/coupons/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return withApiHandler(request, "paystack.webhook", async (context) => {
    const rawBody = await request.text();
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) throw errors.configuration("Payment processing is not configured.");
    const signature = request.headers.get("x-paystack-signature");
    if (!verifyPaystackSignature(rawBody, signature, secret)) {
      throw new AppError("WEBHOOK_SIGNATURE_INVALID", { status: 401, message: "Invalid webhook signature.", report: "warn" });
    }
    let payload: unknown;
    try { payload = JSON.parse(rawBody); } catch (cause) { throw new AppError("MALFORMED_JSON", { status: 400, message: "Invalid JSON payload.", cause }); }
    const parsed = paystackWebhookSchema.safeParse(payload);
    if (!parsed.success) throw errors.validation("Invalid webhook payload.", parsed.error.flatten().fieldErrors);

    const db = getPrisma();
    const eventHash = hashWebhook(rawBody);
    const existing = await db.webhookEvent.findUnique({ where: { eventHash } });
    if (existing?.status === "PROCESSED") return apiMessage(context, "Event already processed.");
    const event = existing ?? await db.webhookEvent.create({ data: {
      provider: "paystack",
      eventHash,
      eventType: parsed.data.event,
      reference: parsed.data.data.reference,
      signature: hashWebhook(signature!),
      payload: payload as Prisma.InputJsonValue,
    } });
    if (parsed.data.event !== "charge.success") {
      await db.webhookEvent.update({ where: { id: event.id }, data: { status: "IGNORED", processedAt: new Date() } });
      return apiMessage(context, "Event acknowledged.");
    }

    try {
      await db.webhookEvent.update({ where: { id: event.id }, data: { status: "PROCESSING", error: null } });
      const verification = await verifyPaystackTransaction(parsed.data.data.reference, secret);
      const settled = await settleVerifiedPayment(parsed.data.data.reference, verification.data);

      // Mint coupons for the vendor based on plan items stored in PaymentIntent metadata
      const meta = settled.metadata as Record<string, unknown> | null;
      const items = Array.isArray(meta?.planItems)
        ? (meta.planItems as { planAmount: number; quantity: number }[])
        : [];
      if (items.length > 0) {
        await mintVendorCoupons(settled.organizationId, settled.reference, items);
      }

      await db.webhookEvent.update({ where: { id: event.id }, data: { status: "PROCESSED", processedAt: new Date(), error: null } });
      return apiMessage(context, "Event processed.");
    } catch (cause) {
      const failure = normalizeError(cause, "Webhook processing failed.");
      await db.webhookEvent.update({ where: { id: event.id }, data: { status: "FAILED", error: failure.code } });
      throw failure;
    }
  });
}
