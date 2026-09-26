import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function VerifyTokenPage() { await requireRole(["REVIEWER", "ADMIN", "SUPER_ADMIN"]); const payments = await getPrisma().paymentIntent.findMany({ where: { status: "PROCESSING" }, orderBy: { createdAt: "asc" }, take: 100 }); return <section><PageHeader eyebrow="Provider verification" title="Verify token purchase"/><DataTable columns={["Reference", "Vendor organization", "Deposit", "Action"]}>{payments.map((payment) => <tr key={payment.id}><td className="px-5 py-4 font-mono text-xs">{payment.reference}</td><td className="px-5 py-4 font-mono text-xs">{payment.organizationId}</td><td className="px-5 py-4 font-bold">{formatMinorUnits(payment.amountMinor, payment.currency)}</td><td className="px-5 py-4 text-sm text-[var(--muted)]">Provider verification pending</td></tr>)}</DataTable>{!payments.length && <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white"><EmptyState title="No token purchases to verify" description="Paystack reconciliation handles provider confirmation before ledger settlement."/></div>}</section>; }
