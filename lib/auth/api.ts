import "server-only";

import type { Principal } from "./principal";
import { getPrincipal } from "./principal";
import type { Permission, Role } from "./permissions";
import { can } from "./permissions";
import { errors } from "@/lib/errors/app-error";
import { getServerSessionData } from "./session";

export async function requireAuthUser(message = "Authentication required.") {
  const data = await getServerSessionData();
  if (!data?.user) throw errors.authenticationRequired(message);
  if (!data.user.id || !data.user.email) throw errors.invalidSession();
  return { id: data.user.id, email: data.user.email };
}

export async function requireApiPrincipal() {
  const principal = await getPrincipal();
  if (!principal) throw errors.authenticationRequired();
  return principal;
}

export function requireApiPermission(principal: Principal, permission: Permission) {
  if (!can(principal.role, permission)) throw errors.forbidden();
}

export function requireApiRole(principal: Principal, roles: readonly Role[], message?: string) {
  if (!roles.includes(principal.role)) throw errors.forbidden(message);
}
