import { NextResponse } from "next/server";
import { approvalReviewSchema } from "@/features/approvals/schemas";
import { appendAuditLog } from "@/features/audit/service";
import { assertPermission, canReviewOwnRequest } from "@/lib/auth/permissions";
import { getPrincipal } from "@/lib/auth/principal";
import { getPrisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const principal = await getPrincipal();
  if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  try { assertPermission(principal.role, "approval:review"); } catch { return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 }); }
  const parsed = approvalReviewSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid review.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  const { id } = await params;
  try {
    const result = await getPrisma().$transaction(async (tx) => {
      const approval = await tx.approvalRequest.findFirst({ where: { id, organizationId: principal.organizationId, status: "PENDING" } });
      if (!approval) throw new Error("NOT_FOUND");
      if (!canReviewOwnRequest(approval.requestedBy, principal.userId)) throw new Error("MAKER_CHECKER");
      const reviewed = await tx.approvalRequest.update({ where: { id: approval.id }, data: { status: parsed.data.decision, reviewedBy: principal.userId, reviewNote: parsed.data.note, reviewedAt: new Date() } });
      await appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: `approval.${parsed.data.decision.toLowerCase()}`, entityType: "approval", entityId: reviewed.id, metadata: { note: parsed.data.note } });
      return reviewed;
    });
    return NextResponse.json({ success: true, data: result, message: "Approval reviewed." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "NOT_FOUND") return NextResponse.json({ success: false, message: "Pending approval not found." }, { status: 404 });
    if (message === "MAKER_CHECKER") return NextResponse.json({ success: false, message: "Requesters cannot approve their own actions." }, { status: 409 });
    console.error("approval.review.failed", error);
    return NextResponse.json({ success: false, message: "Unable to review approval." }, { status: 500 });
  }
}
