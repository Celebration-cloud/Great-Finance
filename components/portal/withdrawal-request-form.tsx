"use client";

import { useState, useTransition } from "react";
import { Landmark, Loader2, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface WithdrawalFormProps {
  investmentId: string;
  planName: string;
  returnAmount: number;
  matureAt: string;
  isMatured: boolean;
  daysLeft: number;
  hasActivePending: boolean;
}

export function WithdrawalRequestForm({
  investmentId,
  planName,
  returnAmount,
  matureAt,
  isMatured,
  daysLeft,
  hasActivePending,
}: WithdrawalFormProps) {
  const [open, setOpen] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const maturityLabel = new Date(matureAt).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ investmentId, bankName, accountNumber, accountName }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(
          typeof json.error === "string"
            ? json.error
            : "Failed to submit request. Please try again."
        );
        return;
      }
      setSuccess(true);
      setOpen(false);
    });
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
        <span className="font-semibold">Withdrawal submitted — Admin will process within 1–3 business days.</span>
      </div>
    );
  }

  if (hasActivePending) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
        <Clock size={16} className="shrink-0 text-amber-600" />
        <span className="font-semibold">Withdrawal request in progress — awaiting admin review.</span>
      </div>
    );
  }

  if (!isMatured) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
        <Clock size={16} className="shrink-0" />
        <span>
          Withdrawals unlock on <strong className="text-[var(--ink)]">{maturityLabel}</strong>
          {daysLeft > 0 && (
            <span className="ml-1 text-xs">({daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining)</span>
          )}
        </span>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
        >
          <Landmark size={14} />
          Withdraw ₦{returnAmount.toLocaleString("en-NG")}
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-3 rounded-xl border border-[var(--line)] bg-white p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[var(--ink)]">Bank details for {planName} Plan</h4>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-[var(--muted)] -mt-2">
            Payout amount: <strong className="text-emerald-700">₦{returnAmount.toLocaleString("en-NG")}</strong>
          </p>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-700">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Bank name</label>
              <input
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Access Bank"
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Account number (NUBAN)</label>
              <input
                required
                pattern="\d{10}"
                maxLength={10}
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="0123456789"
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
              <p className="mt-1 text-[0.7rem] text-[var(--muted)]">Must be exactly 10 digits</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">Account name</label>
              <input
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. JOHN DOE"
                className="w-full rounded-lg border border-[var(--line)] bg-[var(--surface-muted)] px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            ⚠️ Double-check your account details. Great Finance is not liable for transfers made to incorrect accounts.
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Landmark size={15} />
                Submit Withdrawal Request
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
