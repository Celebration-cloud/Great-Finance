"use client";

import { createAuthClient } from "@neondatabase/auth/next";
import { useRouter } from "next/navigation";
import { useState } from "react";

const auth = createAuthClient();

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>();
  return <form className="mt-7 grid gap-5" onSubmit={async (event) => { event.preventDefault(); if (!token) return setMessage("This recovery link is missing its token."); const result = await auth.resetPassword({ newPassword: password, token }); if (result.error) return setMessage(result.error.message ?? "Password reset failed."); router.push("/login"); }}><label className="grid gap-2 text-sm font-bold">New password<input className="rounded-xl border border-[var(--line)] px-4 py-3" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password"/></label><button className="rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white">Change password</button>{message && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{message}</p>}</form>;
}
