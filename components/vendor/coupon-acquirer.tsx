"use client";

import { LoaderCircle, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { investmentPlans } from "@/features/content/legacy-content";

export function CouponAcquirer() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string>();
  const total = useMemo(() => investmentPlans.reduce((sum, plan) => sum + plan.amount * (quantities[plan.amount] ?? 0), 0), [quantities]);
  const update = (amount: number, change: number) => setQuantities((current) => ({ ...current, [amount]: Math.max(0, (current[amount] ?? 0) + change) }));
  const pay = async () => {
    setStatus("loading"); setError(undefined);
    const response = await fetch("/api/payments/initialize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amountMinor: total * 100, currency: "NGN", idempotencyKey: `vendor-coupon-${crypto.randomUUID()}` }) });
    const result = await response.json() as { data?: { authorizationUrl?: string }; message?: string };
    if (!response.ok || !result.data?.authorizationUrl) { setStatus("error"); setError(result.message ?? "Unable to initialize payment."); return; }
    window.location.assign(result.data.authorizationUrl);
  };
  return <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]"><div className="grid gap-3">{investmentPlans.map((plan) => <article className="grid gap-4 rounded-2xl bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center" key={plan.name}><div><p className="text-xs font-bold tracking-[.1em] text-[var(--brand)]">{plan.name}</p><p className="mt-2 font-semibold"><span className="tabular-nums">₦{plan.amount.toLocaleString()}</span> <span className="text-sm font-normal text-[var(--muted)]">to get</span> <span className="tabular-nums">₦{plan.returnAmount.toLocaleString()}</span></p></div><div><p className="mb-2 text-xs text-[var(--muted)]">Quantity</p><div className="flex items-center gap-3"><button aria-label={`Remove ${plan.name}`} onClick={() => update(plan.amount, -1)} className="grid size-9 place-items-center rounded-lg bg-[var(--surface-muted)] text-[var(--ink)]"><Minus size={16}/></button><output className="w-8 text-center font-bold tabular-nums">{quantities[plan.amount] ?? 0}</output><button aria-label={`Add ${plan.name}`} onClick={() => update(plan.amount, 1)} className="grid size-9 place-items-center rounded-lg bg-[var(--brand)] text-white"><Plus size={16}/></button></div></div></article>)}</div><aside className="card h-fit p-6 xl:sticky xl:top-6"><p className="text-sm text-[var(--muted)]">Total acquisition</p><p className="mt-2 text-3xl font-semibold tabular-nums">₦{total.toLocaleString()}</p>{total < 10000 && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Your total acquisition must be at least ₦10,000.</p>}<button disabled={total < 10000 || status === "loading"} onClick={pay} className="mt-6 flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-50">{status === "loading" ? <LoaderCircle className="animate-spin"/> : "Proceed to payment"}</button>{error && <p role="alert" className="mt-3 text-sm text-[var(--danger)]">{error}</p>}<p className="mt-4 text-xs leading-5 text-[var(--muted)]">Paystack hosts checkout. Great Finance credits coupons only after signed webhook verification and reconciliation.</p></aside></div>;
}
