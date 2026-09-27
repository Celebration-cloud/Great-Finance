"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ReviewButtonsProps {
  requestId: string;
  onDone: () => void;
}

export function WithdrawalReviewButtons({ requestId, onDone }: ReviewButtonsProps) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(a: "approve" | "reject") {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/withdrawals/${requestId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: a, note: note || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(typeof json.error === "string" ? json.error : "Review failed.");
        return;
      }
      onDone();
    });
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-600 font-semibold">{error}</p>
      )}
      <div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional review note…"
          rows={2}
          className="w-full rounded-lg border border-[var(--line)] bg-slate-50 px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => submit("approve")}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {pending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
          Approve
        </button>
        <button
          onClick={() => submit("reject")}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition disabled:opacity-60"
        >
          {pending ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
          Reject
        </button>
      </div>
    </div>
  );
}
