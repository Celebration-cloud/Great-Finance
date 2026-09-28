"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface LedgerStep {
  id: string;
  title: string;
  subtitle: string;
  debitAccount: string;
  creditAccount: string;
  securityInvariant: string;
}

const ledgerSteps: LedgerStep[] = [
  {
    id: "paystack",
    title: "Payment confirmation",
    subtitle: "Payments are confirmed before funds appear in an account.",
    debitAccount: "DR: Settlement Gateway Cash Account",
    creditAccount: "CR: Customer Inflow Escrow Liability",
    securityInvariant: "A balance is added only after the payment provider confirms the transaction.",
  },
  {
    id: "double-entry",
    title: "Balanced records",
    subtitle: "Every transaction creates matching debit and credit entries.",
    debitAccount: "DR: Ledger Operational Liquidity",
    creditAccount: "CR: Customer Maturing Obligation",
    securityInvariant: "The system rejects any transaction whose entries do not balance.",
  },
  {
    id: "vendor-mint",
    title: "Vendor allocation",
    subtitle: "Purchased coupon batches are assigned to the vendor account.",
    debitAccount: "DR: Vendor Inventory Custody",
    creditAccount: "CR: Earned Distributor Wholesale Margin (up to 15%)",
    securityInvariant: "Each coupon has a unique code and can be redeemed only once.",
  },
  {
    id: "yield-maturation",
    title: "Plan maturity",
    subtitle: "The dashboard tracks the selected plan term and maturity date.",
    debitAccount: "DR: Maturation Liquidity Pool",
    creditAccount: "CR: Unlocked Customer Bank Payout",
    securityInvariant: "A withdrawal request becomes available only after the plan matures.",
  },
  {
    id: "settlement",
    title: "Bank payout",
    subtitle: "Approved withdrawals are sent to the customer's bank account.",
    debitAccount: "DR: Customer Payout Obligation Fulfilled",
    creditAccount: "CR: Settled Bank Transfer",
    securityInvariant: "Payouts require review and every approval is recorded.",
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
        <div className="border-b border-[var(--line)] pb-5">
          <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-[var(--ink)]">
            How transactions are recorded
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Follow a payment from confirmation through account records and final bank payout.
          </p>
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
                <span className="text-xs font-bold text-[var(--ink)] leading-snug">
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
          <div>
            <div>
              <h4 className="text-xl sm:text-2xl font-display font-extrabold text-[var(--ink)]">
                {activeStep.title}
              </h4>
              <p className="text-sm text-[var(--muted)] mt-0.5">{activeStep.subtitle}</p>
            </div>
          </div>

          {/* Double-Entry Split Breakdown */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-1.5">
              <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Debit entry
              </span>
              <p className="font-mono text-sm font-bold text-[var(--ink)]">{activeStep.debitAccount}</p>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 space-y-1.5">
              <span className="text-[0.68rem] font-mono font-bold uppercase tracking-wider text-amber-400">
                Credit entry
              </span>
              <p className="font-mono text-sm font-bold text-[var(--ink)]">{activeStep.creditAccount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/50 px-4 py-3 text-xs text-[var(--muted)]">
            <span className="leading-relaxed">{activeStep.securityInvariant}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
