import Link from "next/link";
import { hasAuthConfig } from "@/lib/env/server";
import { SignInForm } from "@/app/auth/sign-in/sign-in-form";
import { SovereignMark } from "@/components/brand/brand-logo";
import { AnimatedContent } from "@/components/ui/animated-content";
import { CheckCircle2 } from "lucide-react";

export function LoginCard({
  title,
  eyebrow,
  redirectTo,
  signupHref,
  resetSuccess,
}: {
  title: string;
  eyebrow: string;
  redirectTo: string;
  signupHref: string;
  resetSuccess?: boolean;
}) {
  return (
    <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12">
      <AnimatedContent className="w-full max-w-md" distance={18} scale={0.975}>
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] w-full p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle accent border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

        <div className="flex items-center justify-between">
          <SovereignMark size={44} />
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-emerald-400 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1">
            SECURE VAULT
          </span>
        </div>

        <p className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mt-6">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          {title}
        </h1>

        {resetSuccess && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Password successfully changed. Sign in with your new credentials.</span>
          </div>
        )}

        <div className="mt-6">
          <SignInForm configured={hasAuthConfig()} redirectTo={redirectTo} label="Sign in" />
        </div>

        <div className="mt-6 pt-5 border-t border-[var(--line)] flex justify-between gap-4 text-xs font-mono">
          <Link className="text-emerald-400 hover:underline" href="/recovery">
            Forgot password?
          </Link>
          <span className="text-[var(--muted)]">
            No account?{" "}
            <Link className="font-bold text-amber-300 hover:underline" href={signupHref}>
              Register
            </Link>
          </span>
        </div>
      </section>
      </AnimatedContent>
    </main>
  );
}
