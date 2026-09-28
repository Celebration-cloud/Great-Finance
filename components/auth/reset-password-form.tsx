"use client";

import { useState, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { getNeonClient } from "@/lib/neon/client";
import { getAuthErrorMessage } from "@/lib/auth/client-errors";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Include at least one uppercase letter.")
      .regex(/[0-9]/, "Include at least one number."),
    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

export function ResetPasswordForm({ token: propToken }: { token?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = propToken || searchParams.get("token") || "";
  const queryError = searchParams.get("error");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(queryError);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordId = useId();
  const confirmPasswordId = useId();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const currentPassword = watch("password", "");

  const hasMinLength = currentPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(currentPassword);
  const hasNumber = /[0-9]/.test(currentPassword);

  const onSubmit = async (values: ResetValues) => {
    if (!token) {
      setServerError("Recovery token is missing. Please request a new recovery link.");
      return;
    }

    setServerError(null);

    try {
      const client = getNeonClient();
      const result = await client.auth.resetPassword({
        newPassword: values.password,
        token,
      });

      if (result.error) {
        const errorMsg = result.error.message || "";
        if (
          errorMsg.toLowerCase().includes("expired") ||
          errorMsg.toLowerCase().includes("invalid token")
        ) {
          setServerError(
            "This recovery link has expired or has already been used. Please request a new one."
          );
        } else {
          setServerError(getAuthErrorMessage(result.error.message, "reset-password"));
        }
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
      }, 1800);
    } catch (err) {
      setServerError(getAuthErrorMessage(err, "reset-password"));
    }
  };

  // If token is missing, show invalid link card
  if (!token && !isSuccess) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-display text-base font-bold text-amber-200">
                Invalid or Missing Recovery Token
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                This password reset link is missing a valid security token or has already expired. Password reset links expire 15 minutes after issuance.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/recovery"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 font-display text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all text-center"
            >
              <RotateCcw className="h-4 w-4" />
              Request New Recovery Link
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-mono font-bold text-white/80 hover:bg-white/10 transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-4 text-center">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="h-7 w-7" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-emerald-200">
            Password Changed Successfully!
          </h3>
          <p className="text-xs text-white/70 leading-relaxed">
            Your new credentials are now synced with Neon Auth and Neon DB. Redirecting you to sign in…
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <LoaderCircle className="h-5 w-5 animate-spin text-emerald-400" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* New Password */}
      <div className="space-y-2">
        <label
          htmlFor={passwordId}
          className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80"
        >
          New Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
          <input
            id={passwordId}
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••••••"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400 font-mono">{errors.password.message}</p>
        )}
      </div>

      {/* Password Requirements Checklist */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[0.72rem] font-mono space-y-1.5">
        <p className="text-white/50 uppercase tracking-wider text-[0.65rem] font-bold">Requirements</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-white/40"}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${hasMinLength ? "bg-emerald-400" : "bg-white/20"}`} />
            <span>8+ characters</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-400" : "text-white/40"}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${hasUppercase ? "bg-emerald-400" : "bg-white/20"}`} />
            <span>1 uppercase letter</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : "text-white/40"}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${hasNumber ? "bg-emerald-400" : "bg-white/20"}`} />
            <span>1 number</span>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor={confirmPasswordId}
          className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80"
        >
          Confirm New Password
        </label>
        <div className="relative">
          <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
          <input
            id={confirmPasswordId}
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••••••"
            disabled={isSubmitting}
            className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-400 font-mono">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3.5 space-y-2">
          <div className="flex items-start gap-2.5 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <span>{serverError}</span>
          </div>
          {serverError.includes("expired") && (
            <Link
              href="/recovery"
              className="inline-block text-xs font-mono font-bold text-amber-300 hover:underline pt-1"
            >
              Request a new password reset link →
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-display text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Updating Password…</span>
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            <span>Save & Set New Password</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
