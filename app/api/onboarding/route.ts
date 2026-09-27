import { randomUUID } from "node:crypto";
import { appendAuditLog } from "@/features/audit/service";
import { onboardingSchema } from "@/features/onboarding/schemas";
import { requireAuthUser } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";

export async function POST(request: Request) {
  return withApiHandler(request, "onboarding.create", async (context) => {
    const user = await requireAuthUser("Sign in before completing registration.");
    const parsed = onboardingSchema.safeParse(await readJson(request));
    if (!parsed.success) throw errors.validation("Invalid registration details.", parsed.error.flatten().fieldErrors);
    const existing = await getPrisma().membership.findFirst({ where: { authUserId: user.id } });
    if (existing) return apiSuccess(context, { organizationId: existing.organizationId }, "Registration already completed.");
    const suffix = randomUUID().slice(0, 8);
    const referralCode = `GF${Date.now().toString(36).toUpperCase()}${suffix.slice(0, 4).toUpperCase()}`;
    const organization = await getPrisma().$transaction(async (tx) => {
      const created = await tx.organization.create({ data: {
        name: parsed.data.accountType === "VENDOR" ? `${parsed.data.fullName} Vendor` : parsed.data.fullName,
        slug: `${parsed.data.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45) || "account"}-${suffix}`,
        type: parsed.data.accountType,
        memberships: { create: { authUserId: user.id, role: parsed.data.accountType } },
        profile: { create: {
          authUserId: user.id,
          displayName: parsed.data.fullName,
          phone: parsed.data.phone,
          whatsapp: parsed.data.accountType === "VENDOR" ? parsed.data.phone : undefined,
          bankName: parsed.data.accountType === "CUSTOMER" ? parsed.data.bankName : undefined,
          accountNumberLast4: parsed.data.accountType === "CUSTOMER" ? parsed.data.accountNumber?.slice(-4) : undefined,
          referralCode,
          referredByCode: parsed.data.referralCode || undefined,
        } },
      } });
      await appendAuditLog(tx, { actorId: user.id, actorRole: parsed.data.accountType, action: "organization.created", entityType: "organization", entityId: created.id, metadata: { accountType: parsed.data.accountType } });
      return created;
    });
    return apiSuccess(context, { organizationId: organization.id }, "Registration completed.", 201);
  });
}
