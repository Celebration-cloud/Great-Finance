import { assertPermission } from "@/lib/auth/permissions";
import { requirePrincipal } from "@/lib/auth/principal";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const principal = await requirePrincipal();
  assertPermission(principal.role, "approval:review");
  const approvals = await getPrisma().approvalRequest.findMany({ where: { organizationId: principal.organizationId, status: "PENDING" }, orderBy: { createdAt: "asc" }, take: 50 });
  return <section><p className="eyebrow">Maker-checker control</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.035em]">Pending approvals</h1><div className="card mt-8 overflow-hidden">{approvals.length ? <ul className="divide-y divide-[var(--line)]">{approvals.map((approval) => <li className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto]" key={approval.id}><div><p className="font-bold">{approval.action}</p><p className="text-sm text-[var(--muted)]">{approval.resourceType} · {approval.resourceId}</p></div><time className="text-sm text-[var(--muted)]">{approval.createdAt.toLocaleDateString("en-NG")}</time></li>)}</ul> : <div className="p-8 text-center"><p className="font-bold">Approval queue is clear</p><p className="mt-2 text-sm text-[var(--muted)]">Sensitive requests awaiting independent review appear here.</p></div>}</div></section>;
}
