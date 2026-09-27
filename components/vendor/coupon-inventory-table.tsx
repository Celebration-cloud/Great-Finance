"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Search,
  Ticket,
} from "lucide-react";
import { toast } from "@/lib/toast";

export interface SerializedCoupon {
  id: string;
  code: string;
  planName: string;
  planAmount: number;
  returnAmount: number;
  durationDays: number;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED" | "VOIDED";
  redeemedBy: string | null;
  redeemedAt: string | null;
  issuedAt: string;
}

interface Props {
  coupons: SerializedCoupon[];
}

export function CouponInventoryTable({ coupons }: Props) {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "REDEEMED">("ALL");
  const [search, setSearch] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const filtered = coupons.filter((c) => {
    if (filter !== "ALL" && c.status !== filter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.planName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCoupons = coupons.filter((c) => c.status === "ACTIVE");

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Copied coupon code: ${code}`);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  const handleCopyAllActive = async () => {
    if (!activeCoupons.length) {
      toast.error("No active coupons to copy.");
      return;
    }
    const text = activeCoupons.map((c) => `${c.code} (${c.planName} - ₦${c.planAmount.toLocaleString()})`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      toast.success(`Copied ${activeCoupons.length} active coupon codes!`);
      setTimeout(() => setCopiedAll(false), 3000);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls: Search, Filter Tabs, Bulk Copy */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["ALL", "ACTIVE", "REDEEMED"] as const).map((tab) => {
            const count =
              tab === "ALL"
                ? coupons.length
                : tab === "ACTIVE"
                  ? activeCoupons.length
                  : coupons.filter((c) => c.status === "REDEEMED").length;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                  filter === tab
                    ? "bg-[var(--brand)] text-white shadow-sm"
                    : "border border-[var(--line)] bg-white text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {tab === "ALL" ? "All Coupons" : tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative min-w-[200px]">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search code or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-white py-1.5 pl-8 pr-3 text-xs font-medium text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyAllActive}
            disabled={!activeCoupons.length}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/10 px-3 py-1.5 text-xs font-bold text-[var(--brand)] hover:bg-[var(--brand)]/20 transition disabled:opacity-40"
            title="Copy all active unredeemed coupon codes to clipboard"
          >
            {copiedAll ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedAll ? "Copied All!" : "Copy Active"}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--surface-muted)]/50 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              <tr>
                <th className="px-5 py-3.5">Coupon Code</th>
                <th className="px-5 py-3.5">Plan / Package</th>
                <th className="px-5 py-3.5">Cost / Value</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Issued</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filtered.map((coupon) => {
                const isCopied = copiedCode === coupon.code;
                return (
                  <tr key={coupon.id} className="hover:bg-[var(--surface-muted)]/40 transition">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-bold tracking-wider text-[var(--ink)]">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-xs text-[var(--ink)]">
                      {coupon.planName}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="font-semibold text-[var(--ink)]">
                        ₦{coupon.planAmount.toLocaleString()}
                      </span>
                      <span className="text-[var(--muted)]"> → </span>
                      <span className="font-bold text-emerald-600">
                        ₦{coupon.returnAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[var(--muted)]">
                      {coupon.durationDays} days
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-bold ${
                          coupon.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : coupon.status === "REDEEMED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-neutral-100 text-neutral-800"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[var(--muted)]">
                      {new Date(coupon.issuedAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(coupon.code)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                          isCopied
                            ? "bg-emerald-600 text-white"
                            : "border border-[var(--line)] bg-[var(--surface-muted)]/50 text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                        }`}
                        title="Copy coupon code"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!filtered.length && (
          <div className="p-8 text-center">
            <Ticket className="mx-auto size-9 text-[var(--muted)]" />
            <p className="mt-2 text-sm font-bold text-[var(--ink)]">No coupons match your filter</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {coupons.length === 0
                ? "Acquire wholesale coupon packages to build your retail distributor inventory."
                : "Try clearing your search query or switching tabs."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
