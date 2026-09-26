"use client";

import { createAuthClient } from "@neondatabase/auth/next";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const auth = createAuthClient();

export function SignOutButton() {
  const router = useRouter();
  return <button className="mt-3 flex w-full items-center gap-3 rounded-lg border-t border-[var(--line)] px-3 py-3 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]" onClick={async () => { await auth.signOut(); router.push("/"); router.refresh(); }}><LogOut size={18}/> Sign out</button>;
}
