"use client";

import { useState } from "react";

export function CouponCodeForm() {
  const [code, setCode] = useState("");
  return <form className="flex flex-col gap-3 rounded-2xl bg-white p-5 sm:flex-row" onSubmit={(event) => event.preventDefault()}><label className="sr-only" htmlFor="coupon-code">Enter your coupon code</label><input id="coupon-code" className="min-w-0 flex-1 rounded-xl border border-[var(--line)] px-4 py-3" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter your coupon code"/><button disabled className="rounded-xl bg-[var(--brand)] px-6 py-3 font-bold text-white opacity-55">Invest</button><p className="self-center text-xs text-[var(--muted)] sm:max-w-48">Redemption stays disabled until verified coupon inventory is imported.</p></form>;
}
