import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function PurchaseHistoryPage() { const principal = await requireRole(["VENDOR"]); const payments = await getPrisma().paymentIntent.findMany({ where: { organizationId: principal.organizationId }, orderBy: { createdAt: "desc" }, take: 100 }); return <section><PageHeader eyebrow="Inventory payments" title="Purchase history"/><DataTable columns={["Reference", "Amount", "Status", "Date"]}>{payments.map((payment) => <tr key={payment.id}><td className="px-5 py-4 font-mono text-xs">{payment.reference}</td><td className="px-5 py-4 font-semibold">{formatMinorUnits(payment.amountMinor, payment.currency)}</td><td className="px-5 py-4">{payment.status}</td><td className="px-5 py-4">{payment.createdAt.toLocaleDateString("en-NG")}</td></tr>)}</DataTable>{!payments.length && <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white"><EmptyState title="No purchase history" description="Verified provider transactions will appear here."/></div>}</section>; }
