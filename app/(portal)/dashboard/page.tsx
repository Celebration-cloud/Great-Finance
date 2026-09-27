import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Clock,
  Layers,
  Receipt,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { CouponCodeForm } from "@/components/portal/coupon-code-form";
import { DataTable, EmptyState, MetricGrid, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const principal = await requireRole(["CUSTOMER"]);
  const db = getPrisma();

  const [
    profile,
    activeInvestmentsCount,
    activeInvestmentsSum,
    recentInvestments,
    recentPayments,
  ] = await Promise.all([
    db.profile.findUnique({
      where: { authUserId: principal.userId },
      select: { displayName: true, referralCode: true },
    }),
    db.investment.count({
      where: { customerId: principal.userId, status: "ACTIVE" },
    }),
    db.investment.aggregate({
      where: { customerId: principal.userId, status: "ACTIVE" },
      _sum: { planAmount: true, returnAmount: true },
    }),
    db.investment.findMany({
      where: { customerId: principal.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.paymentIntent.findMany({
      where: { organizationId: principal.organizationId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const referralsCount = profile?.referralCode
    ? await db.profile.count({ where: { referredByCode: profile.referralCode } })
    : 0;

  const totalActivePrincipal = activeInvestmentsSum._sum.planAmount ?? 0;
  const totalProjectedReturn = activeInvestmentsSum._sum.returnAmount ?? 0;
  const projectedProfit = Math.max(0, totalProjectedReturn - totalActivePrincipal);

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Customer Workspace"
        title={profile?.displayName ? `Welcome back, ${profile.displayName}` : "Your Financial Workspace"}
        description="Monitor active investment cycles, redeem distributor coupon codes, and track capital growth backed by institutional ledger records."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/purchase"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
            >
              <span>Buy Coupon from Vendor</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        }
      />

      {/* Primary Financial Metric Grid */}
      <MetricGrid
        items={[
          {
            label: "Active investments",
            value: activeInvestmentsCount.toString(),
            detail: `${recentInvestments.length} lifetime orders`,
          },
          {
            label: "Locked capital",
            value: `₦${totalActivePrincipal.toLocaleString("en-NG")}`,
            detail: "Earning structured yield",
          },
          {
            label: "Projected payout",
            value: `₦${totalProjectedReturn.toLocaleString("en-NG")}`,
            detail: `+₦${projectedProfit.toLocaleString("en-NG")} expected ROI`,
          },
          {
            label: "Network referrals",
            value: referralsCount.toString(),
            detail: profile?.referralCode ? `Code: ${profile.referralCode}` : "Standard tier",
          },
        ]}
      />

      {/* Quick Redeem Widget */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[var(--brand)]" />
            <h2 className="text-base font-bold text-[var(--ink)]">Quick Coupon Redemption</h2>
          </div>
          <Link
            href="/dashboard/investment"
            className="text-xs font-bold text-[var(--brand)] hover:underline"
          >
            View full portfolio →
          </Link>
        </div>
        <CouponCodeForm />
      </div>

      {/* Recent Active Investments Card */}
      <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined size={18} className="text-[var(--brand)]" />
            <h3 className="font-bold text-[var(--ink)]">Recent Investments</h3>
          </div>
          <Link
            href="/dashboard/investment"
            className="text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition"
          >
            See all
          </Link>
        </div>

        {recentInvestments.length > 0 ? (
          <ul className="divide-y divide-[var(--line)]">
            {recentInvestments.map((inv) => {
              const matureDate = new Date(inv.matureAt);
              const daysLeft = Math.max(0, Math.ceil((matureDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              return (
                <li
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--surface-muted)]/50 transition"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-[var(--ink)]">{inv.planName} Plan</p>
                    <p className="text-xs text-[var(--muted)]">
                      Invested: ₦{inv.planAmount.toLocaleString("en-NG")} • Expected:{" "}
                      <span className="font-semibold text-emerald-600">
                        ₦{inv.returnAmount.toLocaleString("en-NG")}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[var(--ink)] block">
                        {matureDate.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-[0.7rem] text-[var(--muted)]">
                        {daysLeft === 0 ? "Matured" : `${daysLeft}d left`}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        inv.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <EmptyState
              title="No active investments yet"
              description="Enter your 16-character coupon code above or reach out to a verified vendor."
            />
          </div>
        )}
      </div>

      {/* Recent Payments Section */}
      {recentPayments.length > 0 && (
        <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[var(--line)] px-5 py-4">
            <h3 className="font-bold text-[var(--ink)]">Payment History</h3>
          </div>
          <ul className="divide-y divide-[var(--line)]">
            {recentPayments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="font-mono text-xs font-semibold text-[var(--ink)]">{p.reference}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {p.createdAt.toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs">
                    {formatMinorUnits(p.amountMinor, p.currency)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.7rem] font-bold ${
                      p.status === "SUCCEEDED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
