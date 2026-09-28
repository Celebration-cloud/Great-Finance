export type ErrorCode =
  | "VALIDATION_ERROR"
  | "MALFORMED_JSON"
  | "AUTHENTICATION_REQUIRED"
  | "AUTH_SESSION_INVALID"
  | "AUTH_SERVICE_UNAVAILABLE"
  | "ACCOUNT_NOT_PROVISIONED"
  | "ACCOUNT_SUSPENDED"
  | "AUTHORIZATION_DENIED"
  | "WEBHOOK_SIGNATURE_INVALID"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "PROVIDER_TIMEOUT"
  | "PROVIDER_UNAVAILABLE"
  | "STORAGE_UNAVAILABLE"
  | "DATABASE_UNAVAILABLE"
  | "CONFIGURATION_ERROR"
  | "FINANCIAL_INVARIANT_VIOLATION"
  | "INTERNAL_ERROR";

export type ErrorReportLevel = "none" | "warn" | "error";

type AppErrorOptions = {
  status: number;
  message: string;
  retryable?: boolean;
  details?: Record<string, unknown>;
  report?: ErrorReportLevel;
  cause?: unknown;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly retryable: boolean;
  readonly details?: Record<string, unknown>;
  readonly report: ErrorReportLevel;

  constructor(code: ErrorCode, options: AppErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
    this.details = options.details;
    this.report = options.report ?? (options.status >= 500 ? "error" : "none");
  }
}

type ErrorLike = { code?: unknown; name?: unknown; message?: unknown };

function isErrorLike(error: unknown): error is ErrorLike {
  return typeof error === "object" && error !== null;
}

export function normalizeError(error: unknown, fallbackMessage = "The request could not be completed.") {
  if (error instanceof AppError) return error;

  if (isErrorLike(error)) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return new AppError("PROVIDER_TIMEOUT", { status: 503, message: "A required service timed out. Please try again.", retryable: true, cause: error });
    }
    if (error.code === "P2002") return new AppError("CONFLICT", { status: 409, message: "That record already exists.", cause: error });
    if (error.code === "P2025") return new AppError("NOT_FOUND", { status: 404, message: "The requested record was not found.", cause: error });
    if (typeof error.code === "string" && /^(P100[0-3]|P1017)$/.test(error.code)) {
      return new AppError("DATABASE_UNAVAILABLE", { status: 503, message: "The database is temporarily unavailable.", retryable: true, cause: error });
    }
  }

  return new AppError("INTERNAL_ERROR", { status: 500, message: fallbackMessage, cause: error });
}

export const errors = {
  authenticationRequired: (message = "Authentication required.") => new AppError("AUTHENTICATION_REQUIRED", { status: 401, message }),
  invalidSession: () => new AppError("AUTH_SESSION_INVALID", { status: 401, message: "Your session is invalid or has expired. Sign in again." }),
  authUnavailable: (cause?: unknown) => new AppError("AUTH_SERVICE_UNAVAILABLE", { status: 503, message: "Authentication is temporarily unavailable. Please try again.", retryable: true, cause }),
  accountNotProvisioned: () => new AppError("ACCOUNT_NOT_PROVISIONED", { status: 403, message: "Your account setup is incomplete.", report: "warn" }),
  accountSuspended: () => new AppError("ACCOUNT_SUSPENDED", { status: 403, message: "This account is suspended. Contact support.", report: "warn" }),
  forbidden: (message = "You do not have permission to perform this action.") => new AppError("AUTHORIZATION_DENIED", { status: 403, message, report: "warn" }),
  validation: (message: string, fieldErrors?: Record<string, unknown>) => new AppError("VALIDATION_ERROR", { status: 400, message, details: fieldErrors ? { fieldErrors } : undefined }),
  malformedJson: () => new AppError("MALFORMED_JSON", { status: 400, message: "The request body must be valid JSON." }),
  notFound: (message: string) => new AppError("NOT_FOUND", { status: 404, message }),
  conflict: (message: string) => new AppError("CONFLICT", { status: 409, message }),
  configuration: (message: string, cause?: unknown) => new AppError("CONFIGURATION_ERROR", { status: 503, message, retryable: false, cause }),
  providerUnavailable: (message: string, cause?: unknown) => new AppError("PROVIDER_UNAVAILABLE", { status: 503, message, retryable: true, cause }),
  storageUnavailable: (message: string, cause?: unknown) => new AppError("STORAGE_UNAVAILABLE", { status: 503, message, retryable: true, cause }),
  invariant: (message: string, cause?: unknown) => new AppError("FINANCIAL_INVARIANT_VIOLATION", { status: 409, message, report: "error", cause }),
  rateLimited: (message = "Too many requests. Please wait a moment before trying again.", retryAfterSeconds?: number) =>
    new AppError("RATE_LIMITED", {
      status: 429,
      message,
      retryable: true,
      details: retryAfterSeconds !== undefined ? { retryAfter: retryAfterSeconds } : undefined,
      report: "warn",
    }),
};
