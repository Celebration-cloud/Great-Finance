/**
 * POST /api/withdrawals
 * Customer submits a withdrawal request for a matured investment.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { appendAuditLog } from "@/features/audit/service";

const schema = z.object({
  investmentId: z.string().cuid("Invalid investment ID"),
  bankName:      z.string().min(2, "Bank name required"),
  accountNumber: z.string().regex(/^\d{10}$/, "NUBAN must be exactly 10 digits"),
  accountName:   z.string().min(2, "Account name required"),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await requireRole(["CUSTOMER"]);
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }
  const { investmentId, bankName, accountNumber, accountName } = parsed.data;
  const db = getPrisma();

  // 1. Verify the investment belongs to this user and is matured/settled-eligible
  const investment = await db.investment.findFirst({
    where: {
      id: investmentId,
      customerId: session.userId,
    },
  });

  if (!investment) {
    return NextResponse.json({ success: false, error: "Investment not found." }, { status: 404 });
  }

  if (investment.status === "SETTLED" || investment.status === "CANCELLED") {
    return NextResponse.json(
      { success: false, error: "This investment has already been settled or cancelled." },
      { status: 400 }
    );
  }

  const now = new Date();
  const isMatured = now >= new Date(investment.matureAt);
  if (!isMatured && investment.status !== "MATURED") {
    const daysLeft = Math.ceil(
      (new Date(investment.matureAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return NextResponse.json(
      { success: false, error: `Investment matures in ${daysLeft} day(s). Withdrawals open on maturity.` },
      { status: 400 }
    );
  }

  // 2. Prevent duplicate pending requests
  const existing = await db.withdrawalRequest.findFirst({
    where: { investmentId, status: { in: ["PENDING", "APPROVED", "PROCESSING"] } },
  });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "A withdrawal request for this investment is already in progress." },
      { status: 409 }
    );
  }

  // 3. Create the request
  const withdrawal = await db.withdrawalRequest.create({
    data: {
      investmentId,
      customerId:    session.userId,
      orgId:         investment.orgId,
      amountMinor:   BigInt(investment.returnAmount) * 100n, // convert NGN → kobo
      currency:      "NGN",
      bankName,
      accountNumber,
      accountName,
      status:        "PENDING",
    },
  });

  await appendAuditLog(db, {
    actorId:    session.userId,
    actorRole:  "CUSTOMER",
    action:     "withdrawal.requested",
    entityType: "WithdrawalRequest",
    entityId:   withdrawal.id,
    metadata:   { investmentId, amountNGN: investment.returnAmount, bankName, accountName },
  });

  return NextResponse.json(
    { success: true, data: { id: withdrawal.id, status: "PENDING" }, message: "Withdrawal request submitted. Admin will review within 1–3 business days." },
    { status: 201 }
  );
}

export async function GET() {
  const session = await requireRole(["CUSTOMER"]);
  const db = getPrisma();

  const requests = await db.withdrawalRequest.findMany({
    where: { customerId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { investment: { select: { planName: true, returnAmount: true, matureAt: true } } },
  });

  const serialized = requests.map((r) => ({
    ...r,
    amountMinor: r.amountMinor.toString(),
  }));

  return NextResponse.json({ success: true, data: serialized });
}
