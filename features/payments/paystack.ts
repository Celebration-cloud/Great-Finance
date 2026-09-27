import "server-only";
import { AppError, errors } from "@/lib/errors/app-error";
import { paystackVerificationSchema } from "./schemas";
export { hashWebhook, verifyPaystackSignature } from "./paystack-signature";

const PAYSTACK_API = "https://api.paystack.co";

async function paystackRequest<T>(path: string, secret: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${PAYSTACK_API}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (response.status === 429) throw new AppError("RATE_LIMITED", { status: 503, message: "The payment provider is busy. Please try again.", retryable: true, report: "warn" });
    if (!response.ok) throw errors.providerUnavailable("The payment provider is temporarily unavailable.");
    try {
      return await response.json() as T;
    } catch (cause) {
      throw errors.providerUnavailable("The payment provider returned an invalid response.", cause);
    }
  } catch (cause) {
    if (cause instanceof AppError) throw cause;
    if (cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError")) {
      throw new AppError("PROVIDER_TIMEOUT", { status: 503, message: "The payment provider timed out. Your payment has not been assumed successful.", retryable: true, cause });
    }
    throw errors.providerUnavailable("The payment provider is temporarily unavailable.", cause);
  }
}

export async function initializePaystackTransaction(input: { email: string; amountMinor: number; currency: string; reference: string; callbackUrl: string }, secret: string) {
  return paystackRequest<{ status: boolean; message: string; data: { authorization_url: string; access_code: string; reference: string } }>("/transaction/initialize", secret, {
    method: "POST",
    body: JSON.stringify({ email: input.email, amount: input.amountMinor, currency: input.currency, reference: input.reference, callback_url: input.callbackUrl }),
  });
}

export async function verifyPaystackTransaction(reference: string, secret: string) {
  const payload = await paystackRequest<unknown>(`/transaction/verify/${encodeURIComponent(reference)}`, secret);
  const parsed = paystackVerificationSchema.safeParse(payload);
  if (!parsed.success) throw errors.providerUnavailable("The payment provider returned an invalid verification response.", parsed.error);
  return parsed.data;
}
