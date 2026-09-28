import { hasAuthConfig } from "@/lib/env/server";
import { SignInForm } from "@/app/auth/sign-in/sign-in-form";
import { SovereignMark } from "@/components/brand/brand-logo";
import { ShieldCheck } from "lucide-react";
import { AnimatedContent } from "@/components/ui/animated-content";

export function AdminLoginCard() {
  return (
    <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12">
      <AnimatedContent className="w-full max-w-md" distance={18} scale={0.975}>
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] w-full p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Red-tinted accent border at top — signifies restricted access */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />

        <div className="flex items-center justify-between">
          <SovereignMark size={44} />
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-red-400 rounded-full border border-red-500/30 bg-red-950/20 px-3 py-1">
            ADMIN ONLY
          </span>
        </div>

        <div className="mt-6 flex items-center gap-2.5">
          <ShieldCheck size={18} className="text-red-400 shrink-0" />
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-red-400">
            Restricted Administration
          </p>
        </div>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          Admin Sign In
        </h1>

        <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
          Access is limited to authorised administrators. Accounts are provisioned by a Super Admin via an invitation link — self-registration is disabled.
        </p>

        <div className="mt-6">
          <SignInForm configured={hasAuthConfig()} redirectTo="/admin/dashboard" label="Sign in as Admin" />
        </div>

        {/* Deliberately no forgot password or register links */}
        <p className="mt-6 pt-5 border-t border-[var(--line)] text-center text-[0.7rem] font-mono text-[var(--muted)]">
          Lost access? Contact your Super Admin to issue a new invitation link.
        </p>
      </section>
      </AnimatedContent>
    </main>
  );
}
