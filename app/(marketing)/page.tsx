import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  Landmark,
  Lock,
  Mail,
  MessageCircle,
  Percent,
  Receipt,
  Shield,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { investmentPlans } from "@/features/content/legacy-content";

export const metadata = {
  title: "Great Finance · Institutional Ledger, Verified Yield & Vendor Network",
  description:
    "Exceed your financial struggles with Great Finance. Verifiable double-entry ledgers, high-yield investment plans, and a high-margin authorized vendor distribution network.",
};

const metrics = [
  { label: "Ledger Volume Reconciled", value: "₦480M+", sub: "Verified via double-entry" },
  { label: "Authorized Vendors", value: "1,240+", sub: "Regional liquidity partners" },
  { label: "Average Settlement SLA", value: "< 2 Hours", sub: "Automated Paystack verification" },
  { label: "Audit Trail Integrity", value: "100%", sub: "Cryptographic hash-chained" },
];

const vendorPerks = [
  {
    icon: Percent,
    title: "Wholesale Margin Up To 15%",
    desc: "Acquire coupon batches at substantial wholesale discounts and distribute at full face value to local investors for immediate profit.",
  },
  {
    icon: Receipt,
    title: "Real-Time Inventory Ledger",
    desc: "Every acquired coupon code is cryptographically recorded in your vendor dashboard with live redemption tracking and delivery timestamps.",
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
    <div className="space-y-24 py-10 sm:space-y-32 sm:py-16">
      {/* Hero Section */}
      <section className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 px-3.5 py-1 text-xs font-bold text-[var(--brand)]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-[var(--brand)]"></span>
              </span>
              <span>VERIFIED INSTITUTIONAL LEDGER & VENDOR NETWORK</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-6xl sm:leading-[1.08] lg:text-7xl">
              Exceed your financial struggles today with{" "}
              <span className="bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] bg-clip-text text-transparent">
                Great Finance
              </span>
              .
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              A dual-engine financial platform: grow your personal wealth with audited, high-yield investment plans or build a profitable distribution business as an authorized regional vendor.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--brand)]/25 transition hover:bg-[var(--brand-dark)]"
              >
                <span>Create Customer Account</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/vendor/signup"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)]/60 bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent)]/5 px-6 py-3.5 text-sm font-bold text-[var(--accent-dark)] shadow-sm transition hover:bg-[var(--accent)]/30"
              >
                <Store size={18} />
                <span>Register as Vendor Partner</span>
              </Link>

              <Link
                href="/plans"
                className="inline-flex items-center gap-1.5 rounded-xl px-5 py-3.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition"
              >
                <span>View Plans</span>
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck size={16} className="text-emerald-600" />
                Double-Entry Accounting
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Paystack Verified
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <BadgeCheck size={16} className="text-emerald-600" />
                Instant Coupon Issuance
              </span>
            </div>
          </div>

          {/* Right Hero Graphic Card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[var(--ink)] via-[#0d2238] to-[#071526] p-8 text-white shadow-2xl shadow-[var(--ink)]/30">
              <div className="absolute -right-16 -top-16 size-56 rounded-full bg-[var(--brand)]/30 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 size-56 rounded-full bg-[var(--accent)]/15 blur-3xl pointer-events-none" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-lg bg-white/10 text-[var(--accent)]">
                      <Landmark size={18} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">Great Finance Core</p>
                      <p className="text-[0.65rem] text-white/60">Live Production Ledger</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-400">
                    Active Node
                  </span>
                </div>

                {/* Simulated Ledger Entry */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <p className="text-xs font-semibold text-white/70">Verified Coupon Settlement</p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold tracking-tight text-white tabular-nums">₦150,000.00</span>
                    <span className="text-xs font-semibold text-emerald-400">+100% Guaranteed</span>
                  </div>
                  <div className="flex items-center justify-between text-[0.68rem] text-white/50 pt-1 border-t border-white/5">
                    <span>Batch #GF-2026-904</span>
                    <span>Status: POSTED</span>
                  </div>
                </div>

                {/* Two Column Feature Highlight */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--accent)]">For Investors</p>
                    <p className="mt-1 text-xs text-white/80 font-medium">Guaranteed return durations from 30 to 120 days.</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400">For Vendors</p>
                    <p className="mt-1 text-xs text-white/80 font-medium">Direct bulk coupon distribution with instant margins.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/vendor/signup"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-3 text-xs font-extrabold text-[var(--ink)] shadow transition hover:bg-[var(--accent)]/90"
                  >
                    <Store size={15} />
                    <span>Apply for Authorized Vendor Status</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="shell">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:grid-cols-4 sm:p-8">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1">
              <p className="text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl tabular-nums">{m.value}</p>
              <p className="text-xs font-bold text-[var(--brand)]">{m.label}</p>
              <p className="text-[0.7rem] text-[var(--muted)]">{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Ecosystem: Investor vs Vendor Breakdown */}
      <section className="shell space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="eyebrow">Comprehensive Ecosystem</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            Two powerful ways to capitalize with Great Finance
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Whether you want passive returns on personal investments or an active, profitable distribution business, our platform provides complete transparency.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card 1: Individual Investor */}
          <div className="card flex flex-col justify-between p-8 sm:p-10 transition hover:shadow-lg">
            <div className="space-y-6">
              <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
                <TrendingUp size={24} />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Customer Track</span>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Individual Wealth Building</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Invest in verified financial plans through official coupon vouchers. Your principal and returns are secured on an immutable double-entry ledger.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-[var(--ink)]/80">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Returns starting from ₦10,000 up to ₦150,000 plans</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Automated redemption via vendor or direct online payment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Transparent referral bonuses with live tracking dashboard</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>Withdraw directly to your verified commercial bank account</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--line)]">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand)] hover:underline"
              >
                <span>Register as Customer</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Card 2: Distribution Vendor */}
          <div className="card flex flex-col justify-between border-2 border-[var(--accent)]/40 bg-gradient-to-b from-white to-[var(--surface-muted)]/50 p-8 sm:p-10 transition hover:shadow-lg">
            <div className="space-y-6">
              <div className="inline-flex size-12 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent-dark)]">
                <Store size={24} />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)]">Vendor Track</span>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Authorized Distribution Partner</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Become an authorized regional vendor. Acquire coupon inventory in bulk at exclusive wholesale discounts and distribute to customers for immediate retail margin.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-[var(--ink)]/80">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[var(--accent-dark)] shrink-0" />
                  <span>Earn up to 15% wholesale profit margin per coupon batch</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[var(--accent-dark)] shrink-0" />
                  <span>Serve offline investors who prefer cash, USSD, or direct bank transfer</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[var(--accent-dark)] shrink-0" />
                  <span>Full inventory tracking dashboard with real-time redemption logs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[var(--accent-dark)] shrink-0" />
                  <span>Fast KYC verification with dedicated WhatsApp partner support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--line)] flex items-center justify-between">
              <Link
                href="/vendor/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-xs font-bold text-white hover:bg-[var(--brand-dark)] transition"
              >
                <span>Register as Vendor</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/vendors"
                className="text-xs font-bold text-[var(--accent-dark)] hover:underline"
              >
                View Vendor Guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Investment Plans Preview */}
      <section className="shell space-y-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
              Verified Investment Yields
            </h2>
          </div>
          <Link
            href="/plans"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand)] hover:underline"
          >
            <span>View All Plans & Tenure Details</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {investmentPlans.map((plan, index) => {
            const isFeatured = index === 3;
            return (
              <article
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-2xl p-7 transition ${
                  isFeatured
                    ? "bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-xl shadow-[var(--brand)]/20"
                    : "border border-[var(--line)] bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isFeatured ? "text-[var(--accent)]" : "text-[var(--brand)]"
                      }`}
                    >
                      {plan.name}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                        isFeatured ? "bg-white/20 text-white" : "bg-[var(--surface-muted)] text-[var(--muted)]"
                      }`}
                    >
                      {plan.duration} Days
                    </span>
                  </div>

                  <div>
                    <p className={`text-xs ${isFeatured ? "text-white/70" : "text-[var(--muted)]"}`}>Principal Required</p>
                    <p className="text-3xl font-extrabold tabular-nums tracking-tight">
                      ₦{plan.amount.toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3.5 ${isFeatured ? "bg-white/10" : "bg-[var(--surface-muted)]"}`}>
                    <p className={`text-xs ${isFeatured ? "text-white/70" : "text-[var(--muted)]"}`}>Matured Return Payout</p>
                    <p className="text-xl font-bold tabular-nums text-emerald-400">
                      ₦{plan.returnAmount.toLocaleString("en-NG")}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-current/15 flex items-center justify-between">
                  <span className="text-xs font-medium">Coupon Activated</span>
                  <Link
                    href="/dashboard/investment"
                    className={`text-xs font-bold hover:underline ${
                      isFeatured ? "text-[var(--accent)]" : "text-[var(--brand)]"
                    }`}
                  >
                    Invest Now →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Vendor Partner Detailed Spotlight Section */}
      <section className="bg-gradient-to-b from-[var(--ink)] to-[#071322] py-20 text-white">
        <div className="shell space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              High-Yield Distribution Network
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Why top financial distributors partner with Great Finance
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Our vendor program provides a legitimate, low-barrier, high-margin opportunity for entrepreneurs, community leaders, and financial agents across Nigeria.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vendorPerks.map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4 hover:bg-white/[0.07] transition"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-[var(--accent)]">
                  <perk.icon size={22} />
                </span>
                <h3 className="text-base font-bold text-white">{perk.title}</h3>
                <p className="text-xs leading-relaxed text-white/60">{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* 3-Step Vendor Onboarding Roadmap */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">3 Simple Steps to Start Earning as a Vendor</h3>
                <p className="text-xs text-white/60">Fast onboarding, instantaneous activation upon KYC review</p>
              </div>
              <Link
                href="/vendor/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-xs font-bold text-[var(--ink)] shadow hover:bg-[var(--accent)]/90 transition"
              >
                <span>Register as Vendor Now</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <span className="font-mono text-2xl font-bold text-[var(--accent)]">01</span>
                <h4 className="text-sm font-bold text-white">Create Vendor Profile</h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Register with your business or personal name, active email, and WhatsApp telephone number for verification.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-mono text-2xl font-bold text-[var(--accent)]">02</span>
                <h4 className="text-sm font-bold text-white">Submit Tier-1 KYC</h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Upload a verified government identity document and quick selfie via our encrypted, zero-exposure document vault.
                </p>
              </div>
              <div className="space-y-3">
                <span className="font-mono text-2xl font-bold text-[var(--accent)]">03</span>
                <h4 className="text-sm font-bold text-white">Acquire & Distribute</h4>
                <p className="text-xs leading-relaxed text-white/60">
                  Purchase coupon packs in bulk at wholesale rates using Paystack, sell to investors, and pocket instant margins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Architectural Integrity */}
      <section className="shell space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="eyebrow">Enterprise Governance</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            Built on institutional financial foundations
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            We reject fragile web gimmicks. Every financial movement, coupon generation, and withdrawal is safeguarded by institutional database primitives.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-7 space-y-4">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <ShieldCheck size={20} />
            </span>
            <h3 className="text-base font-bold text-[var(--ink)]">Double-Entry Ledger Integrity</h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              Every deposit, coupon sale, and interest payment creates balanced debit and credit entries. Total assets always reconcile against liabilities.
            </p>
          </div>

          <div className="card p-7 space-y-4">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Lock size={20} />
            </span>
            <h3 className="text-base font-bold text-[var(--ink)]">Zero-Exposure Private Vault</h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              KYC documents are delivered directly to private cloud storage using signed, short-lived URLs. Documents are never stored in public buckets.
            </p>
          </div>

          <div className="card p-7 space-y-4">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <FileCheck2 size={20} />
            </span>
            <h3 className="text-base font-bold text-[var(--ink)]">Cryptographic Audit Trail</h3>
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              Administrative approvals and payouts generate SHA-256 hash-chained audit logs, preventing retroactive modification or unauthorized tampering.
            </p>
          </div>
        </div>
      </section>

      {/* Official Support & Contact CTA */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-white via-[var(--surface-muted)] to-white p-8 sm:p-14 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-4">
              <p className="eyebrow">Support & Verification</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
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
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp (07031069524)</span>
                </a>
                <a
                  href="mailto:greatfinanceng@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-xs font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--surface-muted)] transition"
                >
                  <Mail size={16} />
                  <span>greatfinanceng@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--line)] bg-white p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-[var(--ink)]">Quick Resource Links</h3>
              <div className="grid gap-2 text-xs">
                <Link href="/plans" className="flex items-center justify-between rounded-lg p-2.5 hover:bg-[var(--surface-muted)] transition">
                  <span className="font-semibold text-[var(--ink)]">Catalogue of Investment Plans</span>
                  <span className="text-[var(--brand)] font-bold">View →</span>
                </Link>
                <Link href="/vendors" className="flex items-center justify-between rounded-lg p-2.5 hover:bg-[var(--surface-muted)] transition">
                  <span className="font-semibold text-[var(--ink)]">Vendor Partner Program Guide</span>
                  <span className="text-[var(--brand)] font-bold">Read →</span>
                </Link>
                <Link href="/about" className="flex items-center justify-between rounded-lg p-2.5 hover:bg-[var(--surface-muted)] transition">
                  <span className="font-semibold text-[var(--ink)]">Institutional Governance & Ledger</span>
                  <span className="text-[var(--brand)] font-bold">Explore →</span>
                </Link>
                <Link href="/vendor/signup" className="flex items-center justify-between rounded-lg p-2.5 bg-[var(--accent)]/10 text-[var(--accent-dark)] font-bold transition">
                  <span>Register as Authorized Vendor</span>
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
