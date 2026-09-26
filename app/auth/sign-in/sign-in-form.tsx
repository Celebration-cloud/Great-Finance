"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { getNeonClient } from "@/lib/neon/client";

const schema = z.object({ email: z.string().email("Enter a valid email."), password: z.string().min(8, "Use at least 8 characters.") });
type Values = z.infer<typeof schema>;

export function SignInForm({ configured, redirectTo = "/dashboard", label = "Sign in securely" }: { configured: boolean; redirectTo?: string; label?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema) });
  const submit = handleSubmit(async (values) => {
    setServerError(undefined);
    const result = await getNeonClient().auth.signIn.email({ ...values, callbackURL: redirectTo });
    if (result.error) return setServerError(result.error.message ?? "Sign in failed.");
    router.push(redirectTo);
    router.refresh();
  });

  return <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
    <div><label className="mb-2 block text-sm font-bold" htmlFor="email">Email address</label><input className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3" id="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register("email")} />{errors.email && <p className="mt-2 text-sm text-[var(--danger)]">{errors.email.message}</p>}</div>
    <div><label className="mb-2 block text-sm font-bold" htmlFor="password">Password</label><input className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3" id="password" type="password" autoComplete="current-password" aria-invalid={Boolean(errors.password)} {...register("password")} />{errors.password && <p className="mt-2 text-sm text-[var(--danger)]">{errors.password.message}</p>}</div>
    {!configured && <p role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">Authentication is safely disabled until the Neon Auth environment values are configured.</p>}
    {serverError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{serverError}</p>}
    <button disabled={!configured || isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? <LoaderCircle className="animate-spin" size={18}/> : <>{label} <ArrowRight size={18}/></>}</button>
  </form>;
}
