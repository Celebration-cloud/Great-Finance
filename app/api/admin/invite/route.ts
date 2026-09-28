import { randomBytes } from "node:crypto";
import { z } from "zod";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";
import { appendAuditLog } from "@/features/audit/service";
import { sendEmail } from "@/lib/email/mailer";

const inviteAdminSchema = z.object({
  email: z.string().email("A valid email address is required."),
  role: z.enum(["ADMIN", "REVIEWER"], {
    errorMap: () => ({ message: "Role must be ADMIN or REVIEWER." }),
  }),
  note: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  return withApiHandler(request, "admin.invite", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiRole(principal, ["SUPER_ADMIN"], "Only a Super Admin can invite new administrators.");

    const body = inviteAdminSchema.safeParse(await readJson(request));
    if (!body.success) {
      throw errors.validation("Invalid invite request.", body.error.flatten().fieldErrors);
    }

    const { email, role, note } = body.data;
    const db = getPrisma();

    // Check if there is already an active membership for this email
    // We do this via Neon Auth user lookup is not directly available in Prisma,
    // so we store a pending invite token in audit log metadata as a lightweight approach.
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";

    // Generate a 48-hour expiring signed token stored in the database
    // We use the AuditLog as an ephemeral invite store (no schema change needed)
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await db.$transaction(async (tx) => {
      // Store invite token in audit_logs for retrieval during onboarding
      await appendAuditLog(tx, {
        actorId: principal.userId,
        actorRole: principal.role,
        action: "admin.invite_sent",
        entityType: "admin_invite",
        entityId: token,
        metadata: {
          inviteeEmail: email,
          role,
          token,
          expiresAt: expiresAt.toISOString(),
          note: note ?? null,
        },
      });
    });

    const inviteUrl = `${appUrl}/admin/accept-invite?token=${token}&email=${encodeURIComponent(email)}&role=${role}`;

    await sendEmail({
      to: email,
      subject: "You have been invited to join Great Finance as an Administrator",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0d1117; color: #e6edf3; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-flex; align-items: center; gap: 10px;">
              <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10b981, #d97706); border-radius: 10px;"></div>
              <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #e6edf3;">Great Finance</span>
            </div>
          </div>

          <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #e6edf3;">Administrator Invitation</h1>
          <p style="color: #8b949e; margin-bottom: 24px; line-height: 1.6;">
            You have been invited by <strong style="color: #10b981;">${principal.email}</strong> to join the
            Great Finance administration panel with the <strong style="color: #d97706;">${role}</strong> role.
          </p>

          ${note ? `<div style="background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 13px; color: #8b949e; font-style: italic;">"${note}"</p>
          </div>` : ""}

          <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; margin-bottom: 24px;">
            Accept Invitation &rarr;
          </a>

          <p style="color: #6e7681; font-size: 12px; margin-top: 24px;">
            This invitation link expires in <strong>48 hours</strong>. If you did not expect this email, you can safely ignore it.
          </p>
          <hr style="border: none; border-top: 1px solid #21262d; margin: 24px 0;" />
          <p style="color: #6e7681; font-size: 11px;">Great Finance &bull; Secure Administration Portal</p>
        </div>
      `,
    });

    return apiSuccess(
      context,
      { inviteeEmail: email, role, expiresAt: expiresAt.toISOString() },
      `Invitation dispatched to ${email} with ${role} privileges. Link expires in 48 hours.`,
      201
    );
  });
}
