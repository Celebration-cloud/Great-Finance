import Link from "next/link";
import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function VendorVerificationPage() {
  await requireRole(["REVIEWER", "ADMIN", "SUPER_ADMIN"]);
  const requests = await getPrisma().approvalRequest.findMany({ where: { resourceType: "vendor-kyc", status: "PENDING" }, orderBy: { createdAt: "asc" }, take: 100 });
  const submissions = await getPrisma().vendorKycSubmission.findMany({ where: { id: { in: requests.map((request) => request.resourceId) } } });
  const submissionById = new Map(submissions.map((submission) => [submission.id, submission]));

  return <section>
    <PageHeader eyebrow="Identity queue" title="Vendor Verification" description="Private documents open through five-minute signed links. Every access is audited."/>
    <DataTable columns={["Vendor", "Location", "Submitted", "Secure documents"]}>{requests.map((request) => {
      const submission = submissionById.get(request.resourceId);
      return <tr key={request.id}>
        <td className="px-5 py-4"><div className="font-semibold">{submission?.fullName ?? "Submission unavailable"}</div><div className="font-mono text-xs text-[var(--muted)]">{request.id}</div></td>
        <td className="px-5 py-4">{submission ? `${submission.localGovernment}, ${submission.stateOfOrigin}` : "—"}</td>
        <td className="px-5 py-4">{request.createdAt.toLocaleDateString("en-NG")}</td>
        <td className="px-5 py-4">{submission ? <div className="flex flex-wrap gap-2"><Link className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--brand)]" href={`/api/storage/kyc/${submission.id}/identity`}>Identity document</Link><Link className="rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--brand)]" href={`/api/storage/kyc/${submission.id}/selfie`}>Photo</Link></div> : "Unavailable"}</td>
      </tr>;
    })}</DataTable>
    {!requests.length && <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white"><EmptyState title="No vendor verifications" description="Securely submitted KYC approvals will appear here."/></div>}
  </section>;
}
