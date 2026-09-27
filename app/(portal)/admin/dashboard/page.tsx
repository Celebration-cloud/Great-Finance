import Link from "next/link";
import {
  ArrowRight,
  BadgeAlert,
  BadgeCheck,
  ShieldAlert,
  Store,
  UsersRound,
} from "lucide-react";
import { DataTable, EmptyState, MetricGrid, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const db = getPrisma();

  const [
    totalCustomers,
    totalVendors,
    pendingKycs,
    pendingApprovals,
    cashIn,
    succeededPaymentsCount,
    totalLedgerTx,
    totalReferrals,
    recentPayments,
  ] = await Promise.all([
    db.membership.count({ where: { role: "CUSTOMER" } }),
    db.membership.count({ where: { role: "VENDOR" } }),
    db.approvalRequest.count({ where: { resourceType: "vendor-kyc", status: "PENDING" } }),
    db.approvalRequest.count({ where: { status: "PENDING" } }),
    db.paymentIntent.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amountMinor: true } }),
    db.paymentIntent.count({ where: { status: "SUCCEEDED" } }),
    db.ledgerTransaction.count(),
    db.profile.count({ where: { referredByCode: { not: null } } }),
    db.paymentIntent.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const totalInflowMinor = cashIn._sum.amountMinor ?? BigInt(0);

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Executive Administration"
        title="Admin Control Center"
        description="Comprehensive real-time overview of user registrations, distributor network liquidity, pending compliance reviews, and double-entry ledger transactions."
        action={
          pendingKycs > 0 ? (
            <Link
              href="/admin/vendor_verification"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition"
            >
              <BadgeAlert size={16} />
              <span>{pendingKycs} KYC Reviews Pending</span>
            </Link>
          ) : undefined
        }
      />

      {/* Priority Action Alert Banner */}
      {pendingKycs > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-amber-200 text-amber-900">
                <ShieldAlert size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {pendingKycs} Vendor KYC {pendingKycs === 1 ? "Verification" : "Verifications"} Pending Review
                </p>
                <p className="text-xs text-amber-800">
                  Regional distributors cannot acquire wholesale coupon packages until KYC documents are reviewed.
                </p>
              </div>
            </div>
            <Link
              href="/admin/vendor_verification"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-800 px-4 py-2 text-xs font-bold text-white hover:bg-amber-900 transition whitespace-nowrap"
            >
              <span>Review Identity Queue</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Core Operational Metrics */}
      <MetricGrid
        items={[
          {
            label: "Total Registered Customers",
            value: totalCustomers.toLocaleString(),
          },
          {
            label: "Authorized Vendors",
            value: totalVendors.toLocaleString(),
          },
          {
            label: "Total Verified Inflow",
            value: formatMinorUnits(totalInflowMinor, "NGN"),
          },
          {
            label: "Succeeded Inflow Transactions",
            value: `${succeededPaymentsCount} Orders`,
          },
          {
            label: "Pending KYC Submissions",
            value: (
              <span className={pendingKycs > 0 ? "font-bold text-amber-600" : ""}>
                {pendingKycs} Pending
              </span>
            ),
          },
          {
            label: "Double-Entry Ledger Records",
            value: `${totalLedgerTx} Postings`,
          },
          {
            label: "Total Referral Connections",
            value: totalReferrals.toLocaleString(),
          },
          {
            label: "Total Pending Approvals",
            value: `${pendingApprovals} Items`,
          },
        ]}
      />

      {/* Administration Shortcuts Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/vendor_verification"
          className="card p-5 hover:border-[var(--brand)] transition group"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-800">
              <BadgeCheck size={20} />
            </span>
            <span className="text-xs font-bold text-[var(--brand)] group-hover:underline">Queue →</span>
          </div>
          <h3 className="mt-4 font-bold text-[var(--ink)]">Vendor KYC Verification</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Inline preview and 1-click approvals for distributor IDs and selfies.</p>
        </Link>

        <Link
          href="/admin/users"
          className="card p-5 hover:border-[var(--brand)] transition group"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-800">
              <UsersRound size={20} />
            </span>
            <span className="text-xs font-bold text-[var(--brand)] group-hover:underline">Directory →</span>
          </div>
          <h3 className="mt-4 font-bold text-[var(--ink)]">User Governance & Bans</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Inspect customer directory, linked bank accounts, and immediate suspension controls.</p>
        </Link>

        <Link
          href="/admin/vendors"
          className="card p-5 hover:border-[var(--brand)] transition group"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl bg-purple-100 text-purple-800">
              <Store size={20} />
            </span>
            <span className="text-xs font-bold text-[var(--brand)] group-hover:underline">Directory →</span>
          </div>
          <h3 className="mt-4 font-bold text-[var(--ink)]">Vendor Partner Management</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Monitor authorized distributors, verify WhatsApp dispatch lines, and manage bans.</p>
        </Link>
      </div>

      {/* Recent Collections Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Recent Payment Inflow Events</h2>
            <p className="text-xs text-[var(--muted)]">Live transactions recorded and verified via Paystack webhooks.</p>
          </div>
          <Link href="/admin/verify_token" className="text-xs font-bold text-[var(--brand)] hover:underline">
            Inspect All Transactions →
          </Link>
        </div>

        <DataTable columns={["Reference", "Customer Email", "Amount", "Status", "Date"]}>
          {recentPayments.map((p) => (
            <tr key={p.id} className="hover:bg-[var(--surface-muted)]/50 transition">
              <td className="px-5 py-4 font-mono text-xs font-bold text-[var(--ink)]">
                {p.reference}
              </td>
              <td className="px-5 py-4 text-xs font-semibold text-[var(--ink)]">
                {p.customerEmail}
              </td>
              <td className="px-5 py-4 font-semibold text-[var(--ink)]">
                {formatMinorUnits(p.amountMinor, p.currency)}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    p.status === "SUCCEEDED"
                      ? "bg-emerald-100 text-emerald-800"
                      : p.status === "PENDING" || p.status === "PROCESSING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {p.status}
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-[var(--muted)]">
                {p.createdAt.toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </DataTable>

        {!recentPayments.length && (
          <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
            <EmptyState
              title="No recent payment events"
              description="Provider-verified transactions will appear here."
            />
          </div>
        )}
      </div>
    </section>
  );
}
