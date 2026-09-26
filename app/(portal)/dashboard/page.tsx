import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";
import { MetricGrid, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const principal = await requireRole(["CUSTOMER"]);
  const [payments, succeeded, referrals] = await Promise.all([getPrisma().paymentIntent.findMany({ where: { organizationId: principal.organizationId }, orderBy: { createdAt: "desc" }, take: 5 }), getPrisma().paymentIntent.aggregate({ where: { organizationId: principal.organizationId, status: "SUCCEEDED" }, _count: true, _sum: { amountMinor: true } }), getPrisma().profile.findUnique({ where: { authUserId: principal.userId } }).then((profile) => profile ? getPrisma().profile.count({ where: { referredByCode: profile.referralCode } }) : 0)]);
  return <section><PageHeader eyebrow="Dashboard" title="Your financial workspace" description="Only verified, organization-scoped records appear here."/><MetricGrid items={[{ label: "Number of current investments", value: succeeded._count }, { label: "Total balance", value: formatMinorUnits(succeeded._sum.amountMinor ?? 0n, "NGN") }, { label: "Realized profit", value: "Awaiting ledger classification" }, { label: "Unrealized profit", value: "—" }, { label: "Number of referrals", value: referrals }]}/><div className="card mt-8 overflow-hidden"><div className="border-b border-[var(--line)] px-5 py-4"><h2 className="font-bold">Recent payments</h2></div>{payments.length ? <ul className="divide-y divide-[var(--line)]">{payments.map((payment) => <li className="flex flex-wrap items-center gap-3 px-5 py-4" key={payment.id}><div><p className="font-bold">{payment.reference}</p><p className="text-sm text-[var(--muted)]">{payment.customerEmail}</p></div><span className="ml-auto rounded-full bg-black/5 px-3 py-1 text-xs font-bold">{payment.status}</span><span className="min-w-28 text-right font-bold">{formatMinorUnits(payment.amountMinor, payment.currency)}</span></li>)}</ul> : <div className="p-8 text-center"><p className="font-bold">No payments yet</p><p className="mt-2 text-sm text-[var(--muted)]">New payment attempts will appear after server-side initialization.</p></div>}</div></section>;
}
