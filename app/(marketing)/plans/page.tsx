import Link from "next/link";
import { ArrowRight, CheckCircle2, Store } from "lucide-react";
import { investmentPlans } from "@/features/content/legacy-content";

export const metadata = {
  title: "Investment Plans & Yield Catalogue · Great Finance",
  description:
    "Explore verified investment plans from ₦10,000 to ₦150,000 with guaranteed returns, double-entry ledger security, and coupon voucher activation.",
};

export default function PlansPage() {
  return (
    <div className="space-y-24 py-12 sm:space-y-32 sm:py-20">
      {/* Hero Section */}
      <section className="shell">
        <div className="max-w-3xl space-y-6">
          <p className="eyebrow">Catalogue & Returns</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-6xl">
            Transparent investment plans backed by verified reserves.
          </h1>
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            Every Great Finance plan features guaranteed tenure, fixed returns, and transparent double-entry accounting. Activate plans with coupon vouchers purchased online or through authorized regional vendors.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--brand)]/20 transition hover:bg-[var(--brand-dark)]"
            >
              <span>Register to Invest</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-5 py-3.5 text-sm font-bold text-[var(--accent-dark)] transition hover:bg-[var(--accent)]/20"
            >
              <Store size={16} />
              <span>Purchase via Regional Vendor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Full Plans Grid */}
      <section className="shell space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-extrabold text-[var(--ink)]">Available Plan Tiers</h2>
          <p className="text-xs text-[var(--muted)]">All payouts settled directly to verified bank accounts</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {investmentPlans.map((plan, index) => {
            const isFeatured = index === 3;
            const yieldPercent = Math.round(((plan.returnAmount - plan.amount) / plan.amount) * 100);
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-2xl p-8 transition ${
                  isFeatured
                    ? "bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-xl shadow-[var(--brand)]/20"
                    : "card bg-white hover:shadow-md"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-[var(--accent)] px-3 py-0.5 text-[0.68rem] font-bold text-[var(--surface-inverse)] uppercase tracking-wider">
                    Recommended
                  </span>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isFeatured ? "text-[var(--accent)]" : "text-[var(--brand)]"
                      }`}
                    >
                      {plan.name}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        isFeatured ? "bg-white/20 text-white" : "bg-[var(--surface-muted)] text-[var(--ink)]"
                      }`}
                    >
                      {plan.duration} Days Tenure
                    </span>
                  </div>

                  <div>
                    <p className={`text-xs ${isFeatured ? "text-white/70" : "text-[var(--muted)]"}`}>Principal Investment</p>
                    <p className="text-3xl font-extrabold tabular-nums tracking-tight">
                      ₦{plan.amount.toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div className={`rounded-xl p-4 ${isFeatured ? "bg-white/10" : "bg-[var(--surface-muted)]"}`}>
                    <div className="flex items-baseline justify-between">
                      <p className={`text-xs ${isFeatured ? "text-white/70" : "text-[var(--muted)]"}`}>Total Return</p>
                      <span className="text-xs font-bold text-emerald-400">+{yieldPercent}% ROI</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-400">
                      ₦{plan.returnAmount.toLocaleString("en-NG")}
                    </p>
                  </div>

                  <ul className={`space-y-2 text-xs ${isFeatured ? "text-white/80" : "text-[var(--muted)]"}`}>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={isFeatured ? "text-emerald-300" : "text-emerald-600"} />
                      <span>Instant coupon voucher activation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={isFeatured ? "text-emerald-300" : "text-emerald-600"} />
                      <span>Direct automated bank withdrawal on maturity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={isFeatured ? "text-emerald-300" : "text-emerald-600"} />
                      <span>24/7 ledger balance access in customer workspace</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-current/15 flex items-center justify-between">
                  <Link
                    href="/dashboard/investment"
                    className={`inline-flex items-center gap-1.5 text-xs font-bold hover:underline ${
                      isFeatured ? "text-[var(--accent)]" : "text-[var(--brand)]"
                    }`}
                  >
                    <span>Activate Plan</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/vendors"
                    className={`text-xs font-semibold ${isFeatured ? "text-white/70 hover:text-white" : "text-[var(--muted)] hover:text-[var(--ink)]"}`}
                  >
                    Find Vendor →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How to Invest Steps */}
      <section className="shell space-y-12">
        <div className="space-y-3">
          <p className="eyebrow">Step-By-Step Process</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            How to Begin Investing
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)] max-w-2xl">
            Simple, secure, and completed in minutes through our web portal or your local licensed vendor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-7 space-y-4">
            <span className="font-mono text-3xl font-bold text-[var(--brand)]">01</span>
            <h3 className="text-base font-bold text-[var(--ink)]">Register Your Customer Account</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Create an account at /signup with your name, phone number, and verified bank details for payout routing.
            </p>
          </div>

          <div className="card p-7 space-y-4">
            <span className="font-mono text-3xl font-bold text-[var(--brand)]">02</span>
            <h3 className="text-base font-bold text-[var(--ink)]">Obtain a Coupon Voucher</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Purchase an official coupon voucher code directly on our website or from any registered regional distribution vendor.
            </p>
          </div>

          <div className="card p-7 space-y-4">
            <span className="font-mono text-3xl font-bold text-[var(--brand)]">03</span>
            <h3 className="text-base font-bold text-[var(--ink)]">Redeem & Collect Return</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Enter your voucher code in your dashboard to activate the plan. When the tenure concludes, withdraw your returns directly to your bank.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
