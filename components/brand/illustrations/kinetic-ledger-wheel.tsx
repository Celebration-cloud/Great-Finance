"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface LedgerStep {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  debitAccount: string;
  creditAccount: string;
  securityInvariant: string;
}

const ledgerSteps: LedgerStep[] = [
  {
    id: "paystack",
    number: "01",
    title: "Inflow Verification",
    subtitle: "Paystack HMAC webhook & bank collection",
    debitAccount: "DR: Settlement Gateway Cash Account",
    creditAccount: "CR: Customer Inflow Escrow Liability",
    securityInvariant: "No balance posted without raw-body cryptographic HMAC validation",
  },
  {
    id: "double-entry",
    number: "02",
    title: "Double-Entry Balance",
    subtitle: "Neon PostgreSQL atomic transaction",
    debitAccount: "DR: Ledger Operational Liquidity",
    creditAccount: "CR: Customer Maturing Obligation",
    securityInvariant: "Balanced dual-entry trigger enforces: Assets - Liabilities = 0",
  },
  {
    id: "vendor-mint",
    number: "03",
    title: "Wholesale Margin Mint",
    subtitle: "Authorized vendor batch allocation",
    debitAccount: "DR: Vendor Inventory Custody",
    creditAccount: "CR: Earned Distributor Wholesale Margin (up to 15%)",
    securityInvariant: "Cryptographically signed voucher codes with 1-time redemption seal",
  },
  {
    id: "yield-maturation",
    number: "04",
    title: "Yield Maturation",
    subtitle: "Fixed tenure countdown (7–120 days)",
    debitAccount: "DR: Maturation Liquidity Pool",
    creditAccount: "CR: Unlocked Customer Bank Payout",
    securityInvariant: "Timed database lock prevents premature capital leakage",
  },
  {
    id: "settlement",
    number: "05",
    title: "Direct NUBAN Payout",
    subtitle: "CBN-licensed commercial bank credit",
    debitAccount: "DR: Customer Payout Obligation Fulfilled",
    creditAccount: "CR: Settled Bank Transfer",
    securityInvariant: "Dual-maker admin verification with immutable audit chain",
  },
];

export function KineticLedgerWheel({ className }: { className?: string }) {
  const [activeStepId, setActiveStepId] = useState<string>("double-entry");
  const activeStep = ledgerSteps.find((s) => s.id === activeStepId) || ledgerSteps[1];

  return (
    <div
      className={cn(
        "relative rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-10 shadow-2xl overflow-hidden",
        className
      )}
    >
      {/* Background Micro Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative space-y-8">
        {/* Header Header & Live Indicator */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--brand)]">
              Interactive Financial Architecture
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-[var(--ink)]">
              The Closed-Loop Double-Entry Engine
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>INVARIANT ENFORCED</span>
          </div>
        </div>

        {/* Step Selector Horizontal Timeline */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {ledgerSteps.map((step) => {
            const isActive = step.id === activeStepId;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                type="button"
                className={cn(
                  "relative flex flex-col justify-between p-4 rounded-xl text-left transition-all",
                  isActive
                    ? "bg-[var(--surface-elevated)] border-2 border-[var(--brand)] shadow-lg shadow-emerald-950/50"
                    : "bg-[var(--surface-muted)]/60 border border-[var(--line)] hover:bg-[var(--surface-muted)]"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs font-black",
                    isActive ? "text-[var(--brand)]" : "text-[var(--muted)]"
                  )}
                >
                  STEP {step.number}
                </span>
                <span className="mt-2 text-xs font-bold text-[var(--ink)] leading-snug">
                  {step.title}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 rotate-45 bg-[var(--brand)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Detail Viewer for Selected Step */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-inverse)] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-xs font-extrabold text-[var(--accent)]">
                NODE {activeStep.number} // ARCHITECTURAL OPERATION
              </span>
              <h4 className="text-xl sm:text-2xl font-display font-extrabold text-[var(--ink)]">
                {activeStep.title}
              </h4>
              <p className="text-sm text-[var(--muted)] mt-0.5">{activeStep.subtitle}</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2 text-right">
              <span className="text-[0.68rem] font-mono text-[var(--muted)] uppercase block">
                Protocol Integrity
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">100% Mathematical Proof</span>
            </div>
          </div>

          {/* Double-Entry Split Breakdown */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-1.5">
              <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Asset Allocation (Debit)
              </span>
              <p className="font-mono text-sm font-bold text-[var(--ink)]">{activeStep.debitAccount}</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-1.5">
              <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-amber-400">
                Liability Allocation (Credit)
              </span>
              <p className="font-mono text-sm font-bold text-[var(--ink)]">{activeStep.creditAccount}</p>
            </div>
          </div>

          {/* Security Invariant Guarantee Bar */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/50 px-4 py-3 text-xs text-[var(--muted)]">
            <span className="font-mono font-extrabold text-[var(--brand)] shrink-0">[RULE]</span>
            <span className="leading-relaxed">{activeStep.securityInvariant}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
