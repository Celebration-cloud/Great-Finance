"use client";

import { LoaderCircle, Minus, Percent, Plus, ShieldCheck } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { investmentPlans } from "@/features/content/legacy-content";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { calculateWholesalePrice, VENDOR_TIERS, type VendorTierKey } from "@/lib/vendor/tiers";

export function CouponAcquirer({ vendorTier = "TIER_1_STARTER" }: { vendorTier?: VendorTierKey }) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const paymentAttempt = useRef<{ totalPayable: number; key: string } | null>(null);

  const tierConfig = VENDOR_TIERS[vendorTier] ?? VENDOR_TIERS.TIER_1_STARTER;

  const faceTotal = useMemo(
    () => investmentPlans.reduce((sum, plan) => sum + plan.amount * (quantities[plan.amount] ?? 0), 0),
    [quantities],
  );

  const { discountMinor, payableMinor, marginPercent } = useMemo(
    () => calculateWholesalePrice(faceTotal * 100, vendorTier),
    [faceTotal, vendorTier],
  );

  const payableTotal = payableMinor / 100;
  const discountTotal = discountMinor / 100;

  /** Build the plan breakdown — filter out zero-quantity entries */
  const planItems = useMemo(
    () =>
      investmentPlans
        .filter((plan) => (quantities[plan.amount] ?? 0) > 0)
        .map((plan) => ({ planAmount: plan.amount, quantity: quantities[plan.amount]! })),
    [quantities],
  );

  const { mutate, isLoading, isError, error } = useApiMutation<
    { authorizationUrl: string },
    { amountMinor: number; currency: string; idempotencyKey: string; planItems: { planAmount: number; quantity: number }[] }
  >("/api/payments/initialize", {
    successMessage: false, // redirect handles the happy path — no toast needed
    errorMessage: false,   // shown inline in the sidebar instead
    onSuccess(data) {
      window.location.assign(data.authorizationUrl);
    },
  });

  const update = (amount: number, change: number) =>
    setQuantities((current) => ({ ...current, [amount]: Math.max(0, (current[amount] ?? 0) + change) }));

  const pay = async () => {
    if (!paymentAttempt.current || paymentAttempt.current.totalPayable !== payableTotal) {
      paymentAttempt.current = { totalPayable: payableTotal, key: `vendor-coupon-${crypto.randomUUID()}` };
    }
    await mutate({
      amountMinor: payableMinor,
      currency: "NGN",
      idempotencyKey: paymentAttempt.current.key,
      planItems,
    });
  };

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="grid gap-3">
        {/* Tier Discount Banner */}
        <div className="flex items-center justify-between rounded-2xl border border-[var(--brand)]/30 bg-gradient-to-r from-[var(--brand)]/10 to-emerald-50/50 p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-white shadow-sm">
              <Percent size={18} />
            </span>
            <div>
              <p className="text-xs font-bold text-[var(--ink)]">
                Active Partner Tier: <span className="text-[var(--brand)]">{tierConfig.name}</span>
              </p>
              <p className="text-[0.7rem] text-[var(--muted)]">
                You receive an automatic <strong className="text-emerald-700">{marginPercent}% wholesale discount</strong> deducted directly at checkout.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {tierConfig.marginLabel}
          </span>
        </div>

        {investmentPlans.map((plan) => (
          <article className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center border border-[var(--line)] shadow-sm" key={plan.name}>
            <div>
              <p className="text-xs font-bold tracking-[.1em] text-[var(--brand)]">{plan.name}</p>
              <p className="mt-2 font-semibold">
                <span className="tabular-nums">₦{plan.amount.toLocaleString()}</span>{" "}
                <span className="text-sm font-normal text-[var(--muted)]">retail value • yields</span>{" "}
                <span className="tabular-nums text-emerald-700">₦{plan.returnAmount.toLocaleString()}</span>
                <span className="ml-2 text-xs font-normal text-[var(--muted)]">in {plan.duration} days</span>
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Your wholesale cost: <strong className="text-[var(--ink)]">₦{Math.round(plan.amount * (1 - marginPercent / 100)).toLocaleString()}</strong>
                {" "}(profit: <strong className="text-emerald-700">₦{Math.round(plan.amount * (marginPercent / 100)).toLocaleString()}</strong> / code)
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-[var(--muted)]">Quantity</p>
              <div className="flex items-center gap-3">
                <button aria-label={`Remove ${plan.name}`} onClick={() => update(plan.amount, -1)} className="grid size-9 place-items-center rounded-lg bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[var(--line)] transition"><Minus size={16} /></button>
                <output className="w-8 text-center font-bold tabular-nums">{quantities[plan.amount] ?? 0}</output>
                <button aria-label={`Add ${plan.name}`} onClick={() => update(plan.amount, 1)} className="grid size-9 place-items-center rounded-lg bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition"><Plus size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="card h-fit p-6 xl:sticky xl:top-6 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Wholesale Summary</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xs text-[var(--muted)]">Total Retail Value:</span>
            <span className="font-mono text-sm line-through text-[var(--muted)] tabular-nums">₦{faceTotal.toLocaleString()}</span>
          </div>
          {discountTotal > 0 && (
            <div className="flex items-baseline justify-between text-xs text-emerald-700 font-bold">
              <span>{tierConfig.name} Margin ({marginPercent}%):</span>
              <span className="font-mono tabular-nums">-₦{discountTotal.toLocaleString()}</span>
            </div>
          )}
          <div className="mt-2 border-t border-[var(--line)] pt-2 flex items-baseline justify-between">
            <span className="text-sm font-bold text-[var(--ink)]">Payable Amount:</span>
            <span className="text-2xl font-extrabold text-[var(--brand)] tabular-nums">₦{payableTotal.toLocaleString()}</span>
          </div>
          {discountTotal > 0 && (
            <p className="mt-1 text-right text-[0.7rem] font-bold text-emerald-700">
              Immediate Retail Profit: ₦{discountTotal.toLocaleString()}
            </p>
          )}
        </div>

        {/* Order summary */}
        {planItems.length > 0 && (
          <div className="space-y-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/50 p-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Package Breakdown</p>
            {planItems.map((item) => {
              const plan = investmentPlans.find((p) => p.amount === item.planAmount)!;
              return (
                <div key={item.planAmount} className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)]">{plan.name} × {item.quantity}</span>
                  <span className="font-bold tabular-nums">₦{(plan.amount * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}

        {faceTotal < 10000 && (
          <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
            Total face value acquisition must be at least ₦10,000.
          </p>
        )}

        <button
          disabled={faceTotal < 10000 || isLoading || planItems.length === 0}
          onClick={pay}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin" size={16} />
              <span>Redirecting to Paystack…</span>
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              <span>Proceed to Checkout (₦{payableTotal.toLocaleString()})</span>
            </>
          )}
        </button>

        {isError && (
          <p role="alert" className="text-xs text-[var(--danger)]">
            {error?.message ?? "The payment service could not be reached. Your payment has not been assumed successful. Please retry."}
          </p>
        )}

        <p className="text-[0.68rem] leading-relaxed text-[var(--muted)]">
          Paystack hosts secure checkout. Upon successful completion, coupon codes are automatically minted into your inventory table at 100% face value.
        </p>
      </aside>
    </div>
  );
}
