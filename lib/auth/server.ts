import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";
import { errors } from "@/lib/errors/app-error";

let authInstance: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  if (authInstance) return authInstance;
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !secret || secret.length < 32) throw errors.configuration("Authentication is not configured.");
  authInstance = createNeonAuth({
    baseUrl,
    cookies: { secret, sessionDataTtl: 300 },
    logLevel: process.env.NODE_ENV === "production" ? "warn" : "error",
  });
  return authInstance;
}
