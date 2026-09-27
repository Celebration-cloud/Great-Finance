import { Prisma } from "@/generated/prisma/client";
import { approvalRequestSchema } from "@/features/approvals/schemas";
import { appendAuditLog } from "@/features/audit/service";
import { requireApiPermission, requireApiPrincipal } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";

export async function POST(request: Request) {
  return withApiHandler(request, "approval.request", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiPermission(principal, "approval:request");
    const parsed = approvalRequestSchema.safeParse(await readJson(request));
    if (!parsed.success) throw errors.validation("Invalid approval request.", parsed.error.flatten().fieldErrors);
    const result = await getPrisma().$transaction(async (tx) => {
      const approval = await tx.approvalRequest.create({ data: { organizationId: principal.organizationId, requestedBy: principal.userId, resourceType: parsed.data.resourceType, resourceId: parsed.data.resourceId, action: parsed.data.action, payload: parsed.data.payload as Prisma.InputJsonValue } });
      await appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: "approval.requested", entityType: "approval", entityId: approval.id, metadata: { resourceType: approval.resourceType, resourceId: approval.resourceId } });
      return approval;
    });
    return apiSuccess(context, result, "Approval requested.", 201);
  });
}
