import { AppError, errors } from "../errors/app-error.ts";

export function classifyAuthServerError(cause: unknown) {
  if (cause instanceof AppError) return cause;
  const status = typeof cause === "object" && cause !== null && "status" in cause ? Number(cause.status) : undefined;
  if (status === 401) return errors.invalidSession();
  if (status === 429) return new AppError("RATE_LIMITED", { status: 429, message: "Too many authentication attempts. Please wait and try again.", retryable: true, report: "warn", cause });
  return errors.authUnavailable(cause);
}
