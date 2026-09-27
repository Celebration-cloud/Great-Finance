import { randomBytes } from "node:crypto";

/**
 * Generates a unique, human-readable coupon code.
 * Format: GF-{PLAN_ABBR}-{8 uppercase alphanumeric chars}
 * Example: GF-BASIC-K4ZX8PRQ
 */
export function generateCouponCode(planName: string): string {
  const abbr = planName
    .replace(/\s+/g, "")
    .slice(0, 6)
    .toUpperCase();
  const suffix = randomBytes(5).toString("base64url").slice(0, 8).toUpperCase();
  return `GF-${abbr}-${suffix}`;
}

/**
 * Generates N unique coupon codes for a plan.
 * Codes within the batch are deduplicated on the chance of collision.
 */
export function generateCouponCodes(planName: string, quantity: number): string[] {
  const codes = new Set<string>();
  while (codes.size < quantity) {
    codes.add(generateCouponCode(planName));
  }
  return [...codes];
}
