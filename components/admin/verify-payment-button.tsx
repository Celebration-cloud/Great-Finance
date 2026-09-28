"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";

interface Payment {
  id: string;
  reference: string;
  organizationId: string;
  amountMinor: bigint | string;
  currency: string;
  status: string;
  createdAt: Date | string;
}

export function VerifyPaymentButton({ payment, formatted }: { payment: Payment; formatted: string }) {
  const [open, setOpen] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState(
    Number(payment.amountMinor) / 100
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: payment.id,
          confirmedAmountMinor: Math.round(confirmedAmount * 100),
          confirmedCurrency: payment.currency,
          adminNote: note.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message ?? data.message ?? "Verification failed.");
        return;
      }
      toast.success(data.message ?? `Payment ${payment.reference} verified.`);
      setDone(true);
      setOpen(false);
    } catch {
      toast.error("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
        <CheckCircle2 size={13} />
        Verified
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-3.5 py-2 text-xs font-bold text-white hover:bg-[var(--brand-dark)] transition"
      >
        <CheckCircle2 size={13} />
        <span>Verify Manually</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-[var(--line)] bg-white shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-[var(--ink)]">Manual Verification</h3>
                  <p className="text-xs text-[var(--muted)]">{payment.reference}</p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3 flex gap-2.5">
                <AlertCircle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Use this only when Paystack&apos;s webhook failed to auto-verify and the amount has
                  confirmed cleared in your Paystack dashboard. This action is fully audited.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--ink)]">
                    Original Amount (displayed)
                  </label>
                  <p className="text-sm font-mono font-bold text-[var(--ink)] bg-[var(--surface-muted)]/30 border border-[var(--line)] rounded-xl px-4 py-2.5">
                    {formatted}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmed-amount" className="block text-xs font-bold text-[var(--ink)]">
                    Confirmed Amount ({payment.currency})
                  </label>
                  <input
                    id="confirmed-amount"
                    type="number"
                    step="0.01"
                    min="1"
                    value={confirmedAmount}
                    onChange={(e) => setConfirmedAmount(parseFloat(e.target.value))}
                    disabled={loading}
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/20 px-4 py-2.5 text-sm font-mono text-[var(--ink)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 outline-none transition disabled:opacity-50"
                  />
                  <p className="text-[0.7rem] text-[var(--muted)]">
                    Enter the exact amount (in {payment.currency.toUpperCase()}, not kobo) as shown in your Paystack dashboard.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="admin-note" className="block text-xs font-bold text-[var(--ink)]">
                    Admin Note <span className="font-normal text-[var(--muted)]">(required for audit)</span>
                  </label>
                  <textarea
                    id="admin-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. Paystack dashboard shows cleared — webhook failed due to timeout."
                    className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/20 px-4 py-2.5 text-xs text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 outline-none transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => !loading && setOpen(false)}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={loading || confirmedAmount <= 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Confirm & Settle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
