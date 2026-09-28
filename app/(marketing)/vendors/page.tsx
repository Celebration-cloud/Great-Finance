import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  MessageCircle,
  Percent,
  Receipt,
  ShieldCheck,
  Store,
} from "lucide-react";
import { VENDOR_TIER_LIST } from "@/lib/vendor/tiers";
import { AminaVendorScene } from "@/components/brand/illustrations/amina-vendor-scene";
import { GuillochePattern } from "@/components/brand/illustrations/guilloche-pattern";

export const metadata = {
  title: "Vendor Program | Great Finance",
  description:
    "Join the Great Finance authorized distributor network. Wholesale coupon discounts up to 15%, immediate retail profit, real-time inventory ledger, and dedicated partner support.",
};

const faqs = [
  {
    q: "How do vendors make money on Great Finance?",
    a: "Vendors acquire coupon batches at wholesale discount (for example, purchasing ₦100,000 worth of coupons for ₦92,000 at an 8% discount) and distribute them to local customers at full face value (₦100,000). The difference is your immediate, risk-free profit margin.",
  },
  {
    q: "How are acquired coupons delivered to me?",
    a: "Once Paystack confirms your payment, your coupon codes appear in your private Vendor Workspace (/vendor/dashboard). You can copy individual codes, view their status, and track redemption in real time.",
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
    a: "Every coupon has a permanent transaction record. You and our compliance team can check its redemption time and associated customer account from the dashboard.",
  },
];

