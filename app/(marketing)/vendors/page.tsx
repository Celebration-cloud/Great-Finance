import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  MessageCircle,
  Receipt,
  ShieldCheck,
  Store,
} from "lucide-react";

export const metadata = {
  title: "Authorized Vendor Partner Program · Great Finance",
  description:
    "Join the Great Finance authorized distributor network. Wholesale coupon discounts up to 15%, immediate retail profit, real-time inventory ledger, and dedicated partner support.",
};

import { VENDOR_TIER_LIST } from "@/lib/vendor/tiers";

const faqs = [
  {
    q: "How do vendors make money on Great Finance?",
    a: "Vendors acquire coupon batches at wholesale discount (for example, purchasing ₦100,000 worth of coupons for ₦92,000 at an 8% discount) and distribute them to local customers at full face value (₦100,000). The difference is your immediate, risk-free profit margin.",
  },
  {
    q: "How are acquired coupons delivered to me?",
    a: "Once your Paystack payment completes and verifies, your coupon codes are cryptographically minted into your private Vendor Workspace (/vendor/dashboard). You can copy individual codes, view active status, and track redemption in real time.",
  },
  {
    q: "What documents are required for Tier-1 KYC verification?",
    a: "You will need any recognized Nigerian government-issued ID (National Identity Number slip/card, Driver's License, Voter's Card, or International Passport) and a clear, well-lit live selfie. Documents are uploaded directly to our zero-exposure private vault.",
  },
  {
    q: "Can I sell coupons for more than face value?",
    a: "No. Great Finance enforces strict face-value parity. Selling coupons above stated face value violates distributor guidelines and will result in permanent workspace suspension.",
  },
  {
    q: "How quickly is my KYC approved?",
    a: "Our compliance officers review submissions within 2 to 6 business hours. High-priority submissions with matching official details are typically approved within 90 minutes.",
  },
  {
    q: "What if a customer has difficulty redeeming a coupon I issued?",
    a: "Every coupon has an immutable ledger entry. You and our compliance desk can verify redemption timestamp and associated customer account in real time through our administration gateway.",
  },
];

