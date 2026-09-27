import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseOpenExchangeRateResponse } from "./exchange-rate-api.ts";

describe("ExchangeRate-API open response", () => {
  it("returns the requested rate and provider refresh time", () => {
    const result = parseOpenExchangeRateResponse({
      result: "success",
      base_code: "NGN",
      time_next_update_unix: 1_900_000_000,
      rates: { USD: 0.00065, GHS: 0.0098, ZAR: 0.012 },
    }, "NGN", "USD", new Date("2026-01-01T00:00:00Z"));

    assert.equal(result.rate, 0.00065);
    assert.equal(result.expiresAt.toISOString(), "2030-03-17T17:46:40.000Z");
  });

  it("rejects a response for a different base currency", () => {
    assert.throws(() => parseOpenExchangeRateResponse({
      result: "success",
      base_code: "USD",
      time_next_update_unix: 1_900_000_000,
      rates: { NGN: 1500 },
    }, "NGN", "USD"), /FX_PROVIDER_BASE_MISMATCH/);
  });

  it("rejects a response without the requested quote currency", () => {
    assert.throws(() => parseOpenExchangeRateResponse({
      result: "success",
      base_code: "NGN",
      time_next_update_unix: 1_900_000_000,
      rates: { GHS: 0.0098 },
    }, "NGN", "USD"), /FX_RATE_UNAVAILABLE/);
  });
});
