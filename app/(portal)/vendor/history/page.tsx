import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { Pagination } from "@/components/portal/pagination";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function PurchaseHistoryPage({ searchParams }: Props) {
  const principal = await requireRole(["VENDOR"]);
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const db = getPrisma();

  const [totalCount, payments] = await Promise.all([
    db.paymentIntent.count({
      where: { organizationId: principal.organizationId },
    }),
    db.paymentIntent.findMany({
      where: { organizationId: principal.organizationId },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Inventory payments"
        title="Purchase history"
        description="Comprehensive ledger record of all wholesale coupon package acquisitions and payment intents."
      />

      <div className="space-y-2">
        <DataTable columns={["Reference", "Amount", "Status", "Date"]}>
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-[var(--surface-muted)]/50 transition">
              <td className="px-5 py-4 font-mono text-xs font-semibold text-[var(--ink)]">
                {payment.reference}
              </td>
              <td className="px-5 py-4 font-semibold text-[var(--ink)]">
                {formatMinorUnits(payment.amountMinor, payment.currency)}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    payment.status === "SUCCEEDED"
                      ? "bg-emerald-100 text-emerald-800"
                      : payment.status === "PENDING" || payment.status === "PROCESSING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status}
                </span>
              </td>
              <td className="px-5 py-4 text-xs text-[var(--muted)]">
                {payment.createdAt.toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
            </tr>
          ))}
        </DataTable>

        {!payments.length && (
          <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
            <EmptyState
              title="No purchase history"
              description="Verified provider transactions will appear here once wholesale orders are initiated."
            />
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          baseUrl="/vendor/history"
        />
      </div>
    </section>
  );
}
