"use client";

import { LoaderCircle, Minus, Plus } from "lucide-react";
import { useMemo, useRef } from "react";
import { investmentPlans } from "@/features/content/legacy-content";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useState } from "react";

export function CouponAcquirer() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const paymentAttempt = useRef<{ total: number; key: string } | null>(null);

  const total = useMemo(
    () => investmentPlans.reduce((sum, plan) => sum + plan.amount * (quantities[plan.amount] ?? 0), 0),
    [quantities],
  );

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
    if (!paymentAttempt.current || paymentAttempt.current.total !== total) {
      paymentAttempt.current = { total, key: `vendor-coupon-${crypto.randomUUID()}` };
    }
    await mutate({
      amountMinor: total * 100,
      currency: "NGN",
      idempotencyKey: paymentAttempt.current.key,
      planItems,
    });
  };

  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="grid gap-3">
        {investmentPlans.map((plan) => (
          <article className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center" key={plan.name}>
            <div>
              <p className="text-xs font-bold tracking-[.1em] text-[var(--brand)]">{plan.name}</p>
              <p className="mt-2 font-semibold">
                <span className="tabular-nums">₦{plan.amount.toLocaleString()}</span>{" "}
                <span className="text-sm font-normal text-[var(--muted)]">to get</span>{" "}
                <span className="tabular-nums">₦{plan.returnAmount.toLocaleString()}</span>
                <span className="ml-2 text-xs font-normal text-[var(--muted)]">in {plan.duration} days</span>
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-[var(--muted)]">Quantity</p>
              <div className="flex items-center gap-3">
                <button aria-label={`Remove ${plan.name}`} onClick={() => update(plan.amount, -1)} className="grid size-9 place-items-center rounded-lg bg-[var(--surface-muted)] text-[var(--ink)]"><Minus size={16} /></button>
                <output className="w-8 text-center font-bold tabular-nums">{quantities[plan.amount] ?? 0}</output>
                <button aria-label={`Add ${plan.name}`} onClick={() => update(plan.amount, 1)} className="grid size-9 place-items-center rounded-lg bg-[var(--brand)] text-white"><Plus size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="card h-fit p-6 xl:sticky xl:top-6">
        <p className="text-sm text-[var(--muted)]">Total acquisition</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums">₦{total.toLocaleString()}</p>

        {/* Order summary */}
        {planItems.length > 0 && (
          <ul className="mt-4 space-y-1.5 rounded-xl border border-[var(--line)] p-3">
            {planItems.map((item) => {
              const plan = investmentPlans.find((p) => p.amount === item.planAmount)!;
              return (
                <li key={item.planAmount} className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)]">{plan.name} × {item.quantity}</span>
                  <span className="font-bold tabular-nums">₦{(plan.amount * item.quantity).toLocaleString()}</span>
                </li>
              );
            })}
          </ul>
        )}

        {total < 10000 && (
          <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            Your total acquisition must be at least ₦10,000.
          </p>
        )}
        <button
          disabled={total < 10000 || isLoading || planItems.length === 0}
          onClick={pay}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-50"
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Proceed to payment"}
        </button>
        {isError && (
          <p role="alert" className="mt-3 text-sm text-[var(--danger)]">
            {error?.message ?? "The payment service could not be reached. Your payment has not been assumed successful. Please retry."}
          </p>
        )}
        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
          Paystack hosts checkout. Great Finance mints coupon codes only after signed webhook verification and ledger reconciliation.
        </p>
      </aside>
    </div>
  );
}
