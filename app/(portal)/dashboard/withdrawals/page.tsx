import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarClock,
  CheckCircle2,
  Clock,
  Landmark,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { MaturityProgress } from "@/components/portal/maturity-progress";
import { WithdrawalRequestForm } from "@/components/portal/withdrawal-request-form";
import { AnimatedContent } from "@/components/ui/animated-content";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function WithdrawalsPage() {
  const principal = await requireRole(["CUSTOMER"]);
  const db = getPrisma();

  const investments = await db.investment.findMany({
    where: {
      customerId: principal.userId,
      status: { in: ["ACTIVE", "MATURED", "SETTLED"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      withdrawals: {
        where: { status: { in: ["PENDING", "APPROVED", "PROCESSING", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const now = new Date();

  const processed = investments.map((inv) => {
    const matureAt = new Date(inv.matureAt);
    const isMatured = now >= matureAt || inv.status === "MATURED" || inv.status === "SETTLED";
    const daysLeft = Math.max(
      0,
      Math.ceil((matureAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );
    const hoursLeft = Math.max(
      0,
      Math.ceil((matureAt.getTime() - now.getTime()) / (1000 * 60 * 60))
    );
    const latestWithdrawal = inv.withdrawals[0] ?? null;
    const hasActivePending = !!latestWithdrawal && latestWithdrawal.status !== "COMPLETED";
    const isFullySettled = inv.status === "SETTLED";
    const progressPct = Math.min(
      100,
      Math.max(2, ((inv.durationDays - daysLeft) / inv.durationDays) * 100)
    );
    return { ...inv, matureAt, isMatured, daysLeft, hoursLeft, latestWithdrawal, hasActivePending, isFullySettled, progressPct };
  });

  const maturingCount  = processed.filter((i) => i.isMatured && !i.isFullySettled).length;
  const pendingCount   = processed.filter((i) => i.hasActivePending).length;
  const completedCount = processed.filter((i) => i.isFullySettled).length;
  const activeCount    = processed.filter((i) => !i.isMatured).length;

  const statusColor: Record<string, string> = {
    ACTIVE:  "bg-[var(--info-soft)] text-[var(--info-ink)] border-[var(--info-line)]",
    MATURED: "bg-[var(--success-soft)] text-[var(--success-ink)] border-[var(--success-line)]",
    SETTLED: "bg-[var(--surface-muted)] text-[var(--muted)] border-[var(--line)]",
  };

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Payout Portal"
        title="Withdrawals & Payouts"
        description="Track your investment maturity dates and request direct bank transfers when plans complete."
        action={
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] transition"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </Link>
        }
      />

      {/* ─── How it works (always visible) ─── */}
      <div className="rounded-2xl bg-gradient-to-br from-[var(--brand)]/5 via-[var(--surface)] to-emerald-950/20 p-6">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--brand)]" />
          <h2 className="font-bold text-[var(--ink)]">How your payout works</h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              icon: CalendarClock,
              color: "bg-blue-100 text-blue-700",
              title: "Wait for maturity",
              body: "Your plan has a fixed duration. The withdraw button unlocks automatically on your maturity date — no action needed from you.",
            },
            {
              n: "2",
              icon: Landmark,
              color: "bg-amber-100 text-amber-700",
              title: "Enter bank details",
              body: "Provide your 10-digit NUBAN, bank name, and account name. All Nigerian banks supported — Access, GTBank, Opay, Palmpay, etc.",
            },
            {
              n: "3",
              icon: ShieldCheck,
              color: "bg-emerald-100 text-emerald-700",
              title: "Admin approves transfer",
              body: "Our settlement desk reviews and processes your payout within 1–3 business days. Funds arrive directly in your account.",
            },
          ].map((step) => (
            <li key={step.n} className="flex gap-3">
              <div className={`flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${step.color}`}>
                {step.n}
              </div>
              <div>
                <p className="font-bold text-sm text-[var(--ink)] mb-1">{step.title}</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-[var(--line)] pt-4">
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>₦0 withdrawal fee</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Direct bank transfer</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>All CBN-licensed banks</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <CheckCircle2 size={13} className="text-emerald-600" />
            <span>Ledger-backed security</span>
          </div>
        </div>
      </div>

      {/* ─── Status summary badges ─── */}
      {processed.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {maturingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
              <TrendingUp size={12} />
              {maturingCount} plan{maturingCount !== 1 ? "s" : ""} ready to withdraw
            </span>
          )}
          {activeCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-800">
              <Clock size={12} />
              {activeCount} maturing soon
            </span>
          )}
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
              <Clock size={12} />
              {pendingCount} request{pendingCount !== 1 ? "s" : ""} under review
            </span>
          )}
          {completedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
              <CheckCircle2 size={12} />
              {completedCount} paid out
            </span>
          )}
        </div>
      )}

      {/* ─── No plans at all ─── */}
      {processed.length === 0 && (
        <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[var(--brand)]/10">
              <Banknote size={28} className="text-[var(--brand)]" />
            </div>
            <h3 className="font-bold text-[var(--ink)] mb-2">No active investment plans yet</h3>
            <p className="text-sm text-[var(--muted)] max-w-sm mx-auto mb-6">
              Once you redeem a coupon and activate a plan, it will appear here with your maturity date and expected return. Withdrawals open automatically when your plan completes.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--brand-dark)] transition"
            >
              Redeem a coupon
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* ─── Per-plan cards ─── */}
      {processed.length > 0 && (
        <div className="space-y-5">
          <h3 className="font-bold text-[var(--ink)]">Your investment plans</h3>

          {processed.map((inv, index) => {
            const maturityLabel = inv.matureAt.toLocaleDateString("en-NG", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            const createdLabel = inv.createdAt.toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            const profit = inv.returnAmount - inv.planAmount;

            return (
              <AnimatedContent
                key={inv.id}
                delay={Math.min(index * 0.06, 0.24)}
                distance={18}
              >
              <article
                className={`rounded-2xl border-2 bg-white shadow-sm overflow-hidden transition ${
                  inv.isMatured && !inv.isFullySettled
                    ? "border-emerald-300 shadow-emerald-100"
                    : "border-[var(--line)]"
                }`}
              >
                {/* Ready banner */}
                {inv.isMatured && !inv.isFullySettled && !inv.hasActivePending && (
                  <div className="flex items-center gap-2 bg-emerald-600 px-5 py-2.5 text-white">
                    <TrendingUp size={15} />
                    <span className="text-sm font-bold">Plan matured. Your payout is ready.</span>
                  </div>
                )}

                {inv.hasActivePending && (
                  <div className="flex items-center gap-2 bg-amber-500 px-5 py-2.5 text-white">
                    <Clock size={15} />
                    <span className="text-sm font-bold">Withdrawal request submitted and under review</span>
                  </div>
                )}

                {inv.isFullySettled && (
                  <div className="flex items-center gap-2 bg-slate-600 px-5 py-2.5 text-white">
                    <CheckCircle2 size={15} />
                    <span className="text-sm font-bold">Payout complete. Funds were sent to your bank.</span>
                  </div>
                )}

                {/* Plan header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-muted)]/40 px-5 py-4">
                  <div>
                    <h4 className="text-base font-extrabold text-[var(--ink)] tracking-tight">
                      {inv.planName.toUpperCase()} PLAN
                    </h4>
                    <p className="text-xs text-[var(--muted)]">Activated {createdLabel}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColor[inv.status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
                    {inv.status}
                  </span>
                </div>

                {/* Financial grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[var(--line)] border-b border-[var(--line)]">
                  {[
                    { label: "You invested",      value: `₦${inv.planAmount.toLocaleString("en-NG")}`,  highlight: false },
                    { label: "You will receive",  value: `₦${inv.returnAmount.toLocaleString("en-NG")}`, highlight: true  },
                    { label: "Your profit",       value: `+₦${profit.toLocaleString("en-NG")}`,          highlight: true  },
                    { label: "Plan duration",     value: `${inv.durationDays} day${inv.durationDays !== 1 ? "s" : ""}`, highlight: false },
                  ].map((item) => (
                    <div key={item.label} className="px-4 py-3 text-center">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--muted)]">{item.label}</p>
                      <p className={`mt-0.5 text-sm font-bold ${item.highlight ? "text-emerald-700" : "text-[var(--ink)]"}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Maturity date row */}
                <div className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b ${
                  inv.isMatured
                    ? "border-[var(--success-line)] bg-[var(--success-soft)]"
                    : "border-[var(--info-line)] bg-[var(--info-soft)]"
                }`}>
                  <div className="flex items-center gap-2">
                    <CalendarClock size={15} className={inv.isMatured ? "text-emerald-600" : "text-blue-600"} />
                    <div>
                      <span className="text-xs font-semibold text-[var(--muted)]">
                        {inv.isMatured ? "Matured on" : "Matures on"}:{" "}
                      </span>
                      <span className={`text-sm font-bold ${inv.isMatured ? "text-emerald-800" : "text-blue-800"}`}>
                        {maturityLabel}
                      </span>
                    </div>
                  </div>
                  {!inv.isMatured && (
                    <span className="rounded-full border border-[var(--info-line)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--info-ink)]">
                      {inv.daysLeft === 0
                        ? `${inv.hoursLeft}h remaining`
                        : `${inv.daysLeft} day${inv.daysLeft !== 1 ? "s" : ""} remaining`}
                    </span>
                  )}
                  {inv.isMatured && !inv.isFullySettled && (
                    <span className="rounded-full border border-[var(--success-line)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--success-ink)]">
                      Ready to withdraw
                    </span>
                  )}
                </div>

                {/* Progress bar — only for active plans */}
                {!inv.isMatured && (
                  <MaturityProgress
                    progress={inv.progressPct}
                    unlockLabel={inv.matureAt.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                  />
                )}

                {/* Settled payout record */}
                {inv.isFullySettled && inv.latestWithdrawal && (
                  <div className="px-5 py-4 bg-slate-50">
                    <div className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 px-4 py-3">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-sm font-bold text-[var(--ink)]">₦{inv.returnAmount.toLocaleString("en-NG")} paid out</p>
                        <p className="text-xs text-[var(--muted)]">
                          Transferred to {inv.latestWithdrawal.bankName} ···{inv.latestWithdrawal.accountNumber.slice(-4)} ({inv.latestWithdrawal.accountName})
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action area */}
                {!inv.isFullySettled && (
                  <div className="px-5 py-5 bg-white">
                    <WithdrawalRequestForm
                      investmentId={inv.id}
                      planName={inv.planName}
                      returnAmount={inv.returnAmount}
                      matureAt={inv.matureAt.toISOString()}
                      isMatured={inv.isMatured}
                      daysLeft={inv.daysLeft}
                      hasActivePending={inv.hasActivePending}
                    />
                  </div>
                )}
              </article>
              </AnimatedContent>
            );
          })}
        </div>
      )}

      {/* ─── Policy note ─── */}
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/40 px-5 py-4 text-xs text-[var(--muted)] leading-relaxed">
        <strong className="text-[var(--ink)]">Payout policy: </strong>
        Withdrawals are processed manually by the Great Finance settlement desk within 1–3 business days. Only one active request per plan is allowed. Funds are transferred directly to your bank — ensure all details are correct before submitting. For help, use the Contact page.
      </div>
    </section>
  );
}
