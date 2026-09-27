"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle, Share2, Sparkles, UsersRound } from "lucide-react";
import { toast } from "@/lib/toast";

export function ReferralKit({
  referralCode,
  totalReferrals,
}: {
  referralCode: string;
  totalReferrals: number;
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/signup?ref=${referralCode}`;
    }
    return `https://greatfinance.com/signup?ref=${referralCode}`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      toast.success(`Referral code ${referralCode} copied!`);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("Failed to copy referral code.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopiedLink(true);
      toast.success("Referral invitation link copied!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const shareText = encodeURIComponent(
    `Join me on Great Finance, the premier institutional ledger investment platform. Use my referral code: ${referralCode}\n${getShareUrl()}`
  );
  const whatsappShareUrl = `https://wa.me/?text=${shareText}`;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--surface-muted)] p-6 shadow-sm space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
            <Sparkles size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-[var(--ink)]">Your Referral Kit</h3>
            <p className="text-xs text-[var(--muted)]">
              Earn lifetime rewards whenever peers register and activate investments using your link.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-bold text-[var(--brand)] sm:self-auto">
          <UsersRound size={13} />
          <span>{totalReferrals} Invited Peers</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Code Box */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-white p-3.5 shadow-xs">
          <div>
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)] block">
              Personal Referral Code
            </span>
            <span className="font-mono text-base font-extrabold tracking-wider text-[var(--ink)]">
              {referralCode}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--surface-muted)]/50 px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition"
          >
            {copiedCode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
            <span>{copiedCode ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Share Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--line)] bg-white py-3 px-3.5 text-xs font-bold text-[var(--ink)] shadow-xs hover:bg-[var(--surface-muted)] transition"
          >
            {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            <span>{copiedLink ? "Link Copied!" : "Copy Invite Link"}</span>
          </button>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            title="Share via WhatsApp"
          >
            <MessageCircle size={15} />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
