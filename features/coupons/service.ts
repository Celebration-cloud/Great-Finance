import "server-only";
import { getPrisma } from "@/lib/db";
import { investmentPlans } from "@/features/content/legacy-content";
import { generateCouponCodes } from "./codegen";
import { appendAuditLog } from "@/features/audit/service";

type PlanItem = { planAmount: number; quantity: number };

/**
 * Mint coupons after a vendor payment is verified.
 * Called from the webhook handler after settleVerifiedPayment succeeds.
 *
 * @param vendorOrgId  - organization that paid
 * @param purchaseRef  - PaymentIntent.reference
 * @param items        - array of { planAmount, quantity } from payment metadata
 */
export async function mintVendorCoupons(
  vendorOrgId: string,
  purchaseRef: string,
  items: PlanItem[]
): Promise<void> {
  const db = getPrisma();

  const rows = items.flatMap(({ planAmount, quantity }) => {
    const plan = investmentPlans.find((p) => p.amount === planAmount);
    if (!plan || quantity <= 0) return [];

    const codes = generateCouponCodes(plan.name, quantity);
    // expire coupons 90 days from now if unused
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    return codes.map((code) => ({
      code,
      planName: plan.name,
      planAmount: plan.amount,
      returnAmount: plan.returnAmount,
      durationDays: plan.duration,
      vendorOrgId,
      purchaseRef,
      expiresAt,
    }));
  });

  if (rows.length === 0) return;

  await db.$transaction(async (tx) => {
    await tx.coupon.createMany({ data: rows, skipDuplicates: true });
    await appendAuditLog(tx, {
      actorId: "system:webhook",
      actorRole: "SYSTEM",
      action: "coupon.batch-minted",
      entityType: "coupon",
      entityId: purchaseRef,
      metadata: { vendorOrgId, purchaseRef, totalMinted: rows.length },
    });
  });
}

/**
 * Redeem a coupon code for a customer. Atomic — cannot double-redeem.
 */
export async function redeemCoupon(
  code: string,
  customerId: string,
  customerOrgId: string
): Promise<{ investment: { id: string; planName: string; returnAmount: number; matureAt: Date } }> {
  const db = getPrisma();

  return db.$transaction(async (tx) => {
    const coupon = await tx.coupon.findUnique({ where: { code: code.trim().toUpperCase() } });

    if (!coupon) {
      throw Object.assign(new Error("Coupon code not found. Please check and try again."), { code: "COUPON_NOT_FOUND", status: 404 });
    }
    if (coupon.status === "REDEEMED") {
      throw Object.assign(new Error("This coupon has already been redeemed."), { code: "COUPON_ALREADY_REDEEMED", status: 409 });
    }
    if (coupon.status === "VOIDED") {
      throw Object.assign(new Error("This coupon has been voided by the platform."), { code: "COUPON_VOIDED", status: 410 });
    }
    if (coupon.status === "EXPIRED" || (coupon.expiresAt && coupon.expiresAt < new Date())) {
      await tx.coupon.update({ where: { id: coupon.id }, data: { status: "EXPIRED" } });
      throw Object.assign(new Error("This coupon has expired."), { code: "COUPON_EXPIRED", status: 410 });
    }

    const matureAt = new Date(Date.now() + coupon.durationDays * 24 * 60 * 60 * 1000);

    const [, investment] = await Promise.all([
      tx.coupon.update({
        where: { id: coupon.id },
        data: { status: "REDEEMED", redeemedBy: customerId, redeemedAt: new Date() },
      }),
      tx.investment.create({
        data: {
          couponId: coupon.id,
          customerId,
          orgId: customerOrgId,
          planName: coupon.planName,
          planAmount: coupon.planAmount,
          returnAmount: coupon.returnAmount,
          durationDays: coupon.durationDays,
          matureAt,
        },
      }),
    ]);

    await appendAuditLog(tx, {
      actorId: customerId,
      actorRole: "CUSTOMER",
      action: "coupon.redeemed",
      entityType: "coupon",
      entityId: coupon.id,
      metadata: { code: coupon.code, planName: coupon.planName, investmentId: investment.id },
    });

    return { investment: { id: investment.id, planName: investment.planName, returnAmount: investment.returnAmount, matureAt: investment.matureAt } };
  });
}
