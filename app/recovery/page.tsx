import Link from "next/link";
import { RecoveryForm } from "@/components/auth/recovery-form";
import { hasAuthConfig } from "@/lib/env/server";
import { SovereignMark } from "@/components/brand/brand-logo";
import { AnimatedContent } from "@/components/ui/animated-content";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Password Recovery | Great Finance",
  description:
    "Reset your account password securely. Enter your registered email address to receive password recovery instructions.",
};

export default function RecoveryPage() {
  return (
    <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12">
      <AnimatedContent className="w-full max-w-md" distance={18} scale={0.975}>
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] w-full p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle accent border at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />

          <div className="flex items-center justify-between">
            <SovereignMark size={44} />
            <span className="font-mono text-[0.68rem] font-bold uppercase tracking-widest text-emerald-400 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 flex items-center gap-1.5">
              <Shield size={12} />
              CREDENTIAL RECOVERY
            </span>
          </div>

          <p className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mt-6">
            Account Security
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[var(--ink)]">
            Password Recovery
          </h1>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">
            Enter your registered email address below. We will send you an encrypted single-use link to choose a new password.
          </p>

          <div className="mt-6">
            <RecoveryForm configured={hasAuthConfig()} />
          </div>

          <div className="mt-8 pt-5 border-t border-[var(--line)] flex justify-between items-center text-xs font-mono">
            <Link
              className="flex items-center gap-1.5 text-emerald-400 hover:underline font-bold"
              href="/login"
            >
              <ArrowLeft size={13} />
              Back to Login
            </Link>
            <span className="text-[var(--muted)]">
              Need help?{" "}
              <Link className="text-amber-300 hover:underline" href="/contact">
                Support
              </Link>
            </span>
          </div>
        </section>
      </AnimatedContent>
    </main>
  );
}
