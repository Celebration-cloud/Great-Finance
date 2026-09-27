import { approvalReviewSchema } from "@/features/approvals/schemas";
import { appendAuditLog } from "@/features/audit/service";
import { canReviewOwnRequest } from "@/lib/auth/permissions";
import { requireApiPermission, requireApiPrincipal } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(request, "approval.review", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiPermission(principal, "approval:review");
    const parsed = approvalReviewSchema.safeParse(await readJson(request));
    if (!parsed.success) throw errors.validation("Invalid review.", parsed.error.flatten().fieldErrors);
    const { id } = await params;
    const result = await getPrisma().$transaction(async (tx) => {
      const isSystemReviewer = ["REVIEWER", "ADMIN", "SUPER_ADMIN"].includes(principal.role);
      const approval = await tx.approvalRequest.findFirst({
        where: isSystemReviewer
          ? { id, status: "PENDING" }
          : { id, organizationId: principal.organizationId, status: "PENDING" },
      });
      if (!approval) throw errors.notFound("Pending approval not found.");
      if (!canReviewOwnRequest(approval.requestedBy, principal.userId)) throw errors.conflict("Requesters cannot approve their own actions.");
      const reviewed = await tx.approvalRequest.update({ where: { id: approval.id }, data: { status: parsed.data.decision, reviewedBy: principal.userId, reviewNote: parsed.data.note, reviewedAt: new Date() } });
      await appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: `approval.${parsed.data.decision.toLowerCase()}`, entityType: "approval", entityId: reviewed.id, metadata: { note: parsed.data.note } });
      return reviewed;
    });
    return apiSuccess(context, result, "Approval reviewed.");
  });
}
