"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registrationSchema, type RegistrationValues } from "@/features/onboarding/schemas";
import { getNeonClient } from "@/lib/neon/client";
import { getAuthErrorMessage } from "@/lib/auth/client-errors";
import { useApiMutation } from "@/hooks/use-api-mutation";

export function RegistrationForm({ accountType, configured }: { accountType: "CUSTOMER" | "VENDOR"; configured: boolean }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({ resolver: zodResolver(registrationSchema), defaultValues: { accountType } });

  const { mutate, error: serverError } = useApiMutation<unknown, RegistrationValues>(
    "/api/onboarding",
    {
      successMessage: false, // redirect is the success UX — no toast needed
      errorMessage: false,   // shown inline so users see it near the form
      setError,              // wires server fieldErrors back to RHF fields
      onSuccess() {
        router.push(accountType === "VENDOR" ? "/vendor/dashboard" : "/dashboard");
        router.refresh();
      },
    },
  );

  const submit = handleSubmit(async (values) => {
    // Step 1 — auth sign-up (Neon Auth).
    const signup = await getNeonClient().auth.signUp.email({
      email: values.email,
      password: values.password,
      name: values.fullName,
      callbackURL: accountType === "VENDOR" ? "/vendor/dashboard" : "/dashboard",
    });
    if (signup.error) {
      setError("root", { message: getAuthErrorMessage(signup.error.message, "sign-up") });
      return;
    }

    // Step 2 — profile provisioning (our API).
    await mutate(values);
  });

  const fieldClass = "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3";
  return (
    <form className="mt-7 grid gap-4" onSubmit={submit} noValidate>
      <input type="hidden" {...register("accountType")} />

      <label className="grid gap-2 text-sm font-bold">
        {accountType === "VENDOR" ? "Full name" : "Name"}
        <input className={fieldClass} placeholder={accountType === "VENDOR" ? "Enter first and last name" : "Enter first name"} {...register("fullName")} />
        {errors.fullName && <span className="font-normal text-[var(--danger)]">{errors.fullName.message}</span>}
      </label>

      <label className="grid gap-2 text-sm font-bold">
        Email address
        <input className={fieldClass} type="email" autoComplete="email" placeholder="Enter email address" {...register("email")} />
        {errors.email && <span className="font-normal text-[var(--danger)]">{errors.email.message}</span>}
      </label>

      <label className="grid gap-2 text-sm font-bold">
        {accountType === "VENDOR" ? "Active WhatsApp number" : "Phone number"}
        <input className={fieldClass} inputMode="numeric" autoComplete="tel" placeholder="Enter phone number" {...register("phone")} />
        {errors.phone && <span className="font-normal text-[var(--danger)]">Enter 10–15 digits.</span>}
      </label>

      {accountType === "CUSTOMER" && (
        <>
          <label className="grid gap-2 text-sm font-bold">
            Bank
            <select className={fieldClass} {...register("bankName")}>
              <option value="">Search bank</option>
              <option>Opay</option><option>Kuda Bank</option><option>First Bank</option>
              <option>GTBank</option><option>UBA</option><option>Union Bank</option>
              <option>Zenith Bank</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Account number
            <input className={fieldClass} inputMode="numeric" maxLength={10} placeholder="Enter account number" {...register("accountNumber")} />
            <span className="font-normal text-[var(--muted)]">Only the last four digits are retained.</span>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Referral code <span className="font-normal text-[var(--muted)]">Optional</span>
            <input className={fieldClass} placeholder="Enter referral code" {...register("referralCode")} />
          </label>
        </>
      )}

      <label className="grid gap-2 text-sm font-bold">
        Password
        <input className={fieldClass} type="password" autoComplete="new-password" placeholder="Enter a password" {...register("password")} />
        {errors.password && <span className="font-normal text-[var(--danger)]">{errors.password.message}</span>}
      </label>

      {!configured && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Registration is disabled until Neon Auth and the database are configured.
        </p>
      )}

      {/* Root-level server error (auth failure or API error not tied to a specific field) */}
      {(errors.root || serverError) && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {errors.root?.message ?? serverError?.message}
        </p>
      )}

      <button
        disabled={!configured || isSubmitting}
        className="mt-2 flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-50"
      >
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : "Sign up"}
      </button>
    </form>
  );
}
