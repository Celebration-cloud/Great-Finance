import { errors } from "@/lib/errors/app-error";

export interface RateLimitRule {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum number of allowed requests in the time window */
  max: number;
  /** Custom error message when rate limited */
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
  retryAfterSeconds: number;
  headers: Record<string, string>;
}

// In-memory sliding-window store
const storage = new Map<string, number[]>();
let lastPruned = Date.now();

function pruneExpired(now: number) {
  if (now - lastPruned < 60_000) return;
  lastPruned = now;

  for (const [key, timestamps] of storage.entries()) {
    const valid = timestamps.filter((t) => now - t < 3_600_000); // retain nothing older than 1hr
    if (valid.length === 0) {
      storage.delete(key);
    } else {
      storage.set(key, valid);
    }
  }
}

/**
 * Extracts the best-effort client IP from incoming request headers.
 */
export function getClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return "127.0.0.1";
}

/**
 * Checks and records a rate limit attempt for a given request.
 */
export function checkRateLimit(
  request: Request,
  namespace: string,
  rule: RateLimitRule,
  customIdentifier?: string
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const ip = getClientIp(request);
  const identifier = customIdentifier ? `${customIdentifier}:${ip}` : ip;
  const storageKey = `${namespace}:${identifier}`;

  const existing = storage.get(storageKey) ?? [];
  const windowStart = now - rule.windowMs;
  const recent = existing.filter((timestamp) => timestamp > windowStart);

  const remaining = Math.max(0, rule.max - recent.length);
  const oldest = recent[0] ?? now;
  const resetMs = oldest + rule.windowMs;
  const retryAfterSeconds = Math.max(1, Math.ceil((resetMs - now) / 1000));

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(rule.max),
    "X-RateLimit-Remaining": String(Math.max(0, remaining - 1)),
    "X-RateLimit-Reset": String(Math.ceil(resetMs / 1000)),
  };

  if (recent.length >= rule.max) {
    headers["Retry-After"] = String(retryAfterSeconds);
    return {
      allowed: false,
      limit: rule.max,
      remaining: 0,
      resetMs,
      retryAfterSeconds,
      headers,
    };
  }

  recent.push(now);
  storage.set(storageKey, recent);

  return {
    allowed: true,
    limit: rule.max,
    remaining: rule.max - recent.length,
    resetMs,
    retryAfterSeconds: 0,
    headers,
  };
}

/**
 * Asserts that the incoming request is within rate limits.
 * Throws AppError(RATE_LIMITED) if exceeded.
 */
export function assertRateLimit(
  request: Request,
  namespace: string,
  rule: RateLimitRule,
  customIdentifier?: string
): RateLimitResult {
  const result = checkRateLimit(request, namespace, rule, customIdentifier);
  if (!result.allowed) {
    throw errors.rateLimited(
      rule.message ?? `Too many requests. Please wait ${result.retryAfterSeconds}s before trying again.`,
      result.retryAfterSeconds
    );
  }
  return result;
}

/**
 * Preset production rate limiting rules for sensitive operations
 */
export const RATE_LIMIT_RULES = {
  // Password recovery request (email spam / enumeration protection)
  AUTH_RECOVERY: {
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 3,
    message: "Too many password recovery requests. Please wait 15 minutes before trying again.",
  },
  // Password reset execution (token brute force protection)
  AUTH_RESET: {
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 5,
    message: "Too many password reset attempts. Please wait 15 minutes before trying again.",
  },
  // General auth sign in (credential brute force protection)
  AUTH_SIGN_IN: {
    windowMs: 5 * 60 * 1000, // 5 mins
    max: 10,
    message: "Too many sign-in attempts. Please wait 5 minutes before trying again.",
  },
  // Coupon redemption (prevents guessing voucher codes)
  COUPON_REDEEM: {
    windowMs: 5 * 60 * 1000, // 5 mins
    max: 6,
    message: "Too many coupon redemption attempts. Please wait 5 minutes.",
  },
  // Payment checkout init (prevents payment intent floods)
  PAYMENT_INIT: {
    windowMs: 60 * 1000, // 1 min
    max: 8,
    message: "Payment initialization rate limit reached. Please wait a minute.",
  },
  // Withdrawal submission (prevents rapid double-click & spam payouts)
  WITHDRAWAL_SUBMIT: {
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 3,
    message: "Withdrawal request limit reached. Please wait 10 minutes before submitting another request.",
  },
  // KYC document upload & submission (prevents bucket flooding)
  KYC_UPLOAD: {
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 8,
    message: "Document upload limit reached. Please wait 15 minutes.",
  },
  // Admin sensitive operations (invitations, manual token verification, reviews)
  ADMIN_SENSITIVE: {
    windowMs: 60 * 1000, // 1 min
    max: 20,
    message: "Administrative action rate limit reached. Please wait a moment.",
  },
  // Destructive operations (account deletion)
  ACCOUNT_DESTRUCTIVE: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: "Account action limit reached. Please wait or contact support.",
  },
  // Profile / Settings updates
  PROFILE_UPDATE: {
    windowMs: 60 * 1000, // 1 min
    max: 15,
    message: "Profile update rate limit reached. Please wait a moment.",
  },
} as const;
