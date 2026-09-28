import Link from "next/link";
import { hasAuthConfig } from "@/lib/env/server";
import { SignInForm } from "@/app/auth/sign-in/sign-in-form";
import { SovereignMark } from "@/components/brand/brand-logo";

export function LoginCard({
  title,
  eyebrow,
  redirectTo,
  signupHref,
}: {
  title: string;
  eyebrow: string;
  redirectTo: string;
  signupHref: string;
}) {
  return (
    <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12">
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] w-full max-w-md p-8 sm:p-10 shadow-2xl relative overflow-hidden">
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
    </main>
  );
}

