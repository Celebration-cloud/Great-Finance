"use client";

import { useState } from "react";
import {
  UserPlus,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Info,
} from "lucide-react";
import { toast } from "@/lib/toast";

interface InviteResult {
  inviteeEmail: string;
  role: string;
  expiresAt: string;
}

export function AdminInviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "REVIEWER">("ADMIN");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InviteResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role, note: note.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message ?? data.message ?? "Failed to send invitation.");
        return;
      }
      setResult(data.data as InviteResult);
      toast.success(`Invitation dispatched to ${email}`);
      setEmail("");
      setNote("");
    } catch {
      toast.error("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex gap-3">
        <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          Invitations generate a secure 48-hour one-time link sent to the recipient&apos;s email.
          The invitee creates their own password during onboarding. Admin accounts cannot
          self-register — this is the only provisioning pathway.
        </p>
      </div>

      {/* Invite Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-5">
        <div className="border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-[var(--brand)]" />
            <h3 className="text-base font-bold text-[var(--ink)]">Send Admin Invitation</h3>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Only Super Admins can invite new administrators. The link expires in 48 hours.
          </p>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="invite-email" className="block text-xs font-bold text-[var(--ink)]">
              Recipient Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                id="invite-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/20 pl-9 pr-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 outline-none transition disabled:opacity-50"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label htmlFor="invite-role" className="block text-xs font-bold text-[var(--ink)]">
              Assigned Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["ADMIN", "REVIEWER"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  disabled={loading}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                    role === r
                      ? "border-[var(--brand)] bg-[var(--brand)]/5 text-[var(--brand)]"
                      : "border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--surface-muted)]/40"
                  }`}
                >
                  <Shield size={13} />
                  <div className="text-left">
                    <p className="font-bold">{r}</p>
                    <p className="text-[0.65rem] font-normal opacity-70">
                      {r === "ADMIN" ? "Full admin access" : "Read-only review access"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label htmlFor="invite-note" className="block text-xs font-bold text-[var(--ink)]">
              Personal Note{" "}
              <span className="text-[var(--muted)] font-normal">(optional)</span>
            </label>
            <textarea
              id="invite-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={loading}
              placeholder="Optional message included in the invite email..."
              className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/20 px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/10 outline-none transition disabled:opacity-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-dark)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-pulse">Dispatching invitation...</span>
          ) : (
            <>
              <Mail size={14} />
              <span>Send Invitation Link</span>
            </>
          )}
        </button>
      </form>

      {/* Success result */}
      {result && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <h4 className="text-sm font-bold text-emerald-800">Invitation Dispatched</h4>
          </div>
          <div className="grid gap-2 text-xs text-emerald-700">
            <div className="flex items-center gap-2">
              <Mail size={12} />
              <span>
                <strong>To:</strong> {result.inviteeEmail}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={12} />
              <span>
                <strong>Role:</strong> {result.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} />
              <span>
                <strong>Expires:</strong>{" "}
                {new Date(result.expiresAt).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
          <p className="text-[0.7rem] text-emerald-600 mt-2">
            The recipient must click the link before expiry to complete their account setup.
          </p>
        </div>
      )}

      {/* Role Permission Matrix */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[var(--brand)]" />
            <h3 className="text-base font-bold text-[var(--ink)]">Role Permission Reference</h3>
          </div>
        </div>
        <div className="space-y-3">
          {[
            {
              role: "REVIEWER",
              badge: "bg-blue-100 text-blue-800",
              desc: "Read-only auditor. Can review approval queues, KYC submissions, ledger entries, and payment history. Cannot post transactions or approve withdrawals.",
            },
            {
              role: "ADMIN",
              badge: "bg-amber-100 text-amber-800",
              desc: "Full administrative access including payment approvals, withdrawal processing, vendor management, and manual ledger entries. Cannot invite other admins.",
            },
            {
              role: "SUPER_ADMIN",
              badge: "bg-red-100 text-red-800",
              desc: "Unrestricted system access. Can invite and provision new admin accounts. Cannot be invited via this panel — must be provisioned directly in the database.",
            },
          ].map((item) => (
            <div
              key={item.role}
              className="flex items-start gap-3 rounded-xl border border-[var(--line)]/60 bg-[var(--surface-muted)]/20 p-3"
            >
              <span className={`rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold shrink-0 ${item.badge}`}>
                {item.role}
              </span>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 mt-2">
          <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[0.7rem] text-[var(--muted)]">
            Invitations from this panel can only provision ADMIN or REVIEWER roles. SUPER_ADMIN provisioning requires direct database access.
          </p>
        </div>
      </div>
    </div>
  );
}
