import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { appendAuditLog } from "@/features/audit/service";
import { onboardingSchema } from "@/features/onboarding/schemas";
import { getAuth } from "@/lib/auth/server";
import { getPrisma } from "@/lib/db";

export async function POST(request: Request) {
  const { data } = await getAuth().getSession();
  if (!data?.user?.id || !data.user.email) return NextResponse.json({ success: false, message: "Sign in before completing registration." }, { status: 401 });
  const parsed = onboardingSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid registration details.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  const existing = await getPrisma().membership.findFirst({ where: { authUserId: data.user.id } });
  if (existing) return NextResponse.json({ success: true, data: { organizationId: existing.organizationId }, message: "Registration already completed." });
  const suffix = randomUUID().slice(0, 8);
  const referralCode = `GF${Date.now().toString(36).toUpperCase()}${suffix.slice(0, 4).toUpperCase()}`;
  const organization = await getPrisma().$transaction(async (tx) => {
    const created = await tx.organization.create({ data: {
      name: parsed.data.accountType === "VENDOR" ? `${parsed.data.fullName} Vendor` : parsed.data.fullName,
      slug: `${parsed.data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45) || "account"}-${suffix}`,
      type: parsed.data.accountType,
      memberships: { create: { authUserId: data.user.id, role: parsed.data.accountType } },
      profile: { create: {
        authUserId: data.user.id,
        displayName: parsed.data.fullName,
        phone: parsed.data.phone,
        whatsapp: parsed.data.accountType === "VENDOR" ? parsed.data.phone : undefined,
        bankName: parsed.data.accountType === "CUSTOMER" ? parsed.data.bankName : undefined,
        accountNumberLast4: parsed.data.accountType === "CUSTOMER" ? parsed.data.accountNumber?.slice(-4) : undefined,
        referralCode,
        referredByCode: parsed.data.referralCode || undefined,
      } },
    } });
    await appendAuditLog(tx, { actorId: data.user.id, actorRole: parsed.data.accountType, action: "organization.created", entityType: "organization", entityId: created.id, metadata: { accountType: parsed.data.accountType } });
    return created;
  });
  return NextResponse.json({ success: true, data: { organizationId: organization.id }, message: "Registration completed." }, { status: 201 });
}
