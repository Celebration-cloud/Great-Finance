import Link from "next/link";
import {
  ArrowRight,
  BanknoteArrowDown,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { CouponCodeForm } from "@/components/portal/coupon-code-form";
import { EmptyState, MetricGrid, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const principal = await requireRole(["CUSTOMER"]);
  const db = getPrisma();
  // This server-rendered snapshot keeps all maturity calculations consistent.
  // eslint-disable-next-line react-hooks/purity
  const renderTimestamp = Date.now();

  const [
    profile,
    activeInvestmentsCount,
    activeInvestmentsSum,
    recentInvestments,
    recentPayments,
    nextMaturingInv,
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
    // Next-maturing investment for payout tracker
    db.investment.findFirst({
      where: { customerId: principal.userId, status: { in: ["ACTIVE", "MATURED"] } },
      orderBy: { matureAt: "asc" },
      include: {
        withdrawals: {
          where: { status: { in: ["PENDING", "APPROVED", "PROCESSING"] } },
          take: 1,
        },
      },
    }),
  ]);

  const referralsCount = profile?.referralCode
    ? await db.profile.count({ where: { referredByCode: profile.referralCode } })
    : 0;

  const totalActivePrincipal = activeInvestmentsSum._sum.planAmount ?? 0;
  const totalProjectedReturn = activeInvestmentsSum._sum.returnAmount ?? 0;
  const projectedProfit = Math.max(0, totalProjectedReturn - totalActivePrincipal);

  // Payout card logic
  const now = new Date();
  const nextMatureAt = nextMaturingInv ? new Date(nextMaturingInv.matureAt) : null;
  const isNextMatured = nextMatureAt ? now >= nextMatureAt : false;
  const daysToMaturity = nextMatureAt
    ? Math.max(0, Math.ceil((nextMatureAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;
  const hasPendingWithdrawal = (nextMaturingInv?.withdrawals?.length ?? 0) > 0;
  const progressPct = nextMaturingInv
    ? Math.min(100, Math.max(2, ((nextMaturingInv.durationDays - daysToMaturity) / nextMaturingInv.durationDays) * 100))
    : 0;

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

      {/* Metric grid */}
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

      {/* ─── PAYOUT TRACKER CARD ─── */}
      {nextMaturingInv && (
        <div
          className={`relative overflow-hidden rounded-2xl border-2 shadow-sm ${
            isNextMatured
              ? "bg-gradient-to-br from-emerald-950/25 to-[var(--surface)]"
              : "bg-gradient-to-br from-[var(--brand)]/5 to-[var(--surface)]"
          }`}
        >
          {/* Glow accent */}
          <div
            className={`absolute top-0 right-0 h-32 w-32 rounded-full opacity-20 blur-3xl ${
              isNextMatured ? "bg-emerald-400" : "bg-[var(--brand)]"
            }`}
          />
          <div className="relative px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                    isNextMatured ? "bg-emerald-600" : "bg-[var(--brand)]"
                  } text-white shadow-sm`}
                >
                  <BanknoteArrowDown size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    {isNextMatured ? "🎉 Payout ready" : "Upcoming payout"}
                  </p>
                  <h2 className="text-base font-extrabold text-[var(--ink)]">
                    {nextMaturingInv.planName.toUpperCase()} PLAN
                  </h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[0.7rem] text-[var(--muted)]">You will receive</p>
                <p className="text-2xl font-extrabold text-emerald-700">
                  ₦{nextMaturingInv.returnAmount.toLocaleString("en-NG")}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  +₦{(nextMaturingInv.returnAmount - nextMaturingInv.planAmount).toLocaleString("en-NG")} profit
                </p>
              </div>
            </div>

            {/* Countdown / status */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <CalendarClock size={14} className={isNextMatured ? "text-emerald-600" : "text-[var(--brand)]"} />
                <span className="text-sm font-semibold text-[var(--ink)]">
                  {isNextMatured
                    ? "Matured — withdraw now!"
                    : `Matures on ${nextMatureAt!.toLocaleDateString("en-NG", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`}
                </span>
                {!isNextMatured && (
                  <span className="ml-auto rounded-full bg-[var(--brand)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--brand)]">
                    {daysToMaturity}d left
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {!isNextMatured && (
                <div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-emerald-400 transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[0.7rem] text-[var(--muted)]">
                    {Math.round(progressPct)}% of {nextMaturingInv.durationDays}-day plan complete
                  </p>
                </div>
              )}

              {/* Status messages */}
              {hasPendingWithdrawal ? (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 font-semibold">
                  <Clock size={13} />
                  Withdrawal request submitted — admin reviewing your payout
                </div>
              ) : isNextMatured ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 size={13} />
                  Your plan has matured. Visit Withdrawals to claim ₦{nextMaturingInv.returnAmount.toLocaleString("en-NG")}
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-800">
                  <Clock size={13} />
                  <span>Withdraw button unlocks automatically in <strong>{daysToMaturity} day{daysToMaturity !== 1 ? "s" : ""}</strong> — no action needed until then</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-4">
              <Link
                href="/dashboard/withdrawals"
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  isNextMatured
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                    : "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                <BanknoteArrowDown size={15} />
                {isNextMatured ? "Withdraw now →" : "View payout tracker"}
              </Link>
            </div>
          </div>
        </div>
      )}

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
              const daysLeft = Math.max(0, Math.ceil((matureDate.getTime() - renderTimestamp) / (1000 * 60 * 60 * 24)));
              const isMatured = renderTimestamp >= matureDate.getTime();
              return (
                <li
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--surface-muted)]/50 transition"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-[var(--ink)]">{inv.planName} Plan</p>
                    <p className="text-xs text-[var(--muted)]">
                      Invested: ₦{inv.planAmount.toLocaleString("en-NG")} • Return:{" "}
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
                        {isMatured ? (
                          <span className="font-bold text-emerald-600">Matured ✓</span>
                        ) : (
                          `${daysLeft}d left`
                        )}
                      </span>
                    </div>
                    {isMatured ? (
                      <Link
                        href="/dashboard/withdrawals"
                        className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Withdraw
                      </Link>
                    ) : (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          inv.status === "ACTIVE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    )}
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

      {/* Withdrawals CTA if no active plan */}
      {!nextMaturingInv && recentInvestments.length > 0 && (
        <Link
          href="/dashboard/withdrawals"
          className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-white px-5 py-4 shadow-sm hover:bg-[var(--surface-muted)]/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand)]/10">
              <BanknoteArrowDown size={18} className="text-[var(--brand)]" />
            </div>
            <div>
              <p className="font-bold text-[var(--ink)]">Withdrawals & Payouts</p>
              <p className="text-xs text-[var(--muted)]">View maturity dates and request bank transfers</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-[var(--muted)]" />
        </Link>
      )}
    </section>
  );
}
