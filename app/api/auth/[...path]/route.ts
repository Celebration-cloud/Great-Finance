import { getAuth } from "@/lib/auth/server";
import { hasAuthConfig } from "@/lib/env/server";
import { errors } from "@/lib/errors/app-error";
import { apiError, createApiContext } from "@/lib/http/api-response";
import { logEvent } from "@/lib/observability/logger";
import { assertRateLimit, RATE_LIMIT_RULES } from "@/lib/security/rate-limit";

type Context = { params: Promise<{ path: string[] }> };
type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function handle(method: Method, request: Request, context: Context) {
  const apiContext = createApiContext(request, `auth.${method.toLowerCase()}`);
  if (!hasAuthConfig()) return apiError(apiContext, errors.configuration("Authentication is not configured."));
  try {
    const { path } = await context.params;
    const pathStr = (path ?? []).join("/");

    // Rate limiting sensitive auth operations
    if (method === "POST") {
      if (pathStr.includes("request-password-reset") || pathStr.includes("forget-password")) {
        assertRateLimit(request, "auth.recovery", RATE_LIMIT_RULES.AUTH_RECOVERY);
      } else if (pathStr.includes("reset-password")) {
        assertRateLimit(request, "auth.reset", RATE_LIMIT_RULES.AUTH_RESET);
      } else if (pathStr.includes("sign-in")) {
        assertRateLimit(request, "auth.signin", RATE_LIMIT_RULES.AUTH_SIGN_IN);
      }
    }

    const response = await getAuth().handler()[method](request, context);
    response.headers.set("x-request-id", apiContext.requestId);
    if (response.status >= 500) logEvent("error", "auth.provider.failed", { requestId: apiContext.requestId, status: response.status, method, path: pathStr });
    else if (response.status === 429) logEvent("warn", "auth.rate-limited", { requestId: apiContext.requestId, method, path: pathStr });
    return response;
  } catch (cause) {
    return apiError(apiContext, cause, "Authentication is temporarily unavailable. Please try again.");
  }
}

export const GET = (request: Request, context: Context) => handle("GET", request, context);
export const POST = (request: Request, context: Context) => handle("POST", request, context);
export const PUT = (request: Request, context: Context) => handle("PUT", request, context);
export const PATCH = (request: Request, context: Context) => handle("PATCH", request, context);
export const DELETE = (request: Request, context: Context) => handle("DELETE", request, context);
