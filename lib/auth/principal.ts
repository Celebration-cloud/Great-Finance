import "server-only";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { getServerSessionData } from "./session";
import type { Role } from "./permissions";

export type Principal = { userId: string; email: string; organizationId: string; role: Role };

export async function getPrincipal(): Promise<Principal | null> {
  const data = await getServerSessionData();
  const user = data?.user;
  if (!user) return null;
  if (!user.id || !user.email) throw errors.invalidSession();
  const membership = await getPrisma().membership.findFirst({
    where: { authUserId: user.id },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) throw errors.accountNotProvisioned();
  if (membership.status === "SUSPENDED") throw errors.accountSuspended();
  if (membership.status !== "ACTIVE") throw errors.accountNotProvisioned();
  return { userId: user.id, email: user.email, organizationId: membership.organizationId, role: membership.role };
}

export async function requirePrincipal() {
  const principal = await getPrincipal();
  if (!principal) redirect("/auth/sign-in");
  return principal;
}