export default function VendorsPage() {
  return (
    <div className="space-y-24 py-12 sm:space-y-32 sm:py-20">
      {/* Hero Section */}
      <section className="shell">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/50 bg-[var(--accent)]/15 px-3.5 py-1 text-xs font-bold text-[var(--accent-dark)]">
            <Store size={14} />
            <span>OFFICIAL DISTRIBUTOR & LIQUIDITY PROGRAM</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-6xl sm:leading-[1.1]">
            Build a high-margin distribution business as a{" "}
            <span className="text-[var(--brand)]">Great Finance</span> vendor.
          </h1>

          <p className="text-lg leading-relaxed text-[var(--muted)]">
            Bridge digital yield with local liquidity. Acquire bulk coupon batches at up to 15% wholesale discount, serve community investors who prefer cash or local transfers, and keep 100% of your retail margin.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <Link
              href="/vendor/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[var(--brand)]/25 transition hover:bg-[var(--brand-dark)]"
            >
              <Store size={16} />
              <span>Register as Vendor Partner</span>
            </Link>

            <Link
              href="/vendor/login"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-6 py-3.5 text-sm font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--surface-muted)] transition"
            >
              <span>Vendor Workspace Sign In</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Instant wholesale margin
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Automated Paystack verification
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={16} className="text-emerald-600" />
              Zero holding risk
            </span>
          </div>
        </div>
      </section>

      {/* How It Works Diagram / Process */}
      <section className="shell space-y-12">
        <div className="space-y-3">
          <p className="eyebrow">Operating Model</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            How the Vendor Distribution Model Works
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)] max-w-2xl">
            A frictionless, legally compliant distribution workflow designed for maximum turnover and crystal-clear accounting.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="card p-6 space-y-4">
            <span className="font-mono text-3xl font-bold text-[var(--brand)]">01</span>
            <h3 className="text-base font-bold text-[var(--ink)]">Onboard & Verify</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Create your vendor profile with active WhatsApp contact. Upload your government ID and live selfie to pass Tier-1 compliance.
            </p>
          </div>

          <div className="card p-6 space-y-4">
            <span className="font-mono text-3xl font-bold text-[var(--brand)]">02</span>
            <h3 className="text-base font-bold text-[var(--ink)]">Acquire Inventory</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Select desired coupon denominations (₦10,000, ₦20,000, ₦50,000, ₦100,000) and pay via verified Paystack checkout at wholesale rate.
            </p>
          </div>

          <div className="card p-6 space-y-4">
            <span className="font-mono text-3xl font-bold text-[var(--brand)]">03</span>
            <h3 className="text-base font-bold text-[var(--ink)]">Instant Delivery</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Cryptographically signed coupon codes are instantly logged to your private Vendor Dashboard, ready for distribution.
            </p>
          </div>

          <div className="card p-6 space-y-4">
            <span className="font-mono text-3xl font-bold text-[var(--brand)]">04</span>
            <h3 className="text-base font-bold text-[var(--ink)]">Retail & Retain</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Distribute coupon codes to clients for face value. Collect cash or bank transfer directly into your personal account. Margin is 100% yours.
            </p>
          </div>
        </div>
      </section>

      {/* Margin Tiers Comparison Table */}
      <section className="shell space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <p className="eyebrow">Wholesale Economics</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            Transparent Vendor Margin Tiers
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            As your distribution volume grows, your wholesale cost decreases—allowing you to generate higher net margins per coupon batch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VENDOR_TIER_LIST.map((tier) => (
            <div
              key={tier.key}
              className={`relative flex flex-col justify-between rounded-2xl p-7 transition ${
                tier.recommended
                  ? "border-2 border-[var(--brand)] bg-white shadow-xl shadow-[var(--brand)]/10"
                  : "border border-[var(--line)] bg-white shadow-sm"
              }`}
            >
              {tier.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--brand)] px-3 py-0.5 text-[0.68rem] font-bold text-white uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">{tier.badge}</h3>
                  <p className="mt-1 text-xs text-[var(--muted)]">Monthly volume: {tier.volume}</p>
                </div>

                <div className="rounded-xl bg-[var(--surface-muted)] p-4">
                  <p className="text-xs font-semibold text-[var(--muted)]">Partner Advantage</p>
                  <p className="text-lg font-extrabold text-[var(--brand)]">{tier.marginLabel}</p>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--ink)]/80">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-[var(--line)]">
                <Link
                  href={`/vendor/signup?tier=${tier.key}`}
                  className={`flex w-full items-center justify-center rounded-xl py-2.5 text-xs font-bold transition ${
                    tier.recommended
                      ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] shadow"
                      : "bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[var(--line)]"
                  }`}
                >
                  Register at this Tier
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real Vendor Workspace Features */}
      <section className="bg-[var(--surface-inverse)] py-20 text-white">
        <div className="shell space-y-16">
          <div className="max-w-2xl space-y-4">
            <span className="inline-block rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
              Software Tooling
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Professional tools for high-volume distributors
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Your Great Finance Vendor Workspace gives you deep operational visibility, zero accounting headaches, and verified cryptographic proofs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 space-y-4">
              <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-[var(--accent)]">
                <Receipt size={22} />
              </span>
              <h3 className="text-lg font-bold text-white">Live Inventory Table</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Filter by denomination, issuance date, and active vs redeemed status. Export records or copy individual voucher codes with one click.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 space-y-4">
              <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-[var(--accent)]">
                <ShieldCheck size={22} />
              </span>
              <h3 className="text-lg font-bold text-white">Private KYC Document Vault</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Protected by end-to-end encrypted storage. Verified compliance status unlocks higher monthly purchasing limits and priority allocations.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 space-y-4">
              <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-[var(--accent)]">
                <FileCheck size={22} />
              </span>
              <h3 className="text-lg font-bold text-white">Double-Entry Purchase History</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Every acquisition references an immutable ledger payment intent with provider reference, timestamp, and minor unit accuracy.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-r from-[var(--accent)]/15 via-transparent to-[var(--accent)]/5 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white">Ready to operate as a licensed distributor?</h3>
              <p className="text-xs text-white/70">Registration takes under two minutes. No upfront licensing fees.</p>
            </div>
            <Link
              href="/vendor/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-xs font-extrabold text-[var(--surface-inverse)] shadow hover:bg-[var(--accent)]/90 transition"
            >
              <Store size={15} />
              <span>Apply for Vendor Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive Vendor FAQ */}
      <section id="faq" className="shell space-y-12">
        <div className="space-y-3">
          <p className="eyebrow">Vendor Intelligence</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Everything you need to know about purchasing, distributing, and profiting from Great Finance coupon inventory.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.q} className="card p-7 space-y-3">
              <h3 className="text-base font-bold text-[var(--ink)] flex items-start gap-2.5">
                <HelpCircle size={18} className="text-[var(--brand)] shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs leading-relaxed text-[var(--muted)] pl-7">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Desk for High-Volume Vendors */}
      <section className="shell">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-8 sm:p-12 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="eyebrow">Institutional Desk</span>
              <h3 className="mt-1 text-2xl font-bold text-[var(--ink)]">Need Custom High-Volume Allocations?</h3>
              <p className="text-xs text-[var(--muted)]">For distributor batches exceeding ₦10,000,000 or regional exclusivity inquiries.</p>
            </div>
            <a
              href="https://wa.me/2347031069524"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <MessageCircle size={16} />
              <span>Contact Senior Dispatch Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
