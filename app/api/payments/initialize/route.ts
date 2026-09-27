import { initializePaymentSchema } from "@/features/payments/schemas";
import { initializePayment } from "@/features/payments/service";
import { requireApiPermission, requireApiPrincipal } from "@/lib/auth/api";
import { getServerEnv } from "@/lib/env/server";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";

export async function POST(request: Request) {
  return withApiHandler(request, "payment.initialize", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiPermission(principal, "payment:create");
    const body = initializePaymentSchema.safeParse(await readJson(request));
    if (!body.success) throw errors.validation("Invalid payment request.", body.error.flatten().fieldErrors);
    if (principal.role === "VENDOR") {
      const db = (await import("@/lib/db")).getPrisma();
      const approvedKyc = await db.approvalRequest.findFirst({
        where: { resourceType: "vendor-kyc", requestedBy: principal.userId, status: "APPROVED" },
      });
      if (!approvedKyc) {
        throw errors.forbidden("Tier-1 KYC verification must be approved before acquiring wholesale coupon packages.");
      }
    }

    const env = getServerEnv();
    const payment = await initializePayment(
      {
        organizationId: principal.organizationId,
        actorId: principal.userId,
        email: principal.email,
        amountMinor: body.data.amountMinor,
        currency: body.data.currency,
        idempotencyKey: body.data.idempotencyKey,
        planItems: body.data.planItems,
      },
      { secret: env.PAYSTACK_SECRET_KEY, appUrl: env.APP_URL }
    );
    return apiSuccess(context, { reference: payment.reference, authorizationUrl: payment.authorizationUrl }, "Payment initialized.", 201);
  });
}
