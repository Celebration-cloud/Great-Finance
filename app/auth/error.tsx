"use client";

import { RefreshCw, ShieldAlert } from "lucide-react";
import { AnimatedContent } from "@/components/ui/animated-content";

export default function AuthErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-16">
    <AnimatedContent className="w-full" distance={18} scale={0.975}>
    <section className="card w-full p-8 text-center" role="alert">
      <ShieldAlert className="mx-auto text-[var(--danger)]" size={36}/>
      <h1 className="mt-5 text-2xl font-bold">Authentication is temporarily unavailable</h1>
      <p className="mt-3 text-[var(--muted)]">Your credentials were not changed. Wait a moment and retry securely.</p>
      <button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white" onClick={reset}><RefreshCw size={18}/>Retry</button>
    </section>
    </AnimatedContent>
  </main>;
}
