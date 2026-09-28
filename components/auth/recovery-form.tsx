"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, LoaderCircle, Mail, AlertTriangle, ShieldCheck } from "lucide-react";
import { getNeonClient } from "@/lib/neon/client";

const recoverySchema = z.object({
  email: z.string().email("Enter a valid email address.").toLowerCase().trim(),
});

type RecoveryValues = z.infer<typeof recoverySchema>;

export function RecoveryForm({ configured }: { configured: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryValues>({
    resolver: zodResolver(recoverySchema),
  });

  // Handle countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendRecovery = async (values: RecoveryValues) => {
    setStatus("sending");
    setErrorMessage(undefined);

    try {
      // 1. Send request to synced server recovery API (with rate limiting & audit)
      const res = await fetch("/api/auth/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        const retryAfter = Number(res.headers.get("Retry-After")) || 60;
        setCooldown(retryAfter);
        setStatus("error");
        setErrorMessage(
          data.error?.message ??
            `Too many recovery attempts. Please wait ${retryAfter} seconds before requesting again.`
        );
        return;
      }

      if (!res.ok) {
        // Fallback to client-side Neon Auth client directly
        const client = getNeonClient();
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const result = await client.auth.requestPasswordReset({
          email: values.email,
          redirectTo: `${origin}/auth/reset-password`,
        });

        if (result.error) {
          setStatus("error");
          setErrorMessage(result.error.message ?? "Could not send recovery email. Please try again.");
          return;
        }
      }

      setStatus("sent");
      setCooldown(60); // 60s cooldown before next allowed resend
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please check your internet connection.");
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    const currentEmail = getValues("email");
    if (!currentEmail) return;
    sendRecovery({ email: currentEmail });
  };

  return (
    <div className="space-y-6">
      {status === "sent" ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-display text-base font-bold text-emerald-200">
                Recovery Link Dispatched
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                If an account exists for <strong className="text-white">{getValues("email")}</strong>, we have sent a secure password reset link.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60 space-y-2">
            <div className="flex items-center gap-2 text-white/80 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Link expires in 15 minutes for your security.</span>
            </div>
            <p>
              Be sure to check your spam or promotional folders if the email does not appear in your inbox shortly.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isSubmitting}
              className="w-full sm:w-auto text-xs font-mono font-bold text-amber-300 hover:text-amber-200 disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
            >
              {cooldown > 0 ? `Resend email in ${cooldown}s` : "Didn’t receive it? Resend link"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setErrorMessage(undefined);
              }}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              Use a different email
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(sendRecovery)} className="space-y-5" noValidate>
          <div className="space-y-2">
            <label htmlFor="recovery-email" className="block text-xs font-mono font-bold uppercase tracking-wider text-white/80">
              Account Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                disabled={!configured || isSubmitting}
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 font-mono mt-1">{errors.email.message}</p>
            )}
          </div>

          {!configured && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300">
              Authentication services are currently in maintenance. Please contact system administrator.
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/20 p-3.5 text-xs text-red-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!configured || isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 font-display text-sm font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting || status === "sending" ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Sending Recovery Email…</span>
              </>
            ) : (
              <>
                <span>Send Recovery Instructions</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
