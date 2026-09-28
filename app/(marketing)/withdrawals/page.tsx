import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  HelpCircle,
  Lock,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { GuillochePattern } from "@/components/brand/illustrations/guilloche-pattern";

export const metadata: Metadata = {
  title: "Withdrawals & Payouts · Great Finance",
  description:
    "Understand exactly how Great Finance pays your investment returns — the maturity timeline, bank transfer process, and everything you need to know before requesting a payout.",
};

const steps = [
  {
    icon: TrendingUp,
    title: "Activate a plan",
    body: "Purchase a coupon from a verified distributor and redeem it in your dashboard. Your investment timer starts immediately.",
  },
  {
    icon: Clock,
    title: "Wait for maturity",
    body: "Every plan has a fixed duration (e.g. 7 days for Lincon, 30 days for Premium). Your withdrawal button unlocks automatically on the maturity date.",
  },
  {
    icon: Banknote,
    title: "Submit bank details",
    body: "Enter your Nigerian bank account (10-digit NUBAN), bank name, and account name. No card details or third-party logins needed.",
  },
  {
    icon: ShieldCheck,
    title: "Admin review",
    body: "Our settlement desk manually reviews every request, verifying your identity and investment record before approving the transfer.",
  },
  {
    icon: Zap,
    title: "Bank transfer",
    body: "Approved payouts are processed within 1–3 business days. Funds land directly in your bank account — no wallets, no middlemen.",
  },
];

const faqs = [
  {
    q: "When exactly can I withdraw?",
    a: "The withdraw button unlocks on midnight of your maturity date. For example, if your plan activated on 27 September and runs 7 days, you can withdraw from 4 October onwards.",
  },
  {
    q: "Can I withdraw early?",
    a: "No. Great Finance investment plans are fixed-term. Early withdrawal is not supported to protect the integrity of the return structure.",
  },
  {
    q: "What if I give wrong account details?",
    a: "Double-check your NUBAN and account name before submitting. Great Finance is not liable for transfers made to incorrect accounts. Contact support immediately if you suspect an error.",
  },
  {
    q: "How many withdrawal requests can I submit?",
    a: "One request per investment plan. Once submitted, you cannot change the account details. A new request opens only if the previous one was rejected.",
  },
  {
    q: "What banks are supported?",
    a: "All CBN-licensed Nigerian commercial banks with a valid 10-digit NUBAN. This covers Access, GTBank, Zenith, First Bank, UBA, Opay, Palmpay, Kuda, Moniepoint, and all others.",
  },
  {
    q: "How long does the settlement desk take?",
    a: "Most approved withdrawals are processed the same business day. Complex cases or weekend submissions may take up to 3 business days.",
  },
  {
    q: "Is my money safe if the admin delays?",
    a: "Yes. Your funds are ledger-accounted at Great Finance and cannot be moved without the dedicated settlement desk workflow. Each action is audit-logged and time-stamped.",
  },
];

export default function WithdrawalsPage() {
  return (
    <div className="space-y-24 py-8 sm:space-y-36 sm:py-14">
      {/* ========================================================================= */}
      {/* 01. HERO */}
      {/* ========================================================================= */}
      <section className="shell relative">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-4 py-1.5 text-xs font-mono font-bold text-emerald-400">
            <Banknote size={14} />
            <span>DIRECT NUBAN DISBURSEMENT PROTOCOL</span>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[var(--accent)]">
              [DISBURSEMENT // SETTLEMENT SLA]
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[var(--ink)] leading-[1.08]">
              Getting your capital{" "}
              <span className="text-[var(--brand)]">back to your bank</span>.
            </h1>
          </div>

          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Every naira you invest matures into a guaranteed return. This page explains exactly how and when you receive your payout — zero ambiguity, zero fine print, settled directly to your Nigerian commercial bank account.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 text-sm font-mono font-bold text-white shadow-xl shadow-emerald-900/30 hover:bg-emerald-500 transition"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-6 py-4 text-sm font-mono font-bold text-[var(--ink)] hover:bg-[var(--surface-elevated)] transition"
            >
              <span>View All Plans</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. KEY FACTS STRIP */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:grid-cols-4 sm:p-8 shadow-xl">
          {[
            { value: "1–3 Days", label: "Settlement SLA", sub: "Same-day typical" },
            { value: "₦0.00", label: "Withdrawal Fee", sub: "Zero deductions" },
            { value: "100%", label: "Direct Bank Transfer", sub: "CBN commercial banks" },
            { value: "All Banks", label: "Coverage", sub: "NUBAN licensed" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1 border-l-2 border-emerald-500/40 pl-4">
              <p className="font-mono text-2xl sm:text-3xl font-black text-[var(--ink)]">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">{stat.label}</p>
              <p className="text-[0.72rem] text-[var(--muted)] font-mono">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. 5-STEP DISBURSEMENT TIMELINE */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="space-y-3 max-w-2xl">
          <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[var(--brand)]">
            [PIPELINE // 5 NODES]
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            5 steps from activation to bank payout
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Every step is recorded on the double-entry ledger with timestamp verification.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="font-mono text-2xl font-black text-emerald-400">0{i + 1}</span>
                <div className="flex items-center gap-2">
                  <step.icon size={16} className="text-emerald-400" />
                  <h3 className="font-display text-sm font-bold text-[var(--ink)]">{step.title}</h3>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. REAL SCENARIO: LINCON PLAN MATURITY SIMULATOR */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-14 space-y-8 shadow-xl">
          <div className="space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              Real Scenario Example
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Maturity Breakdown: Lincon Plan
            </h3>
            <p className="text-xs font-mono text-[var(--muted)]">
              Invest ₦2,000 → Plan locks for 7 days → Withdraw ₦6,000 direct to bank
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-inverse)] overflow-hidden">
            {[
              { icon: FileText, day: "Day 0", event: "You redeem a Lincon coupon code", sub: "Invest ₦2,000 — plan locks for 7 days" },
              { icon: Clock, day: "Days 1–6", event: "Plan is ACTIVE — automated timer runs", sub: "Dashboard shows days remaining and projected return" },
              { icon: TrendingUp, day: "Day 7", event: "Plan matures at midnight", sub: "Withdraw button unlocks — expected return: ₦6,000" },
              { icon: Banknote, day: "Day 7", event: "You enter your bank details and submit", sub: "NUBAN, bank name, account name — takes 30 seconds" },
              { icon: ShieldCheck, day: "Day 7–9", event: "Settlement desk reviews and approves", sub: "Audit-logged, maker-checker verified" },
              { icon: CheckCircle2, day: "Day 7–9", event: "₦6,000 transferred to your bank", sub: "Direct NUBAN bank credit — transaction SETTLED" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex flex-wrap items-center gap-4 px-6 py-4 ${
                  i > 0 ? "border-t border-[var(--line)]" : ""
                }`}
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-400">
                  <item.icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs font-bold text-emerald-400">{item.day}</p>
                  <p className="font-display font-semibold text-sm text-[var(--ink)]">{item.event}</p>
                  <p className="font-mono text-xs text-[var(--muted)]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. FAQS */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="space-y-3">
          <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[var(--brand)]">
            [KNOWLEDGE BASE // SETTLEMENT FAQS]
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-3">
              <h3 className="font-display text-base font-bold text-[var(--ink)] flex items-start gap-3">
                <HelpCircle size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs leading-relaxed text-[var(--muted)] pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
