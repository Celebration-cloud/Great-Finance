import Link from "next/link";
import {
  ArrowRight,
  BadgeAlert,
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileCheck,
  Lock,
  RotateCcw,
  ShieldCheck,
  Store,
} from "lucide-react";
import { KycForm } from "@/components/vendor/kyc-form";
import { PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function KycPage() {
  const principal = await requireRole(["VENDOR"]);
  const db = getPrisma();

  const [submission, approval] = await Promise.all([
    db.vendorKycSubmission.findFirst({
      where: { authUserId: principal.userId },
      orderBy: { submittedAt: "desc" },
    }),
    db.approvalRequest.findFirst({
      where: { resourceType: "vendor-kyc", requestedBy: principal.userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isPending = approval?.status === "PENDING" || (Boolean(submission) && !approval);
  const isApproved = approval?.status === "APPROVED";
  const isRejected = approval?.status === "REJECTED";

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Identity review & compliance"
        title="Distributor KYC Verification"
        description="Submit your verified government credentials to unlock unrestricted wholesale coupon batch acquisition."
      />

      {/* Case 1: Application is PENDING REVIEW */}
      {isPending && (
        <div className="card max-w-2xl border-2 border-blue-200 bg-gradient-to-b from-white to-blue-50/30 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3.5">
            <span className="grid size-12 place-items-center rounded-2xl bg-blue-100 text-blue-700">
              <Clock size={24} />
            </span>
            <div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
                APPLICATION UNDER REVIEW
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[var(--ink)]">KYC Application Submitted</h2>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Your identity documents and live verification photo have been securely transmitted to our zero-exposure private document vault. Our compliance officers are reviewing your application.
          </p>

          <div className="rounded-xl border border-[var(--line)] bg-white p-5 space-y-3 text-xs">
            <div className="flex justify-between border-b border-[var(--line)] pb-2.5">
              <span className="text-[var(--muted)]">Applicant Full Name:</span>
              <span className="font-bold text-[var(--ink)]">{submission?.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--line)] pb-2.5">
              <span className="text-[var(--muted)]">Origin & LGA:</span>
              <span className="font-bold text-[var(--ink)]">{submission?.localGovernment}, {submission?.stateOfOrigin}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--line)] pb-2.5">
              <span className="text-[var(--muted)]">Submitted Timestamp:</span>
              <span className="font-semibold text-[var(--ink)]">
                {submission?.submittedAt.toLocaleString("en-NG", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Review Request ID:</span>
              <span className="font-mono text-[var(--muted)]">{approval?.id ?? "Pending sync"}</span>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Multiple Submissions Prevented:</strong> You cannot submit another KYC application while your current submission is under active review. Standard turnaround time is within 2 business hours.
            </span>
          </div>

          <div className="pt-2">
            <Link
              href="/vendor/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-xs font-bold text-white shadow hover:bg-[var(--brand-dark)] transition"
            >
              <span>Return to Vendor Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Case 2: Application is APPROVED */}
      {isApproved && (
        <div className="card max-w-2xl border-2 border-emerald-300 bg-gradient-to-b from-white to-emerald-50/30 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3.5">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <BadgeCheck size={26} />
            </span>
            <div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                VERIFIED DISTRIBUTOR
              </span>
              <h2 className="mt-1 text-2xl font-bold text-[var(--ink)]">Tier-1 Verification Complete</h2>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Congratulations! Your distributor identity verification has been inspected and approved. Your account has full privileges to acquire wholesale coupon batches.
          </p>

          <div className="rounded-xl border border-[var(--line)] bg-white p-5 space-y-3 text-xs">
            <div className="flex justify-between border-b border-[var(--line)] pb-2.5">
              <span className="text-[var(--muted)]">Verified Name:</span>
              <span className="font-bold text-[var(--ink)]">{submission?.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-[var(--line)] pb-2.5">
              <span className="text-[var(--muted)]">Approval Status:</span>
              <span className="font-bold text-emerald-700">Level 1 Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted)]">Compliance Note:</span>
              <span className="text-[var(--ink)]">{approval?.reviewNote ?? "Verified by compliance officer"}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/vendor/acquire"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-xs font-bold text-white shadow hover:bg-[var(--brand-dark)] transition"
            >
              <Store size={15} />
              <span>Acquire Wholesale Coupons</span>
            </Link>
            <Link
              href="/vendor/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-xs font-bold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition"
            >
              <span>View Inventory</span>
            </Link>
          </div>
        </div>
      )}

      {/* Case 3: Application was REJECTED (Allows Resubmission with feedback) */}
      {isRejected && (
        <div className="space-y-6 max-w-2xl">
          <div className="rounded-2xl border border-red-300 bg-red-50 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <BadgeAlert className="size-6 text-red-700" />
              <h3 className="font-bold text-red-900">KYC Verification Rejected</h3>
            </div>
            <p className="text-xs text-red-800 leading-relaxed">
              Your previous KYC submission was rejected by compliance with the following feedback:
            </p>
            <blockquote className="rounded-xl border border-red-200 bg-white p-3.5 text-xs font-semibold text-red-900">
              &quot;{approval?.reviewNote || "Submitted documents did not satisfy compliance requirements."}&quot;
            </blockquote>
            <p className="text-xs text-red-800">
              Please review the feedback above and submit updated, legible identity credentials below.
            </p>
          </div>

          <div className="card p-7 sm:p-9">
            <h3 className="text-lg font-bold text-[var(--ink)]">Resubmit Verification Credentials</h3>
            <KycForm />
          </div>
        </div>
      )}

      {/* Case 4: First Time Applicant */}
      {!submission && !approval && (
        <div className="card max-w-2xl p-7 sm:p-9">
          <KycForm />
        </div>
      )}
    </section>
  );
}
