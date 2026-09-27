import "server-only";
import { getPrisma } from "@/lib/db";
import { FX_PROVIDER_ATTRIBUTION, FX_PROVIDER_SOURCE, parseOpenExchangeRateResponse } from "./exchange-rate-api";

const DEFAULT_FX_API_BASE_URL = "https://open.er-api.com/v6/";

export async function getFxRate(baseInput: string, quoteInput: string) {
  const base = baseInput.toUpperCase();
  const quote = quoteInput.toUpperCase();
  if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(quote)) throw new Error("INVALID_CURRENCY");
  if (base === quote) return { base, quote, rate: "1", source: "identity", expiresAt: new Date(Date.now() + 86_400_000), attribution: FX_PROVIDER_ATTRIBUTION };
  const db = getPrisma();
  const cached = await db.fxRate.findFirst({ where: { base, quote, source: FX_PROVIDER_SOURCE, expiresAt: { gt: new Date() } }, orderBy: { fetchedAt: "desc" } });
  if (cached) return { ...cached, rate: cached.rate.toString(), attribution: FX_PROVIDER_ATTRIBUTION };
  const apiBase = process.env.FX_API_BASE_URL ?? DEFAULT_FX_API_BASE_URL;
  const url = new URL(`latest/${base}`, apiBase.endsWith("/") ? apiBase : `${apiBase}/`);
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error("FX_PROVIDER_FAILED");
  const { rate, expiresAt } = parseOpenExchangeRateResponse(await response.json(), base, quote);
  const saved = await db.fxRate.upsert({ where: { base_quote_source: { base, quote, source: FX_PROVIDER_SOURCE } }, create: { base, quote, rate, source: FX_PROVIDER_SOURCE, expiresAt }, update: { rate, fetchedAt: new Date(), expiresAt } });
  return { ...saved, rate: saved.rate.toString(), attribution: FX_PROVIDER_ATTRIBUTION };
}
