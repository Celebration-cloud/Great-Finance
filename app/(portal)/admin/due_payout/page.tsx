import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function DuePayoutPage() { await requireRole(["REVIEWER", "ADMIN", "SUPER_ADMIN"]); const payouts = await getPrisma().approvalRequest.findMany({ where: { resourceType: "withdrawal", status: "PENDING" }, orderBy: { createdAt: "asc" }, take: 100 }); return <section><PageHeader eyebrow="Payout control" title="Due payouts"/><DataTable columns={["Request", "Resource", "Requested by", "Action"]}>{payouts.map((payout) => <tr key={payout.id}><td className="px-5 py-4 font-mono text-xs">{payout.id}</td><td className="px-5 py-4">{payout.resourceId}</td><td className="px-5 py-4 font-mono text-xs">{payout.requestedBy}</td><td className="px-5 py-4 text-sm font-bold">Credit after approval</td></tr>)}</DataTable>{!payouts.length && <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white"><EmptyState title="No payouts due" description="Approved withdrawal requests will enter this operational queue."/></div>}</section>; }
