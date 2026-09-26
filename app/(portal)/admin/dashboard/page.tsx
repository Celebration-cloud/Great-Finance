import { MetricGrid, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { formatMinorUnits } from "@/lib/utils";

export const dynamic = "force-dynamic";
export default async function AdminDashboardPage() { await requireRole(["ADMIN", "SUPER_ADMIN"]); const [users, cashIn, duePayouts, referrals] = await Promise.all([getPrisma().membership.count({ where: { role: "CUSTOMER", status: "ACTIVE" } }), getPrisma().paymentIntent.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amountMinor: true } }), getPrisma().approvalRequest.count({ where: { resourceType: "withdrawal", status: "PENDING" } }), getPrisma().profile.count({ where: { referredByCode: { not: null } } })]); return <section><PageHeader eyebrow="Administration" title="Welcome to Admin" description="Figures below come from current server records; unavailable legacy metrics are not simulated."/><MetricGrid items={[{ label: "Total number of users", value: users }, { label: "Total cash inflow", value: formatMinorUnits(cashIn._sum.amountMinor ?? 0n, "NGN") }, { label: "Total cash outflow", value: "No payout ledger" }, { label: "Due payout", value: duePayouts }, { label: "Number of referrals", value: referrals }]}/></section>; }
