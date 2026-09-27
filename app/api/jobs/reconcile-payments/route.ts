import { verifyPaystackTransaction } from "@/features/payments/paystack";
import { settleVerifiedPayment } from "@/features/payments/service";
import { getPrisma } from "@/lib/db";
import { AppError, errors, normalizeError } from "@/lib/errors/app-error";
import { apiSuccess, withApiHandler } from "@/lib/http/api-response";
import { logEvent } from "@/lib/observability/logger";

export async function POST(request: Request) {
  return withApiHandler(request, "payments.reconcile", async (context) => {
    const authorization = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
      throw new AppError("AUTHENTICATION_REQUIRED", { status: 401, message: "Invalid job credentials.", report: "warn" });
    }
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) throw errors.configuration("Payment processing is not configured.");
    const db = getPrisma();
    const candidates = await db.paymentIntent.findMany({ where: { status: "PROCESSING", updatedAt: { lt: new Date(Date.now() - 5 * 60_000) } }, orderBy: { updatedAt: "asc" }, take: 50 });
    let processed = 0;
    let pending = 0;
    let failed = 0;

    for (const payment of candidates) {
      try {
        const verification = await verifyPaystackTransaction(payment.reference, paystackSecret);
        if (verification.data.status === "success") {
          await settleVerifiedPayment(payment.reference, verification.data);
          processed += 1;
        } else {
          await db.paymentIntent.update({ where: { id: payment.id }, data: { failureReason: `PROVIDER_STATUS_${verification.data.status.toUpperCase()}` } });
          pending += 1;
        }
      } catch (cause) {
        const failure = normalizeError(cause, "Payment reconciliation failed.");
        await db.paymentIntent.update({ where: { id: payment.id }, data: { failureReason: failure.code } });
        logEvent(failure.report === "error" ? "error" : "warn", "payments.reconcile.item-failed", { requestId: context.requestId, paymentId: payment.id, reference: payment.reference, code: failure.code, retryable: failure.retryable });
        failed += 1;
      }
    }

    return apiSuccess(context, { inspected: candidates.length, processed, pending, failed }, "Reconciliation pass completed.");
  });
}
