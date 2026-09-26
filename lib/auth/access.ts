import "server-only";
import { notFound } from "next/navigation";
import { requirePrincipal } from "./principal";
import type { Role } from "./permissions";

export async function requireRole(roles: readonly Role[]) {
  const principal = await requirePrincipal();
  if (!roles.includes(principal.role)) notFound();
  return principal;
}
