"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Loader2, RefreshCcw } from "lucide-react";

export function WithdrawalReviewInline({ requestId }: { requestId: string }) {
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
          done === "approved"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
            : "bg-red-50 border border-red-200 text-red-800"
        }`}
      >
        {done === "approved" ? (
          <CheckCircle2 size={14} />
        ) : (
          <XCircle size={14} />
        )}
        Request {done}. Reload page to refresh queue.
        <button onClick={() => window.location.reload()} className="ml-auto underline">
          <RefreshCcw size={12} />
        </button>
      </div>
    );
  }

  function submit(action: "approve" | "reject") {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/withdrawals/${requestId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: note || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(typeof json.error === "string" ? json.error : "Review failed.");
        return;
      }
      setDone(action === "approve" ? "approved" : "rejected");
    });
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional admin note (visible in audit log)…"
        rows={2}
        className="w-full rounded-lg border border-[var(--line)] bg-slate-50 px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
      />
      <div className="flex gap-2">
        <button
          onClick={() => submit("approve")}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60"
        >
          {pending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
          Approve & settle
        </button>
        <button
          onClick={() => submit("reject")}
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition disabled:opacity-60"
        >
          {pending ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
          Reject
        </button>
      </div>
    </div>
  );
}
