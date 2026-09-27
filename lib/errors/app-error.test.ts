import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError, errors, normalizeError } from "./app-error.ts";

describe("application error contract", () => {
  it("keeps authentication and authorization failures distinct", () => {
    assert.equal(errors.authenticationRequired().status, 401);
    assert.equal(errors.accountSuspended().code, "ACCOUNT_SUSPENDED");
    assert.equal(errors.accountSuspended().status, 403);
    assert.equal(errors.authUnavailable().retryable, true);
  });

  it("maps known persistence conflicts without exposing internals", () => {
    const error = normalizeError({ code: "P2002", message: "Unique constraint on secret field" });
    assert.equal(error.code, "CONFLICT");
    assert.equal(error.message, "That record already exists.");
  });

  it("wraps unknown failures in a safe internal error", () => {
    const cause = new Error("database password was rejected");
    const error = normalizeError(cause, "Unable to finish the request.");
    assert.ok(error instanceof AppError);
    assert.equal(error.code, "INTERNAL_ERROR");
    assert.equal(error.message, "Unable to finish the request.");
    assert.equal(error.cause, cause);
  });
});
