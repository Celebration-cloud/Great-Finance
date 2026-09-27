import Link from "next/link";
import { ArrowRight, Clock, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { CouponAcquirer } from "@/components/vendor/coupon-acquirer";
import { PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AcquireCouponPage() {
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

  const isApproved = approval?.status === "APPROVED";
  const isPending = approval?.status === "PENDING" || (Boolean(submission) && !approval);

  if (!isApproved) {
    return (
      <section className="space-y-6">
        <PageHeader
          eyebrow="Inventory acquisition"
          title="Acquire Wholesale Coupons"
          description="Purchase bulk coupon packages directly from our institutional reserve at wholesale partner rates."
        />

        <div className="card max-w-2xl border-2 border-amber-300 bg-amber-50/80 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3.5">
            <span className="grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-800">
              <Lock size={24} />
            </span>
            <div>
              <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
                VERIFICATION REQUIRED
              </span>
              <h2 className="mt-1 text-2xl font-bold text-amber-950">Wholesale Acquisition Locked</h2>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-amber-900">
            As a financial compliance and security requirement, regional distributors must complete and receive approved Tier-1 KYC verification before acquiring wholesale coupon packages.
          </p>

          {isPending ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Clock size={16} />
                <span>Your KYC Verification is Under Review</span>
              </div>
              <p className="text-xs text-blue-800">
                Our compliance officers are inspecting your submitted documents. Acquisition privileges will unlock automatically upon approval.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <ShieldAlert size={16} />
                <span>You have not completed KYC verification yet</span>
              </div>
              <p className="text-xs text-amber-800">
                Upload your government-issued ID and live selfie to our encrypted vault to unlock your distributor privileges.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/vendor/kyc"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-800 px-6 py-3 text-xs font-bold text-white shadow hover:bg-amber-900 transition"
            >
              <ShieldCheck size={16} />
              <span>{isPending ? "View KYC Application Status" : "Carry out KYC Verification"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        eyebrow="Inventory"
        title="Acquire coupon"
        description="Select quantities from the original plan catalogue and pay through verified checkout."
      />
      <CouponAcquirer />
    </section>
  );
}
