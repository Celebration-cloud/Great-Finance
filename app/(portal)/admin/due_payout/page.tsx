import { Banknote, Clock } from "lucide-react";
import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Serialise BigInt before sending to client
function toNGN(minor: bigint): string {
  return (Number(minor) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 });
}

export default async function DuePayoutPage() {
  await requireRole(["REVIEWER", "ADMIN", "SUPER_ADMIN"]);
  const db = getPrisma();

  const [pending, recent] = await Promise.all([
    db.withdrawalRequest.findMany({
      where:   { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      take:    100,
      include: { investment: { select: { planName: true, returnAmount: true, matureAt: true, couponId: true } } },
    }),
    db.withdrawalRequest.findMany({
      where:   { status: { in: ["APPROVED", "COMPLETED", "REJECTED"] } },
      orderBy: { updatedAt: "desc" },
      take:    25,
      include: { investment: { select: { planName: true } } },
    }),
  ]);

  const statusColor: Record<string, string> = {
    PENDING:    "bg-amber-100 text-amber-800",
    APPROVED:   "bg-emerald-100 text-emerald-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED:  "bg-slate-100 text-slate-700",
    REJECTED:   "bg-red-100 text-red-800",
  };

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Settlement desk"
        title="Withdrawal queue"
        description="Review pending customer payout requests. Approving a request marks the investment as SETTLED and notifies the settlement desk to transfer funds."
      />

      {/* Pending queue */}
      <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[var(--line)] px-5 py-4">
          <Clock size={18} className="text-amber-600" />
          <h2 className="font-bold text-[var(--ink)]">Pending requests</h2>
          {pending.length > 0 && (
            <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              {pending.length}
            </span>
          )}
        </div>

        {pending.length === 0 ? (
          <EmptyState title="No pending requests" description="All withdrawal requests have been processed." />
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {pending.map((wr) => (
              <div key={wr.id} className="px-5 py-5 space-y-3">
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[var(--ink)]">
                      {wr.investment.planName.toUpperCase()} PLAN
                    </p>
                    <p className="font-mono text-[0.7rem] text-[var(--muted)]">ID: {wr.id}</p>
                    <p className="text-[0.7rem] text-[var(--muted)]">
                      Customer: <span className="font-mono">{wr.customerId}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-emerald-700">₦{toNGN(wr.amountMinor)}</p>
                    <p className="text-xs text-[var(--muted)]">
                      Matured: {new Date(wr.investment.matureAt).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                </div>

                {/* Bank details */}
                <div className="rounded-xl border border-[var(--line)] bg-slate-50 px-4 py-3 grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-[var(--muted)] font-semibold uppercase tracking-wide mb-0.5">Bank</p>
                    <p className="font-bold text-[var(--ink)]">{wr.bankName}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)] font-semibold uppercase tracking-wide mb-0.5">Account No.</p>
                    <p className="font-mono font-bold text-[var(--ink)]">{wr.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-[var(--muted)] font-semibold uppercase tracking-wide mb-0.5">Account Name</p>
                    <p className="font-bold text-[var(--ink)]">{wr.accountName}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-[0.7rem] text-[var(--muted)]">
                  Requested {new Date(wr.createdAt).toLocaleString("en-NG")}
                </p>

                {/* Review form — client component */}
                {/* We use a simple form+action to avoid extra bundle on server */}
                <WithdrawalReviewInline requestId={wr.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent history */}
      {recent.length > 0 && (
        <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[var(--line)] px-5 py-4">
            <Banknote size={18} className="text-[var(--brand)]" />
            <h2 className="font-bold text-[var(--ink)]">Recent history</h2>
          </div>
          <ul className="divide-y divide-[var(--line)]">
            {recent.map((wr) => (
              <li key={wr.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div>
                  <p className="text-sm font-bold text-[var(--ink)]">
                    {wr.investment.planName.toUpperCase()} — ₦{toNGN(wr.amountMinor)}
                  </p>
                  <p className="font-mono text-[0.7rem] text-[var(--muted)]">{wr.customerId}</p>
                  <p className="text-[0.7rem] text-[var(--muted)]">
                    {new Date(wr.updatedAt).toLocaleDateString("en-NG")}
                    {wr.note ? ` • Note: ${wr.note}` : ""}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColor[wr.status] ?? "bg-slate-100 text-slate-700"}`}>
                  {wr.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

// Inline thin wrapper to keep the page a server component
import { WithdrawalReviewInline } from "@/components/portal/withdrawal-review-inline";
