import { z } from "zod";
import { appendAuditLog } from "@/features/audit/service";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";

const statusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
  reason: z.string().max(255).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withApiHandler(request, "admin.membership.updateStatus", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiRole(principal, ["ADMIN", "SUPER_ADMIN"], "Administrative permission required.");

    const parsed = statusSchema.safeParse(await readJson(request));
    if (!parsed.success) {
      throw errors.validation("Invalid status update.", parsed.error.flatten().fieldErrors);
    }

    const { id } = await params;
    const db = getPrisma();

    const membership = await db.membership.findUnique({
      where: { id },
      include: { organization: true },
    });

    if (!membership) {
      throw errors.notFound("Membership record was not found.");
    }

    if (membership.authUserId === principal.userId) {
      throw errors.conflict("Administrators cannot suspend their own membership.");
    }

    const result = await db.$transaction(async (tx) => {
      const updated = await tx.membership.update({
        where: { id },
        data: { status: parsed.data.status },
      });

      await appendAuditLog(tx, {
        actorId: principal.userId,
        actorRole: principal.role,
        action: `membership.${parsed.data.status === "SUSPENDED" ? "suspended" : "reactivated"}`,
        entityType: "membership",
        entityId: updated.id,
        metadata: {
          authUserId: membership.authUserId,
          role: membership.role,
          previousStatus: membership.status,
          newStatus: parsed.data.status,
          reason: parsed.data.reason ?? "Admin action",
        },
      });

      return updated;
    });

    return apiSuccess(
      context,
      result,
      `Account successfully ${parsed.data.status === "SUSPENDED" ? "suspended (banned)" : "reactivated (unbanned)"}.`,
    );
  });
}
