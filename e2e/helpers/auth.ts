import type { Page } from "@playwright/test";

export async function registerTestUser(page: Page, email: string) {
  await page.goto("/register");

  await page.fill('input[name="name"]', "Test User");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "password123");

  await page.click('button[type="submit"]');

  // pakai /chat tanpa $ supaya match /chat, /chat/, /chat?...
  await page.waitForURL(/\/chat/, {
    timeout: 15_000,
  });
}

export async function login(page: Page, email: string) {
  await page.goto("/login");

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', "password123");

  await page.click('button[type="submit"]');

  await page.waitForURL(/\/chat/, {
    timeout: 15_000,
  });
}
