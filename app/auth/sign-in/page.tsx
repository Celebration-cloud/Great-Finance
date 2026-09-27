import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { hasAuthConfig } from "@/lib/env/server";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <main className="shell grid min-h-[calc(100vh-73px)] place-items-center py-12"><section className="card w-full max-w-md p-7 sm:p-9"><span className="grid size-12 place-items-center rounded-xl bg-[var(--surface-inverse)] text-[var(--accent)]"><ShieldCheck /></span><p className="eyebrow mt-7">Protected workspace</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.03em]">Welcome back</h1><p className="mt-3 leading-7 text-[var(--muted)]">Your role and organization are checked on the server before financial data is loaded.</p><SignInForm configured={hasAuthConfig()} /></section></main>;
}
