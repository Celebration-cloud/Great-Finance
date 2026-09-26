import Link from "next/link";
import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function VendorDashboardPage() { const principal = await requireRole(["VENDOR"]); const profile = await getPrisma().profile.findUnique({ where: { authUserId: principal.userId } }); return <section><PageHeader eyebrow="Vendor workspace" title={profile?.displayName ?? "Vendor dashboard"} description="Coupon inventory appears only after a verified acquisition is issued." action={<Link className="rounded-xl bg-[var(--brand)] px-4 py-2.5 font-bold text-white" href="/vendor/kyc">Carryout your KYC Verification</Link>}/><DataTable columns={["Coupon codes", "Coupon value", "Status", "Coupon Name", "Date of purchase"]}/><div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white"><EmptyState title="No coupons issued" description="The old hard-coded coupon rows were removed. Provider-verified inventory will appear here."/></div></section>; }
