"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Download, Eye, LoaderCircle, Minus, Plus, RotateCcw, X } from "lucide-react";
import { toast } from "@/lib/toast";

interface VendorVerificationActionsProps {
  approvalId: string;
  submissionId: string;
  vendorName: string;
}
const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

export function VendorVerificationActions({
  approvalId,
  submissionId,
  vendorName,
}: VendorVerificationActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [previewKind, setPreviewKind] = useState<"identity" | "selfie" | null>(null);
  const [zoom, setZoom] = useState(1);

  const zoomIn = () => setZoom((z) => Math.min(parseFloat((z + ZOOM_STEP).toFixed(2)), ZOOM_MAX));
  const zoomOut = () => setZoom((z) => Math.max(parseFloat((z - ZOOM_STEP).toFixed(2)), ZOOM_MIN));
  const zoomReset = () => setZoom(1);

  const openPreview = (kind: "identity" | "selfie") => {
    setZoom(1);
    setPreviewKind(kind);
  };

  const handleDownload = (kind: "identity" | "selfie") => {
    const url = `/api/storage/kyc/${submissionId}/${kind}?download=1`;
    const safeName = vendorName.toLowerCase().replace(/\s+/g, "-");
    const filename = `${safeName}-${kind}-kyc.jpg`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success(`Downloading ${kind === "identity" ? "identity document" : "selfie photo"} for ${vendorName}.`);
  };

  const handleDecision = async (decision: "APPROVED" | "REJECTED", note?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || `Failed to ${decision.toLowerCase()} verification.`);
      }

      toast.success(
        decision === "APPROVED"
          ? `KYC for ${vendorName} approved successfully.`
          : `KYC for ${vendorName} has been rejected.`
      );
      setRejecting(false);
      setRejectNote("");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record decision.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Document Preview Buttons (Inline preview, NOT download) */}
        <button
          type="button"
          onClick={() => openPreview("identity")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--surface-muted)] transition"
          title="Preview identity document inline"
        >
          <Eye size={13} />
          <span>Identity Doc</span>
        </button>

        <button
          type="button"
          onClick={() => openPreview("selfie")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--surface-muted)] transition"
          title="Preview selfie photo inline"
        >
          <Eye size={13} />
          <span>Photo</span>
        </button>

        {/* Quick Approve Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => handleDecision("APPROVED", "Verified by compliance officer")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? <LoaderCircle size={13} className="animate-spin" /> : <Check size={13} />}
          <span>Approve</span>
        </button>

        {/* Quick Reject Button */}
        <button
          type="button"
          disabled={loading}
          onClick={() => setRejecting(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
        >
          <X size={13} />
          <span>Reject</span>
        </button>
      </div>

      {/* Reject Modal */}
      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--ink)]">Reject KYC Application</h3>
              <button
                type="button"
                onClick={() => setRejecting(false)}
                className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--surface-muted)]"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Specify the reason for rejecting <strong className="text-[var(--ink)]">{vendorName}</strong>. This note will be recorded in the audit trail and visible to the vendor.
            </p>
            <textarea
              className="w-full rounded-xl border border-[var(--line)] p-3 text-xs focus:outline-[var(--brand)]"
              rows={3}
              placeholder="e.g. Identity document expired, name mismatch, or unreadable photo."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setRejecting(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[var(--muted)] hover:bg-[var(--surface-muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading || !rejectNote.trim()}
                onClick={() => handleDecision("REJECTED", rejectNote)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading && <LoaderCircle size={13} className="animate-spin" />}
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Document Preview Modal (No download) */}
      {previewKind && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in"
          onWheel={(e) => {
            e.preventDefault();
            if (e.deltaY < 0) zoomIn();
            else zoomOut();
          }}
        >
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] px-5 py-3">
              <div>
                <p className="text-xs font-bold text-[var(--ink)]">
                  {previewKind === "identity" ? "Identity Document" : "Live Selfie Photo"}
                </p>
                <p className="text-[0.68rem] text-[var(--muted)]">Vendor: {vendorName}</p>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  className="rounded-lg border border-[var(--line)] bg-white p-1.5 text-[var(--ink)] hover:bg-[var(--surface-muted)] disabled:opacity-30 transition"
                  title="Zoom Out"
                  aria-label="Zoom out"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  onClick={zoomReset}
                  className="rounded-lg border border-[var(--line)] bg-white px-2 py-1 text-[0.65rem] font-bold tabular-nums text-[var(--ink)] hover:bg-[var(--surface-muted)] transition min-w-[3.5rem] text-center"
                  title="Reset zoom"
                  aria-label="Reset zoom"
                >
                  <span className="flex items-center gap-0.5">
                    <RotateCcw size={11} />
                    {Math.round(zoom * 100)}%
                  </span>
                </button>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  className="rounded-lg border border-[var(--line)] bg-white p-1.5 text-[var(--ink)] hover:bg-[var(--surface-muted)] disabled:opacity-30 transition"
                  title="Zoom In"
                  aria-label="Zoom in"
                >
                  <Plus size={14} />
                </button>
                <div className="mx-1 h-5 w-px bg-[var(--line)]" />
                {/* Download Button */}
                <button
                  type="button"
                  onClick={() => handleDownload(previewKind!)}
                  className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-2 py-1.5 text-[0.65rem] font-bold text-teal-700 hover:bg-teal-100 transition"
                  title="Download this document"
                  aria-label="Download document"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
                <div className="mx-1 h-5 w-px bg-[var(--line)]" />
                <button
                  type="button"
                  onClick={() => { setPreviewKind(null); zoomReset(); }}
                  className="rounded-lg p-1.5 text-[var(--muted)] hover:bg-white hover:text-[var(--ink)] transition"
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Image Viewport — overflow hidden + scroll so zoomed image pans */}
            <div className="relative flex min-h-[350px] max-h-[calc(90vh-7.5rem)] items-center justify-center overflow-auto bg-slate-900/90">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.15s ease",
                  display: "inline-block",
                  padding: zoom > 1 ? "2rem" : "1.5rem",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/storage/kyc/${submissionId}/${previewKind}`}
                  alt={`${vendorName} ${previewKind}`}
                  className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-lg select-none"
                  loading="eager"
                  draggable={false}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--surface-muted)] px-5 py-2 text-xs text-[var(--muted)]">
              <span>Scroll or use buttons to zoom · Secure encrypted stream</span>
              <button
                type="button"
                onClick={() => { setPreviewKind(null); zoomReset(); }}
                className="font-bold text-[var(--brand)] hover:underline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
