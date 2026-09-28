import { z } from "zod";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiMessage, readJson, withApiHandler } from "@/lib/http/api-response";
import { appendAuditLog } from "@/features/audit/service";
import { getAuth } from "@/lib/auth/server";
import { assertRateLimit, RATE_LIMIT_RULES } from "@/lib/security/rate-limit";

const deleteAccountSchema = z.object({
  confirmationPhrase: z
    .string()
    .refine((v) => v === "DELETE MY ACCOUNT", {
      message: 'You must type "DELETE MY ACCOUNT" exactly to confirm.',
    }),
});

export async function DELETE(request: Request) {
  return withApiHandler(request, "account.delete", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiRole(principal, ["CUSTOMER", "VENDOR"]);
    assertRateLimit(request, "account.delete", RATE_LIMIT_RULES.ACCOUNT_DESTRUCTIVE, principal.userId);

    const body = deleteAccountSchema.safeParse(await readJson(request));
    if (!body.success) {
      throw errors.validation("Confirmation phrase is invalid.", body.error.flatten().fieldErrors);
    }

    const db = getPrisma();

    // For VENDOR: ensure no active coupons are outstanding (safety check)
    if (principal.role === "VENDOR") {
      const activeCoupons = await db.coupon.count({
        where: { vendorOrgId: principal.organizationId, status: "ACTIVE" },
      });
      if (activeCoupons > 0) {
        throw errors.conflict(
          `You have ${activeCoupons} active coupon(s) still in circulation. Please contact support to void them before deleting your account.`
        );
      }
    }

    // For CUSTOMER: ensure no active investments are outstanding
    if (principal.role === "CUSTOMER") {
      const activeInvestments = await db.investment.count({
        where: { customerId: principal.userId, status: "ACTIVE" },
      });
      if (activeInvestments > 0) {
        throw errors.conflict(
          `You have ${activeInvestments} active investment(s) that have not yet matured. Your account cannot be deleted until all investments are settled.`
        );
      }
    }

    await db.$transaction(async (tx) => {
      // Suspend the membership — this prevents future logins via principal resolution
      await tx.membership.updateMany({
        where: { authUserId: principal.userId, organizationId: principal.organizationId },
        data: { status: "SUSPENDED" },
      });

      await appendAuditLog(tx, {
        actorId: principal.userId,
        actorRole: principal.role,
        action: "account.self_deleted",
        entityType: "membership",
        entityId: principal.organizationId,
        metadata: { reason: "user_initiated_deletion", role: principal.role },
      });
    });

    // Sign out the user session after deletion
    try {
      await getAuth().signOut();
    } catch {
      // Non-fatal — session may already be expired
    }

    return apiMessage(
      context,
      "Your account has been permanently deactivated. All active sessions have been invalidated."
    );
  });
}
