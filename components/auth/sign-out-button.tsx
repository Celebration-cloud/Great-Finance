"use client";

import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getNeonClient } from "@/lib/neon/client";
import { cn } from "@/lib/utils";

export function SignOutButton({ tone = "default" }: { tone?: "default" | "inverse" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await getNeonClient().auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      // In case of error, still route to home to reset state
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      className={cn(
        "mt-3 flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition disabled:opacity-50",
        tone === "inverse"
          ? "text-white/70 hover:bg-white/10 hover:text-white"
          : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
      )}
      onClick={handleSignOut}
    >
      {loading ? (
        <LoaderCircle aria-hidden="true" size={18} className="animate-spin text-current" />
      ) : (
        <LogOut aria-hidden="true" size={18} />
      )}
      <span>{loading ? "Signing out..." : "Sign out"}</span>
    </button>
  );
}
