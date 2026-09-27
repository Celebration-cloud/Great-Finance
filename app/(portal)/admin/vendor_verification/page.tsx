import { VendorVerificationActions } from "@/components/admin/vendor-verification-actions";
import { DataTable, EmptyState, PageHeader } from "@/components/portal/page-header";
import { Pagination } from "@/components/portal/pagination";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function VendorVerificationPage({ searchParams }: Props) {
  await requireRole(["REVIEWER", "ADMIN", "SUPER_ADMIN"]);
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const db = getPrisma();

  const [totalCount, requests] = await Promise.all([
    db.approvalRequest.count({
      where: { resourceType: "vendor-kyc", status: "PENDING" },
    }),
    db.approvalRequest.findMany({
      where: { resourceType: "vendor-kyc", status: "PENDING" },
      orderBy: { createdAt: "asc" },
      skip,
      take: pageSize,
    }),
  ]);

  const submissions = await db.vendorKycSubmission.findMany({
    where: { id: { in: requests.map((request) => request.resourceId) } },
  });
  const submissionById = new Map(submissions.map((s) => [s.id, s]));

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Identity review queue"
        title="Vendor KYC Verification"
        description="Inspect submitted identity credentials and photos inline with zero-download protection. Review and approve or reject regional distributor applications."
      />

      <div className="space-y-2">
        <DataTable columns={["Vendor Name", "Origin & LGA", "Submission Date", "Compliance Decision & Inline Preview"]}>
          {requests.map((request) => {
            const submission = submissionById.get(request.resourceId);
            const vendorName = submission?.fullName ?? "Unknown Applicant";

            return (
              <tr key={request.id} className="hover:bg-[var(--surface-muted)]/50 transition">
                <td className="px-5 py-4">
                  <div className="font-bold text-[var(--ink)]">{vendorName}</div>
                  <div className="font-mono text-[0.68rem] text-[var(--muted)]">Ref: {request.id}</div>
                </td>
                <td className="px-5 py-4 text-xs text-[var(--muted)]">
                  {submission ? `${submission.localGovernment}, ${submission.stateOfOrigin}` : "—"}
                </td>
                <td className="px-5 py-4 text-xs text-[var(--muted)]">
                  {request.createdAt.toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-5 py-4">
                  {submission ? (
                    <VendorVerificationActions
                      approvalId={request.id}
                      submissionId={submission.id}
                      vendorName={vendorName}
                    />
                  ) : (
                    <span className="text-xs text-[var(--danger)]">Submission record missing</span>
                  )}
                </td>
              </tr>
            );
          })}
        </DataTable>

        {!requests.length && (
          <div className="rounded-b-[1.25rem] border-x border-b border-[var(--line)] bg-white">
            <EmptyState
              title="Identity verification queue is clear"
              description="No pending vendor KYC submissions require review at this time."
            />
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          baseUrl="/admin/vendor_verification"
        />
      </div>
    </section>
  );
}
