import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { can, canReviewOwnRequest } from "./permissions.ts";

describe("role policy", () => {
  it("keeps customer access scoped", () => { assert.equal(can("CUSTOMER", "payment:create"), true); assert.equal(can("CUSTOMER", "ledger:read"), false); });
  it("grants vendors payment:create to acquire inventory", () => assert.equal(can("VENDOR", "payment:create"), true));
  it("grants super admins all declared powers", () => assert.equal(can("SUPER_ADMIN", "admin:manage"), true));
  it("enforces maker-checker separation", () => { assert.equal(canReviewOwnRequest("user-1", "user-1"), false); assert.equal(canReviewOwnRequest("user-1", "user-2"), true); });
});
