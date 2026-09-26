import Link from "next/link";
import { RecoveryForm } from "@/components/auth/recovery-form";
import { hasAuthConfig } from "@/lib/env/server";

export default function RecoveryPage() { return <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12"><section className="card w-full max-w-md p-7 sm:p-9"><p className="eyebrow">Account access</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.03em]">Password Recovery</h1><p className="mt-4 leading-7 text-[var(--muted)]">Enter your email address in the space below, a recovery email will be sent to your email address, click on the link sent to your email inorder to change your password.</p><RecoveryForm configured={hasAuthConfig()}/><Link className="mt-5 block text-center text-sm font-bold text-[var(--brand)]" href="/login">Back to Login</Link></section></main>; }
