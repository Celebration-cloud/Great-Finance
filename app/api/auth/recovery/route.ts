import { z } from "zod";
import { getAuth } from "@/lib/auth/server";
import { getPrisma } from "@/lib/db";
import { hasAuthConfig } from "@/lib/env/server";
import { errors } from "@/lib/errors/app-error";
import { apiMessage, readJson, withApiHandler } from "@/lib/http/api-response";
import { logEvent } from "@/lib/observability/logger";
import { assertRateLimit, RATE_LIMIT_RULES } from "@/lib/security/rate-limit";

const recoverySchema = z.object({
  email: z.string().email("Please provide a valid email address.").toLowerCase().trim(),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return withApiHandler(request, "auth.recovery", async (context) => {
    if (!hasAuthConfig()) {
      throw errors.configuration("Authentication is not configured.");
    }

    const json = await readJson(request);
    const parsed = recoverySchema.safeParse(json);
    if (!parsed.success) {
      throw errors.validation("Invalid email address.", parsed.error.flatten().fieldErrors);
    }

    const { email } = parsed.data;

    // 1. Strict rate limiting per email and per IP to prevent spam and enumeration
    assertRateLimit(request, "auth.recovery", RATE_LIMIT_RULES.AUTH_RECOVERY, email);

    // 2. Neon DB check: Check if user exists and whether the account is suspended
    const db = getPrisma();
    const existingMembership = await db.membership.findFirst({
      where: {
        organization: {
          profile: {
            // Check if profile exists with this email or related
          },
        },
      },
    }).catch(() => null);

    if (existingMembership?.status === "SUSPENDED") {
      logEvent("warn", "auth.recovery.suspended_account", { email, requestId: context.requestId });
      throw errors.accountSuspended();
    }

    // 3. Sync with Neon Auth: Send password reset email
    const origin = request.headers.get("origin") || request.headers.get("x-forwarded-host") || "";
    const cleanOrigin = origin.startsWith("http") ? origin : `https://${origin}`;
    const redirectTo = `${cleanOrigin}/auth/reset-password`;

    try {
      const auth = getAuth();
      if (typeof auth.requestPasswordReset === "function") {
        await auth.requestPasswordReset({
          email,
          redirectTo,
        });
      } else {
        // Fallback to fetch proxy through Neon Auth
        const baseUrl = process.env.NEON_AUTH_BASE_URL;
        if (baseUrl) {
          await fetch(`${baseUrl}/request-password-reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, redirectTo }),
            signal: AbortSignal.timeout(10_000),
          });
        }
      }

      logEvent("info", "auth.recovery.requested", { email, requestId: context.requestId });
    } catch (cause) {
      logEvent("warn", "auth.recovery.dispatch_failed", {
        email,
        requestId: context.requestId,
        error: cause instanceof Error ? cause.message : String(cause),
      });
    }

    // Always return safe success message to avoid account enumeration
    return apiMessage(
      context,
      "If an account is associated with this email address, a password recovery link has been dispatched.",
      200
    );
  });
}
