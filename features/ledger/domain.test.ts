import { describe, expect, it } from "vitest";
import { validateBalancedPosting } from "./domain";

const base = { reference: "GF-TEST-001", idempotencyKey: "test-key-001", description: "Test payment", occurredAt: new Date(), createdBy: "test" };

describe("ledger invariants", () => {
  it("accepts a balanced posting", () => {
    expect(validateBalancedPosting({ ...base, entries: [{ accountId: "cash", direction: "DEBIT", amountMinor: 1500n, currency: "NGN" }, { accountId: "revenue", direction: "CREDIT", amountMinor: 1500n, currency: "NGN" }] }).entries).toHaveLength(2);
  });
  it("rejects an unbalanced posting", () => {
    expect(() => validateBalancedPosting({ ...base, entries: [{ accountId: "cash", direction: "DEBIT", amountMinor: 1500n, currency: "NGN" }, { accountId: "revenue", direction: "CREDIT", amountMinor: 1499n, currency: "NGN" }] })).toThrow("not balanced");
  });
  it("rejects mixed currencies", () => {
    expect(() => validateBalancedPosting({ ...base, entries: [{ accountId: "cash", direction: "DEBIT", amountMinor: 1500n, currency: "NGN" }, { accountId: "revenue", direction: "CREDIT", amountMinor: 1500n, currency: "USD" }] })).toThrow("one currency");
  });
});
