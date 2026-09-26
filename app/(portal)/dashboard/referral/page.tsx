import { CopyReferralCode } from "@/components/portal/copy-referral-code";
import { MetricGrid, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function ReferralPage() { const principal = await requireRole(["CUSTOMER"]); const profile = await getPrisma().profile.findUnique({ where: { authUserId: principal.userId } }); const count = profile ? await getPrisma().profile.count({ where: { referredByCode: profile.referralCode } }) : 0; return <section><PageHeader eyebrow="Network" title="Referrals"/><MetricGrid items={[{ label: "Total number of referrals", value: count }, { label: "Total referral earnings", value: "No ledger postings" }]}/>{profile && <CopyReferralCode code={profile.referralCode}/>}</section>; }
