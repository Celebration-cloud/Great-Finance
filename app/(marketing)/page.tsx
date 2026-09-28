import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Lock,
  Mail,
  MessageCircle,
  Percent,
  Receipt,
  ShieldCheck,
  Store,
  TrendingUp,
} from "lucide-react";
import { investmentPlans } from "@/features/content/legacy-content";
import { AminaVendorScene } from "@/components/brand/illustrations/amina-vendor-scene";
import { KineticLedgerWheel } from "@/components/brand/illustrations/kinetic-ledger-wheel";
import { GuillochePattern } from "@/components/brand/illustrations/guilloche-pattern";

export const metadata = {
  title: "Great Finance | Investment Plans and Vendor Services",
  description:
    "Exceed your financial struggles with Great Finance. Verifiable double-entry ledgers, high-yield investment plans, and a high-margin authorized vendor distribution network across Nigeria.",
};

const vendorPerks = [
  {
    icon: Percent,
    title: "Wholesale Margin Up To 15%",
    desc: "Acquire coupon batches at substantial wholesale discounts and distribute at full face value to local investors for immediate profit.",
  },
  {
    icon: Receipt,
    title: "Real-Time Inventory Ledger",
    desc: "Every purchased coupon appears in your vendor dashboard with its redemption status and delivery time.",
  },
  {
    icon: ShieldCheck,
    title: "Protected Capital & Zero Holding Risk",
    desc: "All coupon packs are backed by verified Paystack checkout and instant ledger escrow. No stranded capital or unbacked vouchers.",
  },
  {
    icon: MessageCircle,
    title: "Dedicated Partner Desk",
    desc: "Direct access to WhatsApp priority vendor support for batch issuances, custom high-volume allocations, and expedited KYC verification.",
  },
];

