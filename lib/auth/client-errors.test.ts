import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getAuthErrorMessage } from "./client-errors.ts";

describe("authentication client errors", () => {
  it("does not expose unknown provider messages", () => {
    assert.equal(getAuthErrorMessage(new Error("SQL connection secret leaked"), "sign-in"), "Sign in failed. Check your details and try again.");
  });

  it("provides actionable messages for expected auth failures", () => {
    assert.equal(getAuthErrorMessage("invalid credentials", "sign-in"), "Email or password is incorrect.");
    assert.equal(getAuthErrorMessage("too many requests", "sign-up"), "Too many authentication attempts. Please wait and try again.");
  });
});
