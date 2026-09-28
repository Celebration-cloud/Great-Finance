import { z } from "zod";
import { requireApiPrincipal } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";
import { appendAuditLog } from "@/features/audit/service";
import { assertRateLimit, RATE_LIMIT_RULES } from "@/lib/security/rate-limit";

const updateProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters.").max(100),
  phone: z.string().trim().max(30).optional().nullable(),
  whatsapp: z.string().trim().max(30).optional().nullable(),
  bankName: z.string().trim().max(100).optional().nullable(),
  accountNumber: z.string().trim().max(20).optional().nullable(),
});

export async function PATCH(request: Request) {
  return withApiHandler(request, "settings.profile.update", async (context) => {
    const principal = await requireApiPrincipal();
    assertRateLimit(request, "profile.update", RATE_LIMIT_RULES.PROFILE_UPDATE, principal.userId);
    const rawBody = await readJson(request);
    const parsed = updateProfileSchema.safeParse(rawBody);

    if (!parsed.success) {
      throw errors.validation("Invalid profile input.", parsed.error.flatten().fieldErrors);
    }

    const { displayName, phone, whatsapp, bankName, accountNumber } = parsed.data;
    const db = getPrisma();

    const accountNumberLast4 = accountNumber && accountNumber.length >= 4
      ? accountNumber.slice(-4)
      : undefined;

    const updated = await db.$transaction(async (tx) => {
      const profile = await tx.profile.upsert({
        where: { authUserId: principal.userId },
        create: {
          authUserId: principal.userId,
          organizationId: principal.organizationId,
          displayName,
          phone: phone || null,
          whatsapp: whatsapp || null,
          bankName: bankName || null,
          accountNumberLast4: accountNumberLast4 || null,
          referralCode: `GF-${principal.userId.slice(-6).toUpperCase()}`,
        },
        update: {
          displayName,
          phone: phone || null,
          whatsapp: whatsapp || null,
          bankName: bankName || null,
          ...(accountNumberLast4 ? { accountNumberLast4 } : {}),
        },
      });

      await appendAuditLog(tx, {
        actorId: principal.userId,
        actorRole: principal.role,
        action: "profile.updated",
        entityType: "profile",
        entityId: profile.id,
        metadata: {
          displayName,
          phoneUpdated: Boolean(phone),
          whatsappUpdated: Boolean(whatsapp),
          bankUpdated: Boolean(bankName),
        },
      });

      return profile;
    });

    return apiSuccess(
      context,
      {
        profile: {
          id: updated.id,
          displayName: updated.displayName,
          phone: updated.phone,
          whatsapp: updated.whatsapp,
          bankName: updated.bankName,
          accountNumberLast4: updated.accountNumberLast4,
          referralCode: updated.referralCode,
        },
      },
      "Profile settings updated successfully."
    );
  });
}
