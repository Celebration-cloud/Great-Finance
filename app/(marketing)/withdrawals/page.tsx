import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  FileText,
  HelpCircle,
  Lock,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdrawals & Payouts | Great Finance",
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
    a: "All CBN-licensed Nigerian commercial banks with a valid 10-digit NUBAN. This covers Access, GTBank, Zenith, First Bank, UBA, Opay, Palmpay, and all others.",
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
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--surface-inverse)] via-[var(--surface)] to-[var(--paper)] px-6 pb-24 pt-20 text-white">
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            <Banknote size={12} />
            Payout system
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Getting your money{" "}
            <span className="text-[var(--accent)]">back to you</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/75 leading-relaxed">
            Every naira you invest matures into a guaranteed return. This page explains exactly how and when you receive your payout — no surprises, no fine print.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--surface-inverse)] hover:opacity-90 transition"
            >
              Go to my dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition"
            >
              View all plans
            </Link>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-[var(--line)] sm:grid-cols-4">
          {[
            { value: "1–3 days",  label: "Payout processing" },
            { value: "₦0",        label: "Withdrawal fee" },
            { value: "100%",      label: "Direct bank transfer" },
            { value: "All banks", label: "CBN-licensed supported" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-6 text-center">
              <p className="text-2xl font-extrabold text-[var(--brand)]">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-[var(--surface-muted)]">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">Process</span>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--ink)]">5 steps from activation to payout</h2>
          </div>
          <ol className="relative space-y-0">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-white font-bold text-sm shadow-lg">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-[var(--line)]" style={{ minHeight: "3rem" }} />
                  )}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon size={16} className="text-[var(--brand)]" />
                    <h3 className="font-bold text-[var(--ink)]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed max-w-lg">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Maturity example */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">Example</span>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--ink)]">Real scenario: Lincon Plan</h2>
            <p className="mt-3 text-[var(--muted)] max-w-xl mx-auto text-sm">
              Here is exactly what happens from the moment you redeem a coupon to the moment money hits your account.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] overflow-hidden">
            {[
              { icon: FileText,    day: "Day 0",         event: "You redeem a Lincon coupon code",               sub: "Invest ₦2,000 — plan locks for 7 days" },
              { icon: Clock,       day: "Days 1–6",      event: "Plan is ACTIVE — no action needed",             sub: "Dashboard shows days remaining + projected return" },
              { icon: TrendingUp,  day: "Day 7 (Oct 4)", event: "Plan matures",                                  sub: "Withdraw button unlocks — expected return: ₦6,000" },
              { icon: Banknote,    day: "Day 7",         event: "You enter your bank details and submit",        sub: "NUBAN, bank name, account name — takes 30 seconds" },
              { icon: ShieldCheck, day: "Day 7–9",       event: "Settlement desk reviews and approves",          sub: "Audit-logged, maker-checker verified" },
              { icon: CheckCircle2,day: "Day 7–9",       event: "₦6,000 transferred to your bank",              sub: "Investment marked SETTLED — complete" },
            ].map((item, i) => (
              <div key={i} className={`flex flex-wrap items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-[var(--line)]" : ""}`}>
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/10">
                  <item.icon size={16} className="text-[var(--brand)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--brand)]">{item.day}</p>
                  <p className="font-semibold text-sm text-[var(--ink)]">{item.event}</p>
                  <p className="text-xs text-[var(--muted)]">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security strip */}
      <section className="bg-gradient-to-r from-[var(--surface-inverse)] to-[var(--surface)] px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-3">
          {[
            { icon: Lock,       title: "Ledger-backed",   body: "Every payout is double-entry ledger accounted. No fund can move without a corresponding audit trail." },
            { icon: ShieldCheck,title: "Maker-Checker",   body: "No single admin can approve their own review. All settlement actions require independent authorisation." },
            { icon: FileText,   title: "Audit log",       body: "Immutable hash-chained audit logs record every request, approval, and transfer timestamp." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <item.icon size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-[var(--surface-muted)]">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand)]">FAQ</span>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--ink)]">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-[var(--line)] bg-white p-5">
                <div className="flex gap-3">
                  <HelpCircle size={18} className="mt-0.5 shrink-0 text-[var(--brand)]" />
                  <div>
                    <h3 className="font-bold text-[var(--ink)] mb-1.5">{faq.q}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-white text-center border-t border-[var(--line)]">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-3">Ready to invest?</h2>
          <p className="text-[var(--muted)] text-sm mb-7">
            Choose a plan, redeem your coupon, and let Great Finance grow your money.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-sm font-bold text-white hover:bg-[var(--brand-dark)] transition"
            >
              View investment plans
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-6 py-3 text-sm font-bold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition"
            >
              Sign in to dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
