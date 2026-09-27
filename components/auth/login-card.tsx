import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { hasAuthConfig } from "@/lib/env/server";
import { SignInForm } from "@/app/auth/sign-in/sign-in-form";

export function LoginCard({ title, eyebrow, redirectTo, signupHref }: { title: string; eyebrow: string; redirectTo: string; signupHref: string }) {
  return <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12"><section className="card w-full max-w-md p-7 sm:p-9"><span className="grid size-12 place-items-center rounded-xl bg-[var(--surface-inverse)] text-[var(--accent)]"><ShieldCheck /></span><p className="eyebrow mt-7">{eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.03em]">{title}</h1><SignInForm configured={hasAuthConfig()} redirectTo={redirectTo} label="Sign in"/><div className="mt-5 flex justify-between gap-4 text-sm"><Link className="text-[var(--brand)]" href="/recovery">Forgot your password?</Link><span className="text-[var(--muted)]">No account? <Link className="font-bold text-[var(--brand)]" href={signupHref}>Register</Link></span></div></section></main>;
}
