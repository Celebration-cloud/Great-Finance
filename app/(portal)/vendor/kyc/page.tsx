import { KycForm } from "@/components/vendor/kyc-form";
import { PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";

export const dynamic = "force-dynamic";
export default async function KycPage() { await requireRole(["VENDOR"]); return <section><PageHeader eyebrow="Identity review" title="KYC Verification" description="Provide the original five requested identity details. Files remain local until secure object storage is configured."/><KycForm/></section>; }
