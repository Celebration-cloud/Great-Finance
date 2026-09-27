"use client";

import { CheckCircle2, LoaderCircle, Sparkles, Ticket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApiMutation } from "@/hooks/use-api-mutation";

interface RedeemResult {
  investment: {
    id: string;
    planName: string;
    returnAmount: number;
    matureAt: string;
  };
}

export function CouponCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [lastRedeemed, setLastRedeemed] = useState<RedeemResult["investment"] | null>(null);

  const { mutate, isLoading, error } = useApiMutation<RedeemResult, { code: string }>(
    "/api/coupons/redeem",
    {
      successMessage: "Coupon redeemed successfully! Investment is now active.",
      onSuccess: (data) => {
        setLastRedeemed(data.investment);
        setCode("");
        router.refresh();
      },
    }
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;
    await mutate({ code: cleanCode });
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--muted)]">
              <Ticket size={18} />
            </span>
            <label className="sr-only" htmlFor="coupon-code">
              Enter coupon code
            </label>
            <input
              id="coupon-code"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. GF-STA-9A4B-3C2D"
              disabled={isLoading}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 py-3.5 pl-11 pr-4 font-mono text-sm font-bold tracking-wider text-[var(--ink)] placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15 disabled:opacity-50 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-7 py-3.5 text-sm font-bold text-white shadow-sm shadow-[var(--brand)]/20 hover:bg-[var(--brand-dark)] transition disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                <span>Verifying & Activating...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Redeem & Invest</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {error.message}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)]/60 pt-3 text-xs text-[var(--muted)]">
          <span>Purchased from an authorized distributor? Enter the 16-character code above.</span>
          <Link
            href="/dashboard/purchase"
            className="font-bold text-[var(--brand)] hover:underline"
          >
            Need a coupon? Find verified vendors →
          </Link>
        </div>
      </form>

      {/* Success banner if redeemed in current session */}
      {lastRedeemed && (
        <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-sm">
          <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-emerald-900">
              {lastRedeemed.planName} Plan Successfully Activated!
            </h4>
            <p className="text-xs text-emerald-800">
              Expected Return:{" "}
              <strong className="font-bold text-emerald-950">
                ₦{lastRedeemed.returnAmount.toLocaleString("en-NG")}
              </strong>{" "}
              • Maturity Date:{" "}
              <strong className="font-bold text-emerald-950">
                {new Date(lastRedeemed.matureAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
