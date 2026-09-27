"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AppErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-5 py-16">
    <section className="card w-full p-8 text-center" role="alert">
      <AlertTriangle className="mx-auto text-[var(--danger)]" size={36}/>
      <h1 className="mt-5 text-2xl font-bold">We couldn’t complete that request</h1>
      <p className="mt-3 text-[var(--muted)]">No financial action is assumed successful. Try again, or sign in again if your session has expired.</p>
      {error.digest && <p className="mt-3 font-mono text-xs text-[var(--muted)]">Reference: {error.digest}</p>}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white" onClick={reset}><RotateCcw size={18}/>Try again</button>
        <Link className="rounded-xl border border-[var(--line)] px-5 py-3 font-bold" href="/auth/sign-in">Sign in</Link>
      </div>
    </section>
  </main>;
}
