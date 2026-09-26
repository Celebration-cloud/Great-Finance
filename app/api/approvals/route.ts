import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { approvalRequestSchema } from "@/features/approvals/schemas";
import { appendAuditLog } from "@/features/audit/service";
import { assertPermission } from "@/lib/auth/permissions";
import { getPrincipal } from "@/lib/auth/principal";
import { getPrisma } from "@/lib/db";

export async function POST(request: Request) {
  const principal = await getPrincipal();
  if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  try { assertPermission(principal.role, "approval:request"); } catch { return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 }); }
  const parsed = approvalRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid approval request.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  const result = await getPrisma().$transaction(async (tx) => {
    const approval = await tx.approvalRequest.create({ data: { organizationId: principal.organizationId, requestedBy: principal.userId, resourceType: parsed.data.resourceType, resourceId: parsed.data.resourceId, action: parsed.data.action, payload: parsed.data.payload as Prisma.InputJsonValue } });
    await appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: "approval.requested", entityType: "approval", entityId: approval.id, metadata: { resourceType: approval.resourceType, resourceId: approval.resourceId } });
    return approval;
  });
  return NextResponse.json({ success: true, data: result, message: "Approval requested." }, { status: 201 });
}