export default function VendorsPage() {
  return (
    <div className="space-y-24 py-8 sm:space-y-36 sm:py-14">
      {/* ========================================================================= */}
      {/* 01. HERO WITH AMINA VENDOR SCENE */}
      {/* ========================================================================= */}
      <section className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[var(--ink)] leading-[1.08]">
                Build a high-margin distribution business as a{" "}
                <span className="text-[var(--brand)]">Great Finance</span> vendor.
              </h1>
            </div>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              Bridge digital yield with local liquidity. Acquire bulk coupon batches at up to 15% wholesale discount, serve community investors who prefer cash or local bank transfers, and keep 100% of your retail margin.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/vendor/signup"
                className="inline-flex items-center gap-2.5 rounded-xl bg-amber-400 px-7 py-4 text-sm font-mono font-black text-[var(--surface-inverse)] shadow-xl transition hover:bg-amber-300"
              >
                <Store size={17} />
                <span>Register as Vendor Partner</span>
              </Link>

              <Link
                href="/vendor/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-6 py-4 text-sm font-mono font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--surface-elevated)] transition"
              >
                <span>Vendor Workspace Sign In</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-mono text-[var(--muted)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Instant wholesale discount
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Automated Paystack verification
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Zero inventory holding risk
              </span>
            </div>
          </div>

          <div className="relative">
            <AminaVendorScene />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. HOW THE VENDOR MODEL WORKS */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            How the Vendor Distribution Model Works
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            A frictionless, legally compliant distribution workflow designed for rapid turnover and crystal-clear double-entry accounting.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7 space-y-3">
            <span className="font-mono text-3xl font-black text-amber-400">01</span>
            <h3 className="font-display text-base font-bold text-[var(--ink)]">Onboard & Verify</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Create your vendor profile with active WhatsApp contact. Upload your government ID and live selfie to pass Tier-1 compliance.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7 space-y-3">
            <span className="font-mono text-3xl font-black text-amber-400">02</span>
            <h3 className="font-display text-base font-bold text-[var(--ink)]">Acquire Inventory</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Select coupon denominations (₦2,000, ₦4,000, ₦10,000, ₦20,000, ₦50,000) and pay via Paystack checkout at wholesale rate.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7 space-y-3">
            <span className="font-mono text-3xl font-black text-amber-400">03</span>
            <h3 className="font-display text-base font-bold text-[var(--ink)]">Instant Delivery</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Purchased coupon codes appear in your private Vendor Workspace, ready for client delivery.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-7 space-y-3">
            <span className="font-mono text-3xl font-black text-amber-400">04</span>
            <h3 className="font-display text-base font-bold text-[var(--ink)]">Retail & Retain</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Distribute coupon codes to clients for face value. Collect cash or bank transfer directly into your personal account. Margin is 100% yours.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. WHOLESALE MARGIN TIERS MATRIX */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            Transparent Vendor Margin Tiers
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            As your distribution volume grows, your wholesale cost decreases, allowing you to earn a higher margin on each coupon batch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VENDOR_TIER_LIST.map((tier) => (
            <div
              key={tier.key}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                tier.recommended
                  ? "border-2 border-amber-400 bg-gradient-to-b from-amber-950/40 to-[var(--surface)] shadow-2xl shadow-amber-950/40"
                  : "border border-[var(--line)] bg-[var(--surface)] hover:border-amber-500/40"
              }`}
            >
              {tier.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-[0.68rem] font-mono font-black text-[var(--surface-inverse)] uppercase tracking-wider">
                  MOST POPULAR TIER
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--ink)]">{tier.badge}</h3>
                  <p className="mt-1 font-mono text-xs text-[var(--muted)]">Volume: {tier.volume}</p>
                </div>

                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)]/70 p-4">
                  <span className="text-[0.68rem] font-mono text-[var(--muted)] uppercase block">
                    Distributor Margin
                  </span>
                  <p className="font-mono text-xl font-black text-amber-300 mt-0.5">
                    {tier.marginLabel}
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-[var(--muted)]">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--line)]">
                <Link
                  href={`/vendor/signup?tier=${tier.key}`}
                  className={`flex w-full items-center justify-center rounded-xl py-3 text-xs font-mono font-bold transition ${
                    tier.recommended
                      ? "bg-amber-400 text-[var(--surface-inverse)] hover:bg-amber-300 shadow"
                      : "bg-[var(--surface-muted)] text-[var(--ink)] hover:bg-[var(--surface-elevated)]"
                  }`}
                >
                  Register at this Tier
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. VENDOR WORKSPACE SOFTWARE FEATURES */}
      {/* ========================================================================= */}
      <section className="bg-[var(--surface-inverse)] py-20 border-y border-[var(--line)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <GuillochePattern />
        </div>

        <div className="shell space-y-16 relative z-10">
          <div className="max-w-2xl space-y-4">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Professional tools for high-volume distributors
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Your Great Finance Vendor Workspace keeps inventory, sales, and redemption activity in one place.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 space-y-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Receipt size={22} />
              </span>
              <h3 className="font-display text-lg font-bold text-white">Live Inventory Table</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Filter by denomination, issuance date, and active vs redeemed status. Export records or copy individual voucher codes with one click.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 space-y-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck size={22} />
              </span>
              <h3 className="font-display text-lg font-bold text-white">Private KYC Vault</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Protected by zero-exposure presigned credentials. Verified compliance status unlocks higher monthly purchasing limits and priority allocations.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 space-y-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FileCheck size={22} />
              </span>
              <h3 className="font-display text-lg font-bold text-white">Double-Entry Purchase History</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Every purchase includes the payment reference, amount, and transaction time needed for reconciliation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. COMPREHENSIVE VENDOR FAQS */}
      {/* ========================================================================= */}
      <section id="faq" className="shell space-y-12">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)] max-w-2xl">
            Everything you need to know about purchasing, distributing, and profiting from Great Finance coupon inventory.
          </p>
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

      {/* ========================================================================= */}
      {/* 06. DIRECT DESK FOR HIGH-VOLUME VENDORS */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-14 space-y-6 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                Institutional Desk
              </span>
              <h3 className="font-display text-2xl font-bold text-[var(--ink)]">
                Need Custom High-Volume Allocations?
              </h3>
              <p className="text-xs font-mono text-[var(--muted)]">
                For distributor batches exceeding ₦10,000,000 or regional exclusivity inquiries.
              </p>
            </div>
            <a
              href="https://wa.me/2347031069524"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-mono font-bold text-white shadow-sm hover:bg-emerald-500 transition"
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
