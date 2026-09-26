import "server-only";
import { paystackVerificationSchema } from "./schemas";
export { hashWebhook, verifyPaystackSignature } from "./paystack-signature";

const PAYSTACK_API = "https://api.paystack.co";

async function paystackRequest<T>(path: string, secret: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  const payload: unknown = await response.json();
  if (!response.ok) throw new Error(`Paystack request failed with status ${response.status}.`);
  return payload as T;
}

export async function initializePaystackTransaction(input: { email: string; amountMinor: number; currency: string; reference: string; callbackUrl: string }, secret: string) {
  return paystackRequest<{ status: boolean; message: string; data: { authorization_url: string; access_code: string; reference: string } }>("/transaction/initialize", secret, {
    method: "POST",
    body: JSON.stringify({ email: input.email, amount: input.amountMinor, currency: input.currency, reference: input.reference, callback_url: input.callbackUrl }),
  });
}

export async function verifyPaystackTransaction(reference: string, secret: string) {
  const payload = await paystackRequest<unknown>(`/transaction/verify/${encodeURIComponent(reference)}`, secret);
  return paystackVerificationSchema.parse(payload);
}
