import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getApiErrorMessage } from "./client-error.ts";

describe("API client error messages", () => {
  it("prefers the typed error and appends the support reference", () => {
    assert.equal(getApiErrorMessage({ error: { message: "Authentication required.", requestId: "req-12345678" } }, "Fallback"), "Authentication required. Reference: req-12345678");
  });

  it("supports legacy response messages during migration", () => {
    assert.equal(getApiErrorMessage({ message: "Try again." }, "Fallback"), "Try again.");
  });
});
