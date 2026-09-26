import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateBalancedPosting } from "./domain.ts";

const base = { reference: "GF-TEST-001", idempotencyKey: "test-key-001", description: "Test payment", occurredAt: new Date(), createdBy: "test" };

describe("ledger invariants", () => {
  it("accepts a balanced posting", () => {
    assert.equal(validateBalancedPosting({ ...base, entries: [{ accountId: "cash", direction: "DEBIT", amountMinor: 1500n, currency: "NGN" }, { accountId: "revenue", direction: "CREDIT", amountMinor: 1500n, currency: "NGN" }] }).entries.length, 2);
  });
  it("rejects an unbalanced posting", () => {
    assert.throws(() => validateBalancedPosting({ ...base, entries: [{ accountId: "cash", direction: "DEBIT", amountMinor: 1500n, currency: "NGN" }, { accountId: "revenue", direction: "CREDIT", amountMinor: 1499n, currency: "NGN" }] }), /not balanced/);
  });
  it("rejects mixed currencies", () => {
    assert.throws(() => validateBalancedPosting({ ...base, entries: [{ accountId: "cash", direction: "DEBIT", amountMinor: 1500n, currency: "NGN" }, { accountId: "revenue", direction: "CREDIT", amountMinor: 1500n, currency: "USD" }] }), /one currency/);
  });
});
