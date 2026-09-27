import { expect, test } from "@playwright/test";

test("landing page renders one header without horizontal overflow", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Great Finance/);
  await expect(page.locator("body > header")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Great Finance home" })).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("sign-in form never exposes credentials and validates invalid input", async ({ page }) => {
  await page.goto("/auth/sign-in");

  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await page.getByLabel("Email address").fill("not-an-email");
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: "Sign in securely" }).click();
  expect(new URL(page.url()).searchParams.has("password")).toBe(false);
  await expect(page.getByText("Enter a valid email.")).toBeVisible();
  await expect(page.getByText("Use at least 8 characters.")).toBeVisible();
  await expect(page.getByLabel("Email address")).toHaveAttribute("aria-invalid", "true");
});

test("registration pages preserve customer and vendor fields", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();
  await expect(page.getByLabel("Bank")).toBeVisible();
  await expect(page.getByLabel("Account number")).toBeVisible();

  await page.goto("/vendor/signup");
  await expect(page.getByRole("heading", { name: /vendor registration/i })).toBeVisible();
  await expect(page.getByLabel("Active WhatsApp number")).toBeVisible();
  await expect(page.getByLabel("Bank")).toHaveCount(0);
});

test("setup page reports the connected Neon services", async ({ page }) => {
  await page.goto("/setup");

  for (const service of [
    "Neon pooled database URL",
    "Neon Auth endpoint and cookie secret",
    "Neon Data API with Auth JWT",
    "Private Neon document storage",
  ]) {
    const row = page.getByRole("listitem").filter({ hasText: service });
    await expect(row).toContainText("Ready");
  }

  await expect(page.getByRole("listitem").filter({ hasText: "Private Vercel Blob image storage" })).toBeVisible();
});

test("anonymous users cannot reach protected KYC and administration pages", async ({ page }) => {
  for (const path of ["/vendor/kyc", "/admin/vendor_verification"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/auth\/sign-in$/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  }
});

test("anonymous users cannot obtain a KYC storage upload URL", async ({ request }) => {
  const response = await request.post("/api/storage/kyc/upload-url", {
    data: {
      kind: "identity",
      fileName: "identity.pdf",
      contentType: "application/pdf",
      size: 1024,
    },
  });

  expect(response.status()).toBe(401);
  const requestId = response.headers()["x-request-id"];
  expect(requestId).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({
    success: false,
    error: { code: "AUTHENTICATION_REQUIRED", requestId, retryable: false },
    requestId,
  });
});
