import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";

export const dynamic = "force-dynamic";
export default async function WithdrawalsPage() { await requireRole(["CUSTOMER"]); return <section><PageHeader eyebrow="Payouts" title="Withdrawals" description="Withdrawal requests require balance validation and independent approval."/><div className="card mt-8"><div className="border-b border-[var(--line)] px-5 py-4 font-bold">Withdrawal history</div><EmptyState title="No withdrawal history" description="Approved and completed payouts will appear here. No sample payout has been fabricated."/></div></section>; }
