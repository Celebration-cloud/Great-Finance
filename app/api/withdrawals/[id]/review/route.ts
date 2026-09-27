/**
 * PATCH /api/withdrawals/[id]/review
 * Admin approves or rejects a withdrawal request.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { appendAuditLog } from "@/features/audit/service";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  note:   z.string().max(500).optional(),
});

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole(["ADMIN", "SUPER_ADMIN", "REVIEWER"]);
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const { action, note } = parsed.data;
  const db = getPrisma();

  const wr = await db.withdrawalRequest.findUnique({ where: { id } });
  if (!wr) return NextResponse.json({ success: false, error: "Request not found." }, { status: 404 });
  if (wr.status !== "PENDING") {
    return NextResponse.json({ success: false, error: `Request is already ${wr.status}.` }, { status: 409 });
  }

  const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
  await db.withdrawalRequest.update({
    where: { id },
    data:  {
      status:     newStatus,
      reviewedBy: session.userId,
      reviewedAt: new Date(),
      note:       note ?? null,
    },
  });

  // If approved, mark investment as SETTLED
  if (action === "approve") {
    await db.investment.update({
      where: { id: wr.investmentId },
      data:  { status: "SETTLED", settledAt: new Date() },
    });
  }

  await appendAuditLog(db, {
    actorId:    session.userId,
    actorRole:  session.role,
    action:     `withdrawal.${action}d`,
    entityType: "WithdrawalRequest",
    entityId:   id,
    metadata:   { newStatus, note },
  });

  return NextResponse.json({
    success: true,
    data:    { id, status: newStatus },
    message: `Withdrawal request ${action}d successfully.`,
  });
}
