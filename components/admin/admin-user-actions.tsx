"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle, LoaderCircle, ShieldAlert } from "lucide-react";
import { toast } from "@/lib/toast";

interface AdminUserActionsProps {
  membershipId: string;
  currentStatus: "ACTIVE" | "SUSPENDED" | "INVITED";
  subject: "User" | "Vendor";
  name: string;
}

export function AdminUserActions({
  membershipId,
  currentStatus,
  subject,
  name,
}: AdminUserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleStatus = async (targetStatus: "ACTIVE" | "SUSPENDED") => {
    const actionLabel = targetStatus === "SUSPENDED" ? "ban" : "unban";
    if (
      targetStatus === "SUSPENDED" &&
      !window.confirm(`Are you sure you want to ban ${subject.toLowerCase()} "${name}"? They will lose access to all portals immediately.`)
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/memberships/${membershipId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || `Failed to ${actionLabel} ${subject.toLowerCase()}`);
      }

      toast.success(
        targetStatus === "SUSPENDED"
          ? `${subject} "${name}" has been banned.`
          : `${subject} "${name}" has been unbanned and restored.`
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${actionLabel} ${subject.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {currentStatus === "ACTIVE" ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => toggleStatus("SUSPENDED")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-100 hover:text-red-800 disabled:opacity-50"
          title={`Ban this ${subject.toLowerCase()}`}
        >
          {loading ? (
            <LoaderCircle size={13} className="animate-spin text-red-700" />
          ) : (
            <Ban size={13} className="text-red-700" />
          )}
          <span>Ban {subject}</span>
        </button>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => toggleStatus("ACTIVE")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-100 hover:text-emerald-800 disabled:opacity-50"
          title={`Unban this ${subject.toLowerCase()}`}
        >
          {loading ? (
            <LoaderCircle size={13} className="animate-spin text-emerald-700" />
          ) : (
            <CheckCircle size={13} className="text-emerald-700" />
          )}
          <span>Unban {subject}</span>
        </button>
      )}

      {currentStatus === "SUSPENDED" && (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[0.68rem] font-bold text-red-800">
          Banned
        </span>
      )}
    </div>
  );
}
