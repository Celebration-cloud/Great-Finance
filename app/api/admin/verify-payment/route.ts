import { z } from "zod";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";
import { appendAuditLog } from "@/features/audit/service";
import { mintVendorCoupons } from "@/features/coupons/service";

const verifyTokenSchema = z.object({
  paymentIntentId: z.string().min(1, "Payment intent ID is required."),
  /**
   * Optional override amounts when the provider returned a different value
   * than what Paystack's dashboard shows. Admin provides the verified amount.
   */
  confirmedAmountMinor: z.number().int().positive("Confirmed amount must be positive."),
  confirmedCurrency: z.string().length(3, "Currency must be a 3-character ISO code.").toUpperCase(),
  adminNote: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  return withApiHandler(request, "admin.verify_token_purchase", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiRole(
      principal,
      ["ADMIN", "SUPER_ADMIN"],
      "Only administrators can manually verify token purchases."
    );

    const body = verifyTokenSchema.safeParse(await readJson(request));
    if (!body.success) {
      throw errors.validation("Invalid verification request.", body.error.flatten().fieldErrors);
    }

    const { paymentIntentId, confirmedAmountMinor, confirmedCurrency, adminNote } = body.data;
    const db = getPrisma();

    const payment = await db.paymentIntent.findUnique({ where: { id: paymentIntentId } });

    if (!payment) {
      throw errors.notFound("Payment intent not found.");
    }

    if (payment.status === "SUCCEEDED") {
      throw errors.conflict(
        "This payment has already been verified and settled. Coupons were issued automatically."
      );
    }

    if (payment.status === "CANCELLED" || payment.status === "FAILED") {
      throw errors.conflict(
        `This payment is in a terminal state (${payment.status}) and cannot be manually verified.`
      );
    }

    // Perform manual settlement using admin-confirmed figures
    await db.$transaction(async (tx) => {
      // Force-settle the payment using admin-confirmed amounts
      const clearing = await tx.ledgerAccount.upsert({
        where: {
          organizationId_code_currency: {
            organizationId: payment.organizationId,
            code: "PAYSTACK_CLEARING",
            currency: confirmedCurrency,
          },
        },
        create: {
          organizationId: payment.organizationId,
          code: "PAYSTACK_CLEARING",
          name: "Paystack clearing",
          type: "ASSET",
          currency: confirmedCurrency,
        },
        update: {},
      });

      const revenue = await tx.ledgerAccount.upsert({
        where: {
          organizationId_code_currency: {
            organizationId: payment.organizationId,
            code: "COLLECTION_REVENUE",
            currency: confirmedCurrency,
          },
        },
        create: {
          organizationId: payment.organizationId,
          code: "COLLECTION_REVENUE",
          name: "Collection revenue",
          type: "REVENUE",
          currency: confirmedCurrency,
        },
        update: {},
      });

      const { postLedgerTransaction } = await import("@/features/ledger/service");
      await postLedgerTransaction(tx, {
        reference: `MANUAL-VERIFY-${payment.reference}`,
        idempotencyKey: `admin:manual_verify:${payment.reference}`,
        description: `Admin manual verification of payment ${payment.reference} by ${principal.email}`,
        occurredAt: new Date(),
        createdBy: principal.userId,
        entries: [
          { accountId: clearing.id, direction: "DEBIT", amountMinor: BigInt(confirmedAmountMinor), currency: confirmedCurrency },
          { accountId: revenue.id, direction: "CREDIT", amountMinor: BigInt(confirmedAmountMinor), currency: confirmedCurrency },
        ],
      });

      await tx.paymentIntent.update({
        where: { id: payment.id },
        data: {
          status: "SUCCEEDED",
          verifiedAt: new Date(),
          amountMinor: BigInt(confirmedAmountMinor),
          currency: confirmedCurrency,
        },
      });

      // Create outbox event for coupon minting
      await tx.outboxEvent.create({
        data: {
          aggregateType: "payment",
          aggregateId: payment.id,
          eventType: "payment.succeeded",
          payload: {
            reference: payment.reference,
            organizationId: payment.organizationId,
            manuallyVerifiedBy: principal.userId,
          },
        },
      });

      await appendAuditLog(tx, {
        actorId: principal.userId,
        actorRole: principal.role,
        action: "payment.manually_verified",
        entityType: "payment_intent",
        entityId: payment.id,
        metadata: {
          reference: payment.reference,
          organizationId: payment.organizationId,
          confirmedAmountMinor,
          confirmedCurrency,
          adminNote: adminNote ?? null,
          originalStatus: payment.status,
        },
      });
    });

    // Mint coupons immediately based on payment metadata
    let couponsIssued = 0;
    try {
      const meta = payment.metadata as { planItems?: { planAmount: number; quantity: number }[] } | null;
      const planItems = meta?.planItems;
      if (planItems && planItems.length > 0) {
        await mintVendorCoupons(payment.organizationId, payment.reference, planItems);
        couponsIssued = planItems.reduce((sum, item) => sum + item.quantity, 0);
      }
    } catch {
      // Coupon minting failure is non-fatal — the outbox event will retry
    }

    return apiSuccess(
      context,
      {
        reference: payment.reference,
        organizationId: payment.organizationId,
        confirmedAmountMinor,
        confirmedCurrency,
        couponsIssued,
      },
      `Payment ${payment.reference} has been manually verified and settled. ${couponsIssued > 0 ? `${couponsIssued} coupon(s) issued.` : "Coupon minting queued via outbox."}`
    );
  });
}
