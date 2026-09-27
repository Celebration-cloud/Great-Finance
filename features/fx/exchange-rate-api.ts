import { z } from "zod";

export const FX_PROVIDER_SOURCE = "exchange-rate-api-open";
export const FX_PROVIDER_ATTRIBUTION = {
  label: "Rates By Exchange Rate API",
  url: "https://www.exchangerate-api.com",
  usage: "indicative-only",
} as const;

export const MAX_STALE_FX_AGE_MS = 48 * 60 * 60_000;

export function canUseStaleFxRate(fetchedAt: Date, now = new Date()) {
  const age = now.getTime() - fetchedAt.getTime();
  return age >= 0 && age <= MAX_STALE_FX_AGE_MS;
}

const openExchangeRateResponseSchema = z.object({
  result: z.literal("success"),
  base_code: z.string().length(3),
  time_next_update_unix: z.number().int().positive(),
  rates: z.record(z.string(), z.number().positive()),
});

export function parseOpenExchangeRateResponse(payload: unknown, base: string, quote: string, now = new Date()) {
  const parsed = openExchangeRateResponseSchema.parse(payload);
  if (parsed.base_code !== base) throw new Error("FX_PROVIDER_BASE_MISMATCH");
  const rate = parsed.rates[quote];
  if (!rate) throw new Error("FX_RATE_UNAVAILABLE");

  const providerExpiry = new Date(parsed.time_next_update_unix * 1000);
  const fallbackExpiry = new Date(now.getTime() + 60 * 60_000);
  return {
    rate,
    expiresAt: providerExpiry > now ? providerExpiry : fallbackExpiry,
  };
}
