import "server-only";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db";
import { getAuth } from "./server";
import type { Role } from "./permissions";

export type Principal = { userId: string; email: string; organizationId: string; role: Role };

export async function getPrincipal(): Promise<Principal | null> {
  const { data } = await getAuth().getSession();
  const user = data?.user;
  if (!user?.id || !user.email) return null;
  const membership = await getPrisma().membership.findFirst({
    where: { authUserId: user.id, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) return null;
  return { userId: user.id, email: user.email, organizationId: membership.organizationId, role: membership.role };
}

export async function requirePrincipal() {
  const principal = await getPrincipal();
  if (!principal) redirect("/auth/sign-in");
  return principal;
}
