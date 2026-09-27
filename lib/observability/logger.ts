type LogLevel = "info" | "warn" | "error";

const sensitiveKey = /authorization|cookie|password|secret|signature|token|accesscode|accountnumber|payload/i;

function sanitizeString(value: string) {
  return value
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/\b(?:sk|pk)_(?:test|live)_[A-Za-z0-9_-]+\b/g, "[REDACTED_KEY]")
    .replace(/\bvercel_blob_rw_[A-Za-z0-9_-]+\b/g, "[REDACTED_BLOB_TOKEN]")
    .replace(/(postgres(?:ql)?:\/\/[^:\s/]+:)[^@\s]+@/gi, "$1[REDACTED]@");
}

function redact(value: unknown, key = "", depth = 0): unknown {
  if (sensitiveKey.test(key)) return "[REDACTED]";
  if (depth > 4) return "[TRUNCATED]";
  if (value instanceof Error) {
    return { name: value.name, message: sanitizeString(value.message), ...(process.env.NODE_ENV === "development" ? { stack: value.stack ? sanitizeString(value.stack) : undefined } : {}) };
  }
  if (Array.isArray(value)) return value.slice(0, 20).map((item) => redact(item, key, depth + 1));
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, redact(childValue, childKey, depth + 1)]));
  }
  if (typeof value === "string") {
    const sanitized = sanitizeString(value);
    return sanitized.length > 500 ? `${sanitized.slice(0, 500)}…` : sanitized;
  }
  return value;
}

export function logEvent(level: LogLevel, event: string, context: Record<string, unknown> = {}) {
  const entry = JSON.stringify(redact({ timestamp: new Date().toISOString(), level, event, ...context }));
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}
