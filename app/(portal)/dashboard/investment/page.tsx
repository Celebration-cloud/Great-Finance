import Link from "next/link";
import {
  CalendarClock,
  ChartNoAxesCombined,
  Clock,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { CouponCodeForm } from "@/components/portal/coupon-code-form";
import { DataTable, EmptyState, MetricGrid, PageHeader } from "@/components/portal/page-header";
import { Pagination } from "@/components/portal/pagination";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function InvestmentPage({ searchParams }: Props) {
  const principal = await requireRole(["CUSTOMER"]);
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const db = getPrisma();

  const [
    totalCount,
    investments,
    activeCount,
    totalPrincipalSum,
    totalReturnSum,
  ] = await Promise.all([
    db.investment.count({
      where: { customerId: principal.userId },
    }),
    db.investment.findMany({
      where: { customerId: principal.userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.investment.count({
      where: { customerId: principal.userId, status: "ACTIVE" },
    }),
    db.investment.aggregate({
      where: { customerId: principal.userId, status: "ACTIVE" },
      _sum: { planAmount: true },
    }),
    db.investment.aggregate({
      where: { customerId: principal.userId, status: "ACTIVE" },
      _sum: { returnAmount: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const activePrincipal = totalPrincipalSum._sum.planAmount ?? 0;
  const expectedReturn = totalReturnSum._sum.returnAmount ?? 0;
  const projectedProfit = Math.max(0, expectedReturn - activePrincipal);

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Portfolio management"
        title="Active Investments"
        description="Redeem verified distributor coupon codes to activate high-yield structured plans, track maturity dates, and monitor yield accruals."
        action={
          <Link
            href="/dashboard/purchase"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--surface-muted)] transition"
          >
            <span>Buy coupons from vendors</span>
            <ExternalLink size={14} />
          </Link>
        }
      />

      {/* Metric Grid */}
      <MetricGrid
        items={[
          {
            label: "Active plans",
            value: activeCount.toString(),
            detail: `${totalCount} total lifetime`,
          },
          {
            label: "Active principal",
            value: `₦${activePrincipal.toLocaleString("en-NG")}`,
            detail: "Locked in running cycles",
          },
          {
            label: "Projected payout",
            value: `₦${expectedReturn.toLocaleString("en-NG")}`,
            detail: "At maturity cycle completion",
          },
          {
            label: "Net yield growth",
            value: `+₦${projectedProfit.toLocaleString("en-NG")}`,
            detail: activePrincipal > 0 ? `${Math.round((projectedProfit / activePrincipal) * 100)}% projected return` : "0%",
          },
        ]}
      />

      {/* Coupon Redemption Card */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--brand)]" />
          <h2 className="text-base font-bold text-[var(--ink)]">Redeem Coupon Code</h2>
        </div>
        <CouponCodeForm />
      </div>

      {/* Investments Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined size={18} className="text-[var(--brand)]" />
            <h2 className="text-base font-bold text-[var(--ink)]">Investment Ledger</h2>
          </div>
          <span className="text-xs text-[var(--muted)]">
            Showing {investments.length} of {totalCount} records
          </span>
        </div>

        <DataTable columns={["Plan", "Principal", "Expected Return", "Maturity", "Status"]}>
          {investments.map((inv) => {
            const now = new Date();
            const matureDate = new Date(inv.matureAt);
            const diffMs = matureDate.getTime() - now.getTime();
            const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
            const isMatured = daysRemaining === 0 || inv.status === "MATURED";

            return (
              <tr key={inv.id} className="hover:bg-[var(--surface-muted)]/50 transition">
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--ink)]">{inv.planName} Plan</span>
                    <span className="text-xs text-[var(--muted)]">{inv.durationDays} days lockup</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-[var(--ink)]">
                  ₦{inv.planAmount.toLocaleString("en-NG")}
                </td>
                <td className="px-5 py-4 font-bold text-emerald-600">
                  ₦{inv.returnAmount.toLocaleString("en-NG")}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-[var(--ink)]">
                      {matureDate.toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-[0.7rem] text-[var(--muted)]">
                      {isMatured ? "Matured" : `${daysRemaining} days left`}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      inv.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-800"
                        : inv.status === "MATURED"
                          ? "bg-purple-100 text-purple-800"
                          : inv.status === "SETTLED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </DataTable>

        {!investments.length && (
          <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
            <EmptyState
              title="No active investments"
              description="Redeem a coupon code above or reach out to an authorized vendor to acquire your coupon."
            />
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          baseUrl="/dashboard/investment"
        />
      </div>
    </section>
  );
}
