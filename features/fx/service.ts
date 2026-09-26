import "server-only";
import { z } from "zod";
import { getPrisma } from "@/lib/db";

const responseSchema = z.object({ rates: z.record(z.string(), z.number().positive()) });

export async function getFxRate(baseInput: string, quoteInput: string) {
  const base = baseInput.toUpperCase();
  const quote = quoteInput.toUpperCase();
  if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(quote)) throw new Error("INVALID_CURRENCY");
  if (base === quote) return { base, quote, rate: "1", source: "identity", expiresAt: new Date(Date.now() + 86_400_000) };
  const db = getPrisma();
  const cached = await db.fxRate.findFirst({ where: { base, quote, expiresAt: { gt: new Date() } }, orderBy: { fetchedAt: "desc" } });
  if (cached) return { ...cached, rate: cached.rate.toString() };
  const apiBase = process.env.FX_API_BASE_URL;
  const apiKey = process.env.FX_API_KEY;
  if (!apiBase || !apiKey) throw new Error("FX_NOT_CONFIGURED");
  const url = new URL("latest", apiBase.endsWith("/") ? apiBase : `${apiBase}/`);
  url.searchParams.set("base", base);
  url.searchParams.set("symbols", quote);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error("FX_PROVIDER_FAILED");
  const payload = responseSchema.parse(await response.json());
  const rate = payload.rates[quote];
  if (!rate) throw new Error("FX_RATE_UNAVAILABLE");
  const expiresAt = new Date(Date.now() + 15 * 60_000);
  const saved = await db.fxRate.upsert({ where: { base_quote_source: { base, quote, source: "configured-provider" } }, create: { base, quote, rate, source: "configured-provider", expiresAt }, update: { rate, fetchedAt: new Date(), expiresAt } });
  return { ...saved, rate: saved.rate.toString() };
}
