import Link from "next/link";
import { ArrowRight, Database, Lock, ShieldCheck } from "lucide-react";
import { legacyExplanation } from "@/features/content/legacy-content";
import { TundeAuditVault } from "@/components/brand/illustrations/tunde-audit-vault";

export const metadata = {
  title: "About Great Finance | How the Platform Works",
  description:
    "Learn how Great Finance records transactions, protects customer information, and supports investment and vendor accounts.",
};

export default function AboutPage() {
  return (
    <div className="space-y-24 py-8 sm:space-y-36 sm:py-14">
      {/* ========================================================================= */}
      {/* 01. HERO WITH TUNDE AUDIT VAULT */}
      {/* ========================================================================= */}
      <section className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[var(--ink)] leading-[1.08]">
                A clearer path through every{" "}
                <span className="text-[var(--brand)]">financial action</span>.
              </h1>
            </div>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              Great Finance was established to eliminate ambiguity, opacity, and delays in personal wealth growth and regional financial distribution. We combine database-level invariants with verified merchant liquidity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-4 text-sm font-mono font-bold text-white shadow-xl shadow-emerald-900/30 hover:bg-emerald-500 transition"
              >
                <span>Join Customer Network</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/vendors"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-6 py-4 text-sm font-mono font-bold text-[var(--ink)] hover:bg-[var(--surface-elevated)] transition"
              >
                <span>Vendor Distribution Program</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <TundeAuditVault />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. CORE PHILOSOPHY & MATHEMATICAL EQUATION */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-14 shadow-2xl space-y-8">
          <div className="grid gap-10 lg:grid-cols-[0.4fr_1fr] items-start">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)]">
                Built on balanced records
              </h2>
            </div>
            <div className="space-y-6 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
              <p>{legacyExplanation}</p>
              <p>
                Great Finance keeps each organization separate, records matching debit and credit entries, stores documents privately, and confirms payments before updating balances.
              </p>

              {/* The Equation Callout */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-2">
                <span className="text-sm font-bold text-emerald-400 block">How balances are checked</span>
                <p className="font-mono text-xl sm:text-2xl font-black text-[var(--ink)]">
                  ∑ Debits ≡ ∑ Credits (Assets - Liabilities = 0)
                </p>
                <p className="text-xs text-[var(--muted)]">
                  Enforced by PostgreSQL database constraints before any mutation commits to storage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. CORE ARCHITECTURAL PILLARS */}
      {/* ========================================================================= */}
      <section className="shell space-y-12">
        <div className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            The Technology Behind Great Finance
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Database size={22} />
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">Neon Lakebase Postgres</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Cloud-native serverless PostgreSQL providing ACID guarantees, atomic migrations, connection pooling, and instant branch recovery.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={22} />
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">Double-Entry Accounting</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Every kobo is represented in strict dual entries. Funds in escrow, collection revenue, and payout liabilities always balance exactly.
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 space-y-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Lock size={22} />
            </span>
            <h3 className="font-display text-lg font-bold text-[var(--ink)]">Zero-Exposure Private Vault</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Government identity documents and selfie verifications are processed with short-lived presigned credentials and stored securely away from public access.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-r from-[var(--surface-inverse)] to-[var(--surface)] p-8 sm:p-14 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to participate in our verified financial network?
            </h3>
            <p className="text-sm text-white/70">
              Join thousands of customers and certified distribution vendors across Nigeria today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/signup"
              className="rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-mono font-bold text-white hover:bg-emerald-500 transition shadow-lg"
            >
              Register as Customer
            </Link>
            <Link
              href="/vendor/signup"
              className="rounded-xl bg-amber-400 px-6 py-3.5 text-xs font-mono font-black text-[var(--surface-inverse)] hover:bg-amber-300 transition shadow-lg"
            >
              Register as Vendor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
