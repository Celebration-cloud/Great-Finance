import "server-only";
import { getPrisma } from "@/lib/db";
import { errors } from "@/lib/errors/app-error";
import { canUseStaleFxRate, FX_PROVIDER_ATTRIBUTION, FX_PROVIDER_SOURCE, parseOpenExchangeRateResponse } from "./exchange-rate-api";

const DEFAULT_FX_API_BASE_URL = "https://open.er-api.com/v6/";

export async function getFxRate(baseInput: string, quoteInput: string) {
  const base = baseInput.toUpperCase();
  const quote = quoteInput.toUpperCase();
  if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(quote)) throw errors.validation("Use valid three-letter currency codes.");
  if (base === quote) return { base, quote, rate: "1", source: "identity", expiresAt: new Date(Date.now() + 86_400_000), stale: false, attribution: FX_PROVIDER_ATTRIBUTION };
  const db = getPrisma();
  const now = new Date();
  const cached = await db.fxRate.findUnique({ where: { base_quote_source: { base, quote, source: FX_PROVIDER_SOURCE } } });
  if (cached && cached.expiresAt > now) return { ...cached, rate: cached.rate.toString(), stale: false, attribution: FX_PROVIDER_ATTRIBUTION };
  const apiBase = process.env.FX_API_BASE_URL ?? DEFAULT_FX_API_BASE_URL;
  const url = new URL(`latest/${base}`, apiBase.endsWith("/") ? apiBase : `${apiBase}/`);
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`FX provider returned ${response.status}.`);
    const { rate, expiresAt } = parseOpenExchangeRateResponse(await response.json(), base, quote, now);
    const saved = await db.fxRate.upsert({ where: { base_quote_source: { base, quote, source: FX_PROVIDER_SOURCE } }, create: { base, quote, rate, source: FX_PROVIDER_SOURCE, expiresAt }, update: { rate, fetchedAt: now, expiresAt } });
    return { ...saved, rate: saved.rate.toString(), stale: false, attribution: FX_PROVIDER_ATTRIBUTION };
  } catch (cause) {
    if (cached && canUseStaleFxRate(cached.fetchedAt, now)) {
      return { ...cached, rate: cached.rate.toString(), stale: true, attribution: FX_PROVIDER_ATTRIBUTION };
    }
    throw errors.providerUnavailable("FX rates are temporarily unavailable.", cause);
  }
}
