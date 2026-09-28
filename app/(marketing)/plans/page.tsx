import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldCheck,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";
import { investmentPlans } from "@/features/content/legacy-content";
import { EmekaInvestorScene } from "@/components/brand/illustrations/emeka-investor-scene";
import { GuillochePattern } from "@/components/brand/illustrations/guilloche-pattern";

export const metadata = {
  title: "Investment Plans | Great Finance",
  description:
    "Explore verified investment plans from ₦2,000 to ₦50,000 with guaranteed returns, double-entry ledger security, and coupon voucher activation.",
};

export default function PlansPage() {
  return (
    <div className="space-y-24 py-8 sm:space-y-36 sm:py-14">
      {/* ========================================================================= */}
      {/* 01. HERO WITH EMEKA INVESTOR SCENE */}
      {/* ========================================================================= */}
      <section className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[var(--ink)] leading-[1.08]">
                Transparent yield plans backed by{" "}
                <span className="text-[var(--brand)]">verified reserves</span>.
              </h1>
            </div>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              Every Great Finance plan features guaranteed tenure, fixed returns, and transparent double-entry accounting. Activate plans with coupon vouchers acquired online or through authorized regional vendors.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-900/30 transition hover:bg-emerald-500"
              >
                <span>Register to Invest</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-6 py-4 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20"
              >
                <Store size={16} className="text-amber-400" />
                <span>Purchase via Regional Vendor</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-mono text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                No hidden charges
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Direct NUBAN bank transfer
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Automated maturity stamp
              </span>
            </div>
          </div>

          <div className="relative">
            <EmekaInvestorScene />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. FULL PLANS CATALOGUE */}
      {/* ========================================================================= */}
      <section className="shell space-y-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--line)] pb-5">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
              Available Investment Tiers
            </h2>
            <p className="text-xs font-mono text-[var(--muted)] mt-1">
              Select any tier below to activate via coupon voucher in your customer workspace
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {investmentPlans.map((plan, index) => {
            const isFeatured = index === 3;
            const yieldPercent = Math.round(((plan.returnAmount - plan.amount) / plan.amount) * 100);
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                  isFeatured
                    ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-950/60 to-[var(--surface)] shadow-2xl shadow-emerald-950/50"
                    : "border border-[var(--line)] bg-[var(--surface)] hover:border-emerald-500/30"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-amber-400 px-3 py-0.5 text-[0.68rem] font-mono font-black text-[var(--surface-inverse)] uppercase tracking-wider">
                    RECOMMENDED TIER
                  </span>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {plan.name}
                    </span>
                    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-xs font-bold text-[var(--ink)]">
                      {plan.duration} Days Tenure
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-mono uppercase text-[var(--muted)]">Principal Investment</p>
                    <p className="font-mono text-3xl sm:text-4xl font-black text-[var(--ink)] tabular-nums mt-1">
                      ₦{plan.amount.toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/60 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-mono text-[var(--muted)]">Total Return Payout</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">+{yieldPercent}% ROI</span>
                    </div>
                    <p className="font-mono text-2xl font-black text-emerald-400 tabular-nums mt-1">
                      ₦{plan.returnAmount.toLocaleString("en-NG")}
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-[var(--muted)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>Instant coupon voucher activation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>Direct automated bank withdrawal on maturity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span>24/7 ledger balance access in customer workspace</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--muted)]">Coupon Activated</span>
                  <Link
                    href="/dashboard/investment"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-extrabold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Invest Now</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. HOW TO INVEST STEP-BY-STEP */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-14 space-y-10 shadow-xl">
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl sm:text-4xl font-extrabold text-[var(--ink)]">
              How to activate an investment plan
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Plan activation is simple, safe, and verifiable. Follow these four steps to start growing your capital.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/50 p-6 space-y-3">
              <span className="font-mono text-2xl font-black text-emerald-400">01</span>
              <h4 className="font-display text-sm font-bold text-[var(--ink)]">Create Account</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Register on Great Finance with your name, valid email, and phone number in under 2 minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/50 p-6 space-y-3">
              <span className="font-mono text-2xl font-black text-emerald-400">02</span>
              <h4 className="font-display text-sm font-bold text-[var(--ink)]">Select Vendor</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Browse our authorized distributor list and contact an approved vendor via WhatsApp to buy coupon codes.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/50 p-6 space-y-3">
              <span className="font-mono text-2xl font-black text-emerald-400">03</span>
              <h4 className="font-display text-sm font-bold text-[var(--ink)]">Redeem Coupon</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Enter your issued coupon voucher in your customer workspace. Your plan starts instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/50 p-6 space-y-3">
              <span className="font-mono text-2xl font-black text-emerald-400">04</span>
              <h4 className="font-display text-sm font-bold text-[var(--ink)]">Withdraw Funds</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                On the maturity date, click withdraw to receive your principal and return directly to your bank.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
