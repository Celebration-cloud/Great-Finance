export const ROLES = ["CUSTOMER", "VENDOR", "REVIEWER", "ADMIN", "SUPER_ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "payment:create", "payment:read", "vendor:read", "approval:request",
  "approval:review", "ledger:read", "ledger:post", "admin:manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const grants: Record<Role, ReadonlySet<Permission>> = {
  CUSTOMER: new Set(["payment:create", "payment:read"]),
  VENDOR: new Set(["payment:read", "vendor:read", "approval:request"]),
  REVIEWER: new Set(["payment:read", "vendor:read", "approval:review", "ledger:read"]),
  ADMIN: new Set(["payment:read", "vendor:read", "approval:request", "approval:review", "ledger:read", "ledger:post"]),
  SUPER_ADMIN: new Set(PERMISSIONS),
};

export function can(role: Role, permission: Permission) {
  return grants[role].has(permission);
}

export function assertPermission(role: Role, permission: Permission) {
  if (!can(role, permission)) throw new Error("FORBIDDEN");
}

export function canReviewOwnRequest(requestedBy: string, reviewerId: string) {
  return requestedBy !== reviewerId;
}
