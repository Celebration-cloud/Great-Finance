import Link from "next/link";
import { RegistrationForm } from "@/components/auth/registration-form";
import { hasAuthConfig, hasDatabaseConfig } from "@/lib/env/server";

export default function SignupPage() {
  return <main className="shell grid place-items-center py-12"><section className="card w-full max-w-xl p-7 sm:p-9"><p className="eyebrow">Customer account</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.03em]">Register</h1><RegistrationForm accountType="CUSTOMER" configured={hasAuthConfig() && hasDatabaseConfig()}/><p className="mt-5 text-center text-sm text-[var(--muted)]">Already have an account? <Link className="font-bold text-[var(--brand)]" href="/auth/sign-in">Login</Link></p></section></main>;
}
