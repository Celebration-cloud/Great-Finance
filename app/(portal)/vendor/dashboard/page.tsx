import Link from "next/link";
import {
  ArrowRight,
  BadgeAlert,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { DataTable, EmptyState, MetricGrid, PageHeader } from "@/components/portal/page-header";
import { Pagination } from "@/components/portal/pagination";
import { CouponInventoryTable, type SerializedCoupon } from "@/components/vendor/coupon-inventory-table";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";
import { parseVendorTier, VENDOR_TIERS } from "@/lib/vendor/tiers";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function VendorDashboardPage({ searchParams }: Props) {
  const principal = await requireRole(["VENDOR"]);
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const db = getPrisma();

  const [
    profile,
    kycSubmission,
    kycApproval,
    totalSucceededCount,
    succeededPayments,
    totalVolumeSum,
    totalCouponsCount,
    activeCouponsCount,
    redeemedCouponsCount,
    couponsRaw,
  ] = await Promise.all([
    db.profile.findUnique({ where: { authUserId: principal.userId } }),
    db.vendorKycSubmission.findFirst({
      where: { authUserId: principal.userId },
      orderBy: { submittedAt: "desc" },
    }),
    db.approvalRequest.findFirst({
      where: { resourceType: "vendor-kyc", requestedBy: principal.userId },
      orderBy: { createdAt: "desc" },
    }),
    db.paymentIntent.count({
      where: { organizationId: principal.organizationId, status: "SUCCEEDED" },
    }),
    db.paymentIntent.findMany({
      where: { organizationId: principal.organizationId, status: "SUCCEEDED" },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.paymentIntent.aggregate({
      where: { organizationId: principal.organizationId, status: "SUCCEEDED" },
      _sum: { amountMinor: true },
    }),
    db.coupon.count({
      where: { vendorOrgId: principal.organizationId },
    }),
    db.coupon.count({
      where: { vendorOrgId: principal.organizationId, status: "ACTIVE" },
    }),
    db.coupon.count({
      where: { vendorOrgId: principal.organizationId, status: "REDEEMED" },
    }),
    db.coupon.findMany({
      where: { vendorOrgId: principal.organizationId },
      orderBy: { issuedAt: "desc" },
      take: 100,
    }),
  ]);

  const totalAcquiredMinor = totalVolumeSum._sum.amountMinor ?? BigInt(0);
  const totalPages = Math.ceil(totalSucceededCount / pageSize);

  const kycStatus =
    kycApproval?.status === "APPROVED"
      ? "APPROVED"
      : kycApproval?.status === "PENDING" || Boolean(kycSubmission)
        ? "PENDING"
        : "NOT_SUBMITTED";

  const serializedCoupons: SerializedCoupon[] = couponsRaw.map((c) => ({
    id: c.id,
    code: c.code,
    planName: c.planName,
    planAmount: c.planAmount,
    returnAmount: c.returnAmount,
    durationDays: c.durationDays,
    status: c.status,
    redeemedBy: c.redeemedBy,
    redeemedAt: c.redeemedAt?.toISOString() ?? null,
    issuedAt: c.issuedAt.toISOString(),
  }));

  const activeTier = parseVendorTier(profile?.vendorTier);
  const tierDef = VENDOR_TIERS[activeTier] ?? VENDOR_TIERS.TIER_1_STARTER;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Vendor Workspace"
        title={profile?.displayName ? `${profile.displayName} (Distributor)` : "Vendor Dashboard"}
        description="Manage your minted coupon codes, distribute codes to buyers, track redemption cycles, and review wholesale payment settlements."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
              href="/vendor/acquire"
            >
              <Plus size={16} />
              <span>Acquire New Coupons</span>
            </Link>
          </div>
        }
      />

      {/* KYC Verification Status Notice */}
      {kycStatus === "NOT_SUBMITTED" && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3.5">
              <BadgeAlert className="size-6 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900">Tier-1 KYC Verification Required</p>
                <p className="mt-0.5 text-xs text-amber-800 leading-relaxed max-w-2xl">
                  To protect our distribution network and ensure uninhibited batch acquisition, please submit your government ID and live selfie to our encrypted document vault.
                </p>
              </div>
            </div>
            <Link
              href="/vendor/kyc"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-800 transition whitespace-nowrap"
            >
              <ShieldCheck size={14} />
              <span>Submit KYC Verification</span>
            </Link>
          </div>
        </div>
      )}

      {kycStatus === "PENDING" && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/90 p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <Clock className="size-6 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-900">KYC Verification Under Review</p>
              <p className="mt-0.5 text-xs text-blue-800 leading-relaxed">
                Your identity credentials have been securely uploaded to our private vault. A compliance review officer will inspect your submission shortly. Standard turnaround is within 2 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {kycStatus === "APPROVED" && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-sm">
          <div className="flex items-center gap-3.5">
            <BadgeCheck className="size-6 text-emerald-700 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Authorized Distributor (Level 1 Verified)</p>
              <p className="text-xs text-emerald-800">
                Your vendor organization is fully verified. You enjoy full wholesale allocations and instantaneous inventory settlement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Vendor Partner Tier Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[var(--surface)] via-[var(--surface-muted)]/40 to-[var(--brand)]/5 p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/20">
              <Zap size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--brand)]/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-[var(--brand)] uppercase tracking-wider">
                  Partner Level
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-800">
                  {tierDef.marginLabel}
                </span>
              </div>
              <h2 className="mt-1 text-xl font-extrabold text-[var(--ink)]">{tierDef.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/vendor/acquire"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
            >
              <span>Acquire at {tierDef.marginPercent}% Off</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Tier Perks Checklist */}
        <div className="border-t border-[var(--line)] pt-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)] mb-2">Active Partner Advantages & SLAs</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {tierDef.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-xl bg-white border border-[var(--line)] px-3 py-2 text-xs text-[var(--ink)] shadow-2xs">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span className="font-semibold truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Volume & Qualification Indicator */}
        <div className="flex flex-col gap-1 rounded-xl bg-[var(--surface)] p-3 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <TrendingUp size={14} className="text-[var(--brand)]" />
            <span>Target Volume Range: <strong className="text-[var(--ink)]">{tierDef.volume}</strong></span>
          </div>
          <span className="text-[0.7rem] text-[var(--muted)]">
            Auto-advancement enabled based on rolling 30-day coupon settlement volume.
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricGrid
        items={[
          {
            label: "Total Minted Coupons",
            value: `${totalCouponsCount} Units`,
            detail: `${activeCouponsCount} ready for retail sale`,
          },
          {
            label: "Active Retail Inventory",
            value: `${activeCouponsCount} Codes`,
            detail: `${redeemedCouponsCount} redeemed by customers`,
          },
          {
            label: "Wholesale Capital Acquired",
            value: formatMinorUnits(totalAcquiredMinor, "NGN"),
            detail: `${totalSucceededCount} verified batch orders`,
          },
          {
            label: "Distributor Desk",
            value: profile?.whatsapp || profile?.phone || "Pending Update",
            detail: kycStatus === "APPROVED" ? "Tier 1 Active" : "Pending Verification",
          },
        ]}
      />

      {/* Section 1: Minted Retail Coupons Table (Interactive with Search, Copy & Filters) */}
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)]">Minted Coupon Codes (Retail Inventory)</h2>
          <p className="text-xs text-[var(--muted)]">
            Copy individual codes or use &quot;Copy Active&quot; to copy all unredeemed coupons for distribution to your WhatsApp buyers.
          </p>
        </div>
        <CouponInventoryTable coupons={serializedCoupons} />
      </div>

      {/* Section 2: Wholesale Payment Batches History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Wholesale Purchase Batches</h2>
            <p className="text-xs text-[var(--muted)]">
              Historical ledger record of all wholesale coupon orders acquired via Paystack.
            </p>
          </div>
          <Link
            href="/vendor/history"
            className="text-xs font-bold text-[var(--brand)] hover:underline"
          >
            View Full Payment Ledger →
          </Link>
        </div>

        <DataTable columns={["Batch Code / Reference", "Face Value", "Status", "Package Allocation", "Date of Purchase"]}>
          {succeededPayments.map((payment) => (
            <tr key={payment.id} className="hover:bg-[var(--surface-muted)]/50 transition">
              <td className="px-5 py-4 font-mono text-xs font-bold text-[var(--ink)]">
                {payment.reference}
              </td>
              <td className="px-5 py-4 font-semibold text-[var(--ink)]">
                {formatMinorUnits(payment.amountMinor, payment.currency)}
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 size={12} />
                  <span>Verified</span>
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-[var(--muted)]">
                Wholesale Coupon Batch
              </td>
              <td className="px-5 py-4 text-xs text-[var(--muted)]">
                {(payment.verifiedAt ?? payment.createdAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </DataTable>

        {succeededPayments.length === 0 && (
          <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
            <EmptyState
              title="No coupon batches purchased yet"
              description="Provider-verified batches will appear here once your wholesale acquisition completes. Select your coupon packages to start distributing."
            />
            <div className="pb-8 text-center">
              <Link
                href="/vendor/acquire"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
              >
                <Plus size={14} />
                <span>Acquire Your First Batch</span>
              </Link>
            </div>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalSucceededCount}
          pageSize={pageSize}
          baseUrl="/vendor/dashboard"
        />
      </div>
    </section>
  );
}
