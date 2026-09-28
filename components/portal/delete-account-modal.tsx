"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, X, ShieldAlert } from "lucide-react";
import { toast } from "@/lib/toast";

interface DeleteAccountModalProps {
  role: "CUSTOMER" | "VENDOR";
  onDeleted?: () => void;
}

export function DeleteAccountModal({ role, onDeleted }: DeleteAccountModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);

  const REQUIRED_PHRASE = "DELETE MY ACCOUNT";
  const isConfirmed = phrase === REQUIRED_PHRASE;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationPhrase: phrase }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message ?? data.message ?? "Failed to delete account.");
        return;
      }
      toast.success("Account deactivated. You will be signed out.");
      onDeleted?.();
      // Redirect to home after brief delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch {
      toast.error("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
      >
        <Trash2 size={14} />
        <span>Delete Account</span>
      </button>

      {/* Modal Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-md rounded-3xl border border-red-200 bg-white shadow-2xl overflow-hidden">
            {/* Danger stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />

            <div className="p-6 sm:p-8 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-red-100 text-red-600">
                    <ShieldAlert size={20} />
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-gray-900">Delete Account</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {role === "VENDOR" ? "Vendor workspace" : "Customer account"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => !loading && setOpen(false)}
                  className="text-gray-400 hover:text-gray-700 transition"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Warning box */}
              <div className="rounded-xl border border-red-100 bg-red-50/70 p-4 space-y-2">
                <p className="flex items-center gap-2 text-xs font-bold text-red-700">
                  <AlertTriangle size={13} />
                  This action is permanent and cannot be undone.
                </p>
                <ul className="space-y-1 text-xs text-red-600 list-disc list-inside">
                  <li>Your account will be immediately suspended.</li>
                  <li>All active sessions will be invalidated.</li>
                  {role === "CUSTOMER" && (
                    <li>Active investments must be fully settled before deletion.</li>
                  )}
                  {role === "VENDOR" && (
                    <li>All active coupons must be voided before deletion.</li>
                  )}
                  <li>Your data is retained for regulatory compliance for 7 years.</li>
                </ul>
              </div>

              {/* Confirmation phrase input */}
              <div className="space-y-2">
                <label
                  htmlFor="delete-confirm-phrase"
                  className="block text-xs font-bold text-gray-700"
                >
                  Type{" "}
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-red-600">
                    DELETE MY ACCOUNT
                  </code>{" "}
                  to confirm:
                </label>
                <input
                  id="delete-confirm-phrase"
                  type="text"
                  autoComplete="off"
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  disabled={loading}
                  placeholder="DELETE MY ACCOUNT"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none transition disabled:opacity-50"
                />
                {phrase.length > 0 && !isConfirmed && (
                  <p className="text-[0.72rem] text-red-500">
                    Phrase does not match. Type exactly: DELETE MY ACCOUNT
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => !loading && setOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel — Keep Account
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!isConfirmed || loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-pulse">Deleting...</span>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      <span>Permanently Delete</span>
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
