"use client";

import { useState } from "react";
import { getNeonClient } from "@/lib/neon/client";

export function RecoveryForm({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("sending");
    const result = await getNeonClient().auth.requestPasswordReset({ email, redirectTo: "/auth/reset-password" });
    setState(result.error ? "error" : "sent");
  };
  return <form className="mt-7 grid gap-5" onSubmit={submit}><label className="grid gap-2 text-sm font-bold">Email address<input className="rounded-xl border border-[var(--line)] bg-white px-4 py-3" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address"/></label><button className="rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-50" disabled={!configured || state === "sending"}>{state === "sending" ? "Sending…" : "Proceed"}</button>{state === "sent" && <p role="status" className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Check your email. Use the recovery link to change your password.</p>}{state === "error" && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">We could not send the recovery email. Try again.</p>}<button type="button" className="text-sm font-bold text-[var(--brand)]" onClick={submit}>Didn’t receive recovery email? Resend</button></form>;
}
