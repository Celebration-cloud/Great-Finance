import { describe, expect, it } from "vitest";
import { can, canReviewOwnRequest } from "./permissions";

describe("role policy", () => {
  it("keeps customer access scoped", () => { expect(can("CUSTOMER", "payment:create")).toBe(true); expect(can("CUSTOMER", "ledger:read")).toBe(false); });
  it("grants super admins all declared powers", () => expect(can("SUPER_ADMIN", "admin:manage")).toBe(true));
  it("enforces maker-checker separation", () => { expect(canReviewOwnRequest("user-1", "user-1")).toBe(false); expect(canReviewOwnRequest("user-1", "user-2")).toBe(true); });
});
