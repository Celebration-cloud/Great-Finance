import { CouponCodeForm } from "@/components/portal/coupon-code-form";
import { EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";

export const dynamic = "force-dynamic";
export default async function InvestmentPage() { await requireRole(["CUSTOMER"]); return <section><PageHeader eyebrow="Portfolio" title="Investments" description="Enter a verified coupon code to start an approved plan."/><div className="mt-8"><CouponCodeForm/></div><div className="card mt-8"><div className="border-b border-[var(--line)] px-5 py-4 font-bold">Investment history</div><EmptyState title="No investment history" description="Verified coupon redemptions and their ledger-backed status will appear here."/></div></section>; }
