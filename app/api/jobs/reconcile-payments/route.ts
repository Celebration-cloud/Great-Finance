import { NextResponse } from "next/server";
import { verifyPaystackTransaction } from "@/features/payments/paystack";
import { settleVerifiedPayment } from "@/features/payments/service";
import { getPrisma } from "@/lib/db";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  if (!paystackSecret) return NextResponse.json({ success: false, message: "Paystack is not configured." }, { status: 503 });
  const candidates = await getPrisma().paymentIntent.findMany({ where: { status: "PROCESSING", updatedAt: { lt: new Date(Date.now() - 5 * 60_000) } }, orderBy: { updatedAt: "asc" }, take: 50 });
  const outcomes = await Promise.allSettled(candidates.map(async (payment) => {
    const verification = await verifyPaystackTransaction(payment.reference, paystackSecret);
    if (verification.data.status === "success") await settleVerifiedPayment(payment.reference, verification.data);
    return payment.reference;
  }));
  const processed = outcomes.filter((outcome) => outcome.status === "fulfilled").length;
  return NextResponse.json({ success: true, data: { inspected: candidates.length, processed, failed: outcomes.length - processed }, message: "Reconciliation pass completed." });
}
