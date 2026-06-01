import { test, expect } from "@playwright/test";
import { login, registerTestUser } from "./helpers/auth";

test.describe("Authentication", () => {
  test("redirects unauthenticated user from chat page to login", async ({
    page,
  }) => {
    await page.goto("/chat");
    await expect(page).toHaveURL(/login/);
  });

  test("allows a new user to register", async ({ page }) => {
    const email = `e2e-${Date.now()}@test.com`;
    await registerTestUser(page, email);

    await expect(page).toHaveURL(/dashboard|chat/, { timeout: 10_000 });
  });

  test("shows error when login credentials are invalid", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "wrong@test.com");
    await page.fill('input[name="password"]', "wrongpassword");

    await page.click('button[type="submit"]');

    await expect(page.locator("[data-sonner-toast]")).toBeVisible({
      timeout: 5_000,
    });
  });

  test("allows registered user to login", async ({ page }) => {
    const email = `e2e-login-${Date.now()}@test.com`;

    await registerTestUser(page, email);

    // User sekarang sudah login karena register berhasil.
    // Kita hapus session browser supaya bisa test login dari kondisi guest.
    await page.context().clearCookies();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto("/login");

    await login(page, email);

    await expect(page).toHaveURL(/\/chat$/, {
      timeout: 10_000,
    });
  });
});