export default function MarketingHomePage() {
  return (
    <div className="space-y-24 py-8 sm:space-y-36 sm:py-14">
      {/* ========================================================================= */}
      {/* 01. SIGNATURE HERO SECTION: THE KINETIC LEDGER */}
      {/* ========================================================================= */}
      <section className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-7">
            <div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[var(--ink)] leading-[1.06]">
                Build a stronger financial future with{" "}
                <span className="text-[var(--brand)]">
                  Great Finance
                </span>
                .
              </h1>
            </div>

            {/* Subtitle */}
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              Choose a fixed-term investment plan or grow a coupon distribution business as an authorized vendor.
            </p>

            {/* Dual Asymmetrical Action Deck */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-900/30 transition hover:from-emerald-500 hover:to-emerald-400"
              >
                <span>Create an account</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/vendor/signup"
                className="inline-flex items-center gap-2.5 rounded-xl border border-amber-500/50 bg-amber-500/10 px-6 py-4 text-sm font-bold text-amber-300 shadow-sm transition hover:bg-amber-500/20"
              >
                <Store size={18} className="text-amber-400" />
                <span>Become a vendor</span>
              </Link>

              <Link
                href="/plans"
                className="inline-flex items-center gap-1.5 rounded-xl px-5 py-4 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition"
              >
                <span>View plans</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Integrated Vector Artwork (Amina, The Regional Vendor) */}
          <div className="relative">
            <AminaVendorScene />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. SIGNATURE MOMENT 1: KINETIC DOUBLE-ENTRY ECOSYSTEM */}
      {/* ========================================================================= */}
      <section className="shell">
        <KineticLedgerWheel />
      </section>

      {/* ========================================================================= */}
      {/* 04. EDITORIAL DUAL SPREAD: INVESTOR VS VENDOR FOLIO */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="space-y-3 max-w-2xl">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
            Two ways to use Great Finance
          </h2>
          <p className="text-base leading-relaxed text-[var(--muted)]">
            Invest in a fixed-term plan or purchase coupon inventory to sell as an authorized vendor.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Folio Left: Individual Customer Path */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-12 shadow-xl overflow-hidden group hover:border-emerald-500/40 transition">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
                  <TrendingUp size={24} />
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
                  Individual Wealth Building
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  Activate a fixed-term plan with an official coupon and follow its status from your dashboard.
                </p>
              </div>

              <ul className="space-y-3.5 text-sm text-[var(--ink)]/90 pt-2 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Fixed yields starting from ₦2,000 up to ₦50,000 plans</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Instant activation via authorized regional vendor or Paystack</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Transparent referral incentives with live workspace attribution</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Direct automated disbursement to your verified CBN bank account</span>
                </li>
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--line)] flex items-center justify-between">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>Register Customer Account</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/plans" className="text-xs font-mono text-[var(--muted)] hover:underline">
                View All Plans →
              </Link>
            </div>
          </div>

          {/* Folio Right: Authorized Vendor Path */}
          <div className="relative flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[var(--surface)] to-amber-950/10 p-8 sm:p-12 shadow-xl overflow-hidden group hover:border-amber-500/50 transition">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-400">
                  <Store size={24} />
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
                  Authorized Regional Vendor
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  Become an authorized regional partner. Acquire coupon inventory in bulk at exclusive wholesale discounts and distribute to customers for immediate retail profit.
                </p>
              </div>

              <ul className="space-y-3.5 text-sm text-[var(--ink)]/90 pt-2 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  <span>Earn up to 15% wholesale profit margin per coupon batch</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  <span>Serve community investors who prefer cash, USSD, or direct transfer</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  <span>Private vendor dashboard with live inventory & redemption logs</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
                  <span>Fast Tier-1 KYC verification with dedicated WhatsApp partner desk</span>
                </li>
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-[var(--line)] flex items-center justify-between">
              <Link
                href="/vendor/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-[var(--surface-inverse)] shadow hover:bg-amber-400 transition"
              >
                <span>Apply as Authorized Vendor</span>
                <ArrowRight size={14} />
              </Link>
              <Link href="/vendors" className="text-xs font-mono text-amber-300 hover:underline">
                Vendor Margin Guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. TABULAR BOND CATALOGUE: INVESTMENT PLANS */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--line)] pb-6">
          <div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)] mt-1">
              Investment plans
            </h2>
          </div>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:underline"
          >
            <span>Explore Full Catalogue</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {investmentPlans.map((plan, index) => {
            const isFeatured = index === 3;
            const yieldPercent = Math.round(((plan.returnAmount - plan.amount) / plan.amount) * 100);
            return (
              <article
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                  isFeatured
                    ? "border-2 border-emerald-500 bg-gradient-to-br from-emerald-950/60 to-[var(--surface)] shadow-2xl shadow-emerald-950/50"
                    : "border border-[var(--line)] bg-[var(--surface)] hover:border-emerald-500/30"
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3 right-6 rounded-full bg-amber-400 px-3 py-0.5 text-[0.68rem] font-mono font-black text-[var(--surface-inverse)] uppercase tracking-wider">
                    FEATURED TIER
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
                      <span className="text-xs font-mono text-[var(--muted)]">Guaranteed Matured Return</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">+{yieldPercent}% ROI</span>
                    </div>
                    <p className="font-mono text-2xl font-black text-emerald-400 tabular-nums mt-1">
                      ₦{plan.returnAmount.toLocaleString("en-NG")}
                    </p>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[var(--muted)]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Instant coupon voucher activation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Automated NUBAN bank settlement on maturity</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--muted)]">Single Coupon Mint</span>
                  <Link
                    href="/dashboard/investment"
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-extrabold text-emerald-400 hover:text-emerald-300"
                  >
                    <span>Invest Now</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. WHOLESALE DISTRIBUTOR NETWORK SPOTLIGHT & ROADMAP */}
      {/* ========================================================================= */}
      <section className="bg-[var(--surface-inverse)] py-20 border-y border-[var(--line)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <GuillochePattern />
        </div>

        <div className="shell space-y-16 relative z-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Why vendors choose Great Finance
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Our vendor program provides a legitimate, low-barrier, high-margin opportunity for entrepreneurs, community leaders, and financial agents across Nigeria.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vendorPerks.map((perk) => (
              <div
                key={perk.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 space-y-4 hover:border-amber-500/40 transition"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <perk.icon size={22} />
                </span>
                <h3 className="font-display text-base font-bold text-white">{perk.title}</h3>
                <p className="text-xs leading-relaxed text-white/60">{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* 3-Step Vendor Onboarding Roadmap */}
          <div className="rounded-3xl border border-white/10 bg-[var(--surface)] p-8 sm:p-12 space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  3 Simple Steps to Start Earning as a Vendor
                </h3>
                <p className="text-xs font-mono text-white/60">Fast onboarding, instantaneous activation upon KYC review</p>
              </div>
              <Link
                href="/vendor/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-mono font-black text-[var(--surface-inverse)] shadow hover:bg-amber-300 transition"
              >
                <span>Register as Vendor Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="space-y-3">
                <span className="font-mono text-3xl font-black text-amber-400">01</span>
                <h4 className="font-display text-base font-bold text-white">Create Vendor Profile</h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Register with your business or personal name, active email, and WhatsApp telephone number for verification.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-mono text-3xl font-black text-amber-400">02</span>
                <h4 className="font-display text-base font-bold text-white">Submit Tier-1 KYC</h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Upload a verified government identity document (NIN, Passport, Voter's Card) via our encrypted document vault.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-mono text-3xl font-black text-amber-400">03</span>
                <h4 className="font-display text-base font-bold text-white">Acquire & Distribute</h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Purchase coupon packs in bulk at wholesale discount using Paystack, distribute to investors, and pocket instant margins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. INSTITUTIONAL GOVERNANCE & SECURITY BLUEPRINT */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="space-y-3 max-w-2xl">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--ink)]">
            How your records are protected
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Payments, coupon activity, and withdrawal approvals are recorded with clear controls and a review history.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={22} />
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">Double-Entry Ledger Integrity</h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              Every deposit, coupon sale, and return payout creates balanced debit and credit entries. Total assets always reconcile against liabilities.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Lock size={22} />
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">Private document storage</h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              KYC documents are delivered directly to private cloud storage using signed, short-lived URLs. Documents are never stored in public buckets.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <FileCheck2 size={22} />
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">Approval history</h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              Administrative approvals and payouts are recorded so authorized staff can review when and why each action occurred.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08. VERIFIED SUPPORT & CONTACT FOLIO */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-muted)] to-[var(--surface)] p-8 sm:p-14 shadow-2xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-5">
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
                Have questions before starting?
              </h2>
              <p className="text-sm leading-relaxed text-[var(--muted)] max-w-xl">
                Our support team and vendor management desk are available via official email and direct WhatsApp messaging to assist with onboarding, plan inquiries, and bulk acquisitions.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://wa.me/2347031069524"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-mono font-bold text-white shadow-md transition hover:bg-emerald-500"
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp (07031069524)</span>
                </a>
                <a
                  href="mailto:greatfinanceng@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-6 py-3.5 text-xs font-mono font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--surface-elevated)] transition"
                >
                  <Mail size={16} />
                  <span>greatfinanceng@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-inverse)] p-6 space-y-4">
              <h3 className="font-display text-sm font-bold text-[var(--ink)]">Quick Resource Access</h3>
              <div className="grid gap-2.5 text-xs font-mono">
                <Link
                  href="/plans"
                  className="flex items-center justify-between rounded-xl p-3 border border-[var(--line)] hover:border-emerald-500/40 bg-[var(--surface)] transition"
                >
                  <span className="font-semibold text-[var(--ink)]">Catalogue of Investment Plans</span>
                  <span className="text-emerald-400 font-bold">View →</span>
                </Link>
                <Link
                  href="/vendors"
                  className="flex items-center justify-between rounded-xl p-3 border border-[var(--line)] hover:border-emerald-500/40 bg-[var(--surface)] transition"
                >
                  <span className="font-semibold text-[var(--ink)]">Vendor Partner Program Guide</span>
                  <span className="text-emerald-400 font-bold">Read →</span>
                </Link>
                <Link
                  href="/withdrawals"
                  className="flex items-center justify-between rounded-xl p-3 border border-[var(--line)] hover:border-emerald-500/40 bg-[var(--surface)] transition"
                >
                  <span className="font-semibold text-[var(--ink)]">Withdrawal & Payout Rules</span>
                  <span className="text-emerald-400 font-bold">Inspect →</span>
                </Link>
                <Link
                  href="/vendor/signup"
                  className="flex items-center justify-between rounded-xl p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold transition hover:bg-amber-500/20"
                >
                  <span>Apply for Authorized Vendor Status</span>
                  <span>Apply →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
