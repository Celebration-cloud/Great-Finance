"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registrationSchema, type RegistrationValues } from "@/features/onboarding/schemas";
import { getNeonClient } from "@/lib/neon/client";

export function RegistrationForm({ accountType, configured }: { accountType: "CUSTOMER" | "VENDOR"; configured: boolean }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegistrationValues>({ resolver: zodResolver(registrationSchema), defaultValues: { accountType } });
  const submit = handleSubmit(async (values) => {
    setServerError(undefined);
    const signup = await getNeonClient().auth.signUp.email({ email: values.email, password: values.password, name: values.fullName, callbackURL: accountType === "VENDOR" ? "/vendor/dashboard" : "/dashboard" });
    if (signup.error) return setServerError(signup.error.message ?? "Registration failed.");
    const response = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json() as { message?: string };
    if (!response.ok) return setServerError(result.message ?? "Account created, but profile setup needs attention. Sign in to continue.");
    router.push(accountType === "VENDOR" ? "/vendor/dashboard" : "/dashboard");
    router.refresh();
  });
  const fieldClass = "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3";
  return <form className="mt-7 grid gap-4" onSubmit={submit} noValidate>
    <input type="hidden" {...register("accountType")} />
    <label className="grid gap-2 text-sm font-bold">{accountType === "VENDOR" ? "Full name" : "Name"}<input className={fieldClass} placeholder={accountType === "VENDOR" ? "Enter first and last name" : "Enter first name"} {...register("fullName")}/>{errors.fullName && <span className="font-normal text-[var(--danger)]">{errors.fullName.message}</span>}</label>
    <label className="grid gap-2 text-sm font-bold">Email address<input className={fieldClass} type="email" autoComplete="email" placeholder="Enter email address" {...register("email")}/>{errors.email && <span className="font-normal text-[var(--danger)]">{errors.email.message}</span>}</label>
    <label className="grid gap-2 text-sm font-bold">{accountType === "VENDOR" ? "Active WhatsApp number" : "Phone number"}<input className={fieldClass} inputMode="numeric" autoComplete="tel" placeholder="Enter phone number" {...register("phone")}/>{errors.phone && <span className="font-normal text-[var(--danger)]">Enter 10–15 digits.</span>}</label>
    {accountType === "CUSTOMER" && <><label className="grid gap-2 text-sm font-bold">Bank<select className={fieldClass} {...register("bankName")}><option value="">Search bank</option><option>Opay</option><option>Kuda Bank</option><option>First Bank</option><option>GTBank</option><option>UBA</option><option>Union Bank</option><option>Zenith Bank</option></select></label><label className="grid gap-2 text-sm font-bold">Account number<input className={fieldClass} inputMode="numeric" maxLength={10} placeholder="Enter account number" {...register("accountNumber")}/><span className="font-normal text-[var(--muted)]">Only the last four digits are retained.</span></label><label className="grid gap-2 text-sm font-bold">Referral code <span className="font-normal text-[var(--muted)]">Optional</span><input className={fieldClass} placeholder="Enter referral code" {...register("referralCode")}/></label></>}
    <label className="grid gap-2 text-sm font-bold">Password<input className={fieldClass} type="password" autoComplete="new-password" placeholder="Enter a password" {...register("password")}/>{errors.password && <span className="font-normal text-[var(--danger)]">{errors.password.message}</span>}</label>
    {!configured && <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">Registration is disabled until Neon Auth and the database are configured.</p>}
    {serverError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{serverError}</p>}
    <button disabled={!configured || isSubmitting} className="mt-2 flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-50">{isSubmitting ? <LoaderCircle className="animate-spin"/> : "Sign up"}</button>
  </form>;
}
