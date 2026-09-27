import Link from "next/link";
import { ArrowRight, CheckCircle2, Database, Landmark, Lock, ShieldCheck, Store, Users } from "lucide-react";
import { legacyExplanation } from "@/features/content/legacy-content";

export const metadata = {
  title: "About Great Finance · Institutional Architecture & Governance",
  description:
    "Learn about Great Finance, our double-entry ledger architecture, security practices, and our mission to provide transparent, verified financial yield.",
};

export default function AboutPage() {
  return (
    <div className="space-y-24 py-12 sm:space-y-32 sm:py-20">
      {/* Hero */}
      <section className="shell">
        <div className="max-w-3xl space-y-6">
          <p className="eyebrow">Institutional Profile</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-6xl">
            A clearer path through every financial action.
          </h1>
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            Great Finance was established to eliminate ambiguity, opacity, and delays in personal wealth growth and regional financial distribution.
          </p>
        </div>
      </section>

      {/* Main Philosophy & Legacy Explanation */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-white p-8 sm:p-14 shadow-sm space-y-8">
          <div className="grid gap-10 lg:grid-cols-[0.4fr_1fr] items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Our Foundation</span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[var(--ink)]">
                Built on Verified Records
              </h2>
            </div>
            <div className="space-y-5 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
              <p>{legacyExplanation}</p>
              <p>
                Unlike informal savings clubs or opaque online schemes, Great Finance is built on modern financial engineering primitives: isolated tenant organizations, double-entry ledger accounts with debit/credit balance invariants, signed object vaults, and automated webhook reconciliation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="shell space-y-12">
        <div className="space-y-3">
          <p className="eyebrow">Technical Architecture</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-4xl">
            The Technology Behind Great Finance
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="card p-7 space-y-4">
            <span className="grid size-11 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Database size={22} />
            </span>
            <h3 className="text-base font-bold text-[var(--ink)]">Neon Lakebase Postgres</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Cloud-native serverless PostgreSQL providing ACID guarantees, atomic migrations, connection pooling, and instant branch recovery.
            </p>
          </div>

          <div className="card p-7 space-y-4">
            <span className="grid size-11 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <ShieldCheck size={22} />
            </span>
            <h3 className="text-base font-bold text-[var(--ink)]">Double-Entry Accounting</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Every kobo is represented in strict dual entries. Funds in escrow, collection revenue, and payout liabilities always balance exactly.
            </p>
          </div>

          <div className="card p-7 space-y-4">
            <span className="grid size-11 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Lock size={22} />
            </span>
            <h3 className="text-base font-bold text-[var(--ink)]">Zero-Exposure Private Vault</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Government identity documents and selfie verifications are processed with short-lived presigned credentials and stored securely away from public access.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Call to Action */}
      <section className="shell">
        <div className="rounded-3xl bg-[var(--ink)] p-8 sm:p-14 text-white flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Ready to participate in our verified financial network?</h3>
            <p className="text-sm text-white/70">Join thousands of customers and certified distribution vendors today.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-xl bg-[var(--brand)] px-6 py-3 text-xs font-bold text-white hover:bg-[var(--brand-dark)] transition"
            >
              Register as Customer
            </Link>
            <Link
              href="/vendor/signup"
              className="rounded-xl bg-[var(--accent)] px-6 py-3 text-xs font-bold text-[var(--ink)] hover:bg-[var(--accent)]/90 transition"
            >
              Register as Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
