import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";
import { VerifyPaymentButton } from "@/components/admin/verify-payment-button";
import { Clock, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VerifyTokenPage() {
  await requireRole(["REVIEWER", "ADMIN", "SUPER_ADMIN"]);
  const db = getPrisma();

  const payments = await db.paymentIntent.findMany({
    where: { status: "PROCESSING" },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  // Calculate time since creation
  function timeSince(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Provider Verification"
        title="Manual Token Purchase Verification"
        description="Payments stuck in PROCESSING state — where Paystack's webhook has not fired or reconciliation has not settled automatically. Verify only after confirming clearance in your Paystack dashboard."
      />

      {/* Summary Banner */}
      {payments.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">
              {payments.length} payment{payments.length !== 1 ? "s" : ""} pending manual review
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              These payments are in PROCESSING state. Only manually verify after confirming the funds
              have cleared in your Paystack dashboard. Each verification is permanently audited.
            </p>
          </div>
        </div>
      )}

      <DataTable
        columns={["Reference", "Organization", "Amount", "Initiated", "Action"]}
      >
        {payments.map((payment) => {
          const formatted = formatMinorUnits(payment.amountMinor, payment.currency);
          const ageMs = Date.now() - payment.createdAt.getTime();
          const isOld = ageMs > 3 * 60 * 60 * 1000; // older than 3 hours

          return (
            <tr key={payment.id}>
              <td className="px-5 py-4">
                <div className="space-y-0.5">
                  <p className="font-mono text-xs font-bold text-[var(--ink)]">{payment.reference}</p>
                  <p className="font-mono text-[0.67rem] text-[var(--muted)]">ID: {payment.id.slice(0, 12)}…</p>
                </div>
              </td>
              <td className="px-5 py-4">
                <p className="font-mono text-xs text-[var(--ink)]">{payment.organizationId.slice(0, 14)}…</p>
              </td>
              <td className="px-5 py-4">
                <p className="font-bold text-sm text-[var(--ink)]">{formatted}</p>
                <p className="text-[0.68rem] text-[var(--muted)] uppercase">{payment.currency}</p>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <Clock
                    size={12}
                    className={isOld ? "text-amber-500" : "text-[var(--muted)]"}
                  />
                  <div>
                    <p className={`text-xs font-bold ${isOld ? "text-amber-700" : "text-[var(--ink)]"}`}>
                      {timeSince(payment.createdAt)}
                    </p>
                    <p className="text-[0.67rem] text-[var(--muted)]">
                      {payment.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <VerifyPaymentButton
                  payment={{
                    id: payment.id,
                    reference: payment.reference,
                    organizationId: payment.organizationId,
                    amountMinor: payment.amountMinor,
                    currency: payment.currency,
                    status: payment.status,
                    createdAt: payment.createdAt,
                  }}
                  formatted={formatted}
                />
              </td>
            </tr>
          );
        })}
      </DataTable>

      {!payments.length && (
        <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
          <EmptyState
            title="No pending verifications"
            description="All token purchases have been reconciled automatically via Paystack webhooks. No manual action required."
          />
        </div>
      )}
    </section>
  );
}
