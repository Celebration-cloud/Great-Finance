export const ROLES = ["CUSTOMER", "VENDOR", "REVIEWER", "ADMIN", "SUPER_ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "payment:create", "payment:read", "vendor:read", "approval:request",
  "approval:review", "ledger:read", "ledger:post", "admin:manage",
  "investment:create", "investment:read", "coupon:create", "coupon:read",
  "withdrawal:request", "withdrawal:process",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const grants: Record<Role, ReadonlySet<Permission>> = {
  CUSTOMER: new Set(["payment:create", "payment:read", "investment:create", "investment:read", "coupon:read", "withdrawal:request"]),
  VENDOR: new Set(["payment:create", "payment:read", "vendor:read", "approval:request", "coupon:create", "coupon:read"]),
  REVIEWER: new Set(["payment:read", "vendor:read", "approval:review", "ledger:read", "investment:read", "coupon:read", "withdrawal:process"]),
  ADMIN: new Set(["payment:create", "payment:read", "vendor:read", "approval:request", "approval:review", "ledger:read", "ledger:post", "investment:read", "coupon:read", "withdrawal:process"]),
  SUPER_ADMIN: new Set(PERMISSIONS),
};

export function can(role: Role, permission: Permission) {
  return grants[role].has(permission);
}

export function assertPermission(role: Role, permission: Permission) {
  if (!can(role, permission)) throw errors.forbidden();
}

export function canReviewOwnRequest(requestedBy: string, reviewerId: string) {
  return requestedBy !== reviewerId;
}
import { errors } from "../errors/app-error.ts";
