import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { AuthPageReveal } from "@/components/auth/auth-page-reveal";

export default function ConfirmationPage() { return <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12"><AuthPageReveal><section className="card w-full p-9 text-center"><BadgeCheck className="mx-auto text-[var(--brand)]" size={44}/><h1 className="mt-5 text-3xl font-semibold">Registration successful</h1><p className="mt-3 text-[var(--muted)]">Your email has been confirmed. Continue to Login.</p><Link className="mt-7 inline-block rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white" href="/login">Login</Link></section></AuthPageReveal></main>; }
