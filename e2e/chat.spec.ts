import { test, expect } from "@playwright/test";
import { registerTestUser } from "./helpers/auth";

test.describe("Chat", () => {
  test("authenticated user can open chat page", async ({ page }) => {
    const email = `e2e-chat-${Date.now()}@test.com`;
    await registerTestUser(page, email);
    await page.goto("/chat");

    await expect(page).toHaveURL(/chat/, { timeout: 15_000 });
  });

  test("user can send a message and get response", async ({ page }) => {
    const email = `e2e-message-${Date.now()}@test.com`;
    await registerTestUser(page, email);
    await page.goto("/chat");

    await page.getByTestId("chat-input").fill("hello nexus");
    await page.click('button[type="submit"]');

    // cek pesan user muncul
    await expect(page.getByText("hello nexus")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("new message creates a conversation in sidebar", async ({ page }) => {
    const email = `e2e-conversation-${Date.now()}@test.com`;
    await registerTestUser(page, email);
    await page.goto("/chat");

    await page.getByTestId("chat-input").fill("what is 2+2?");
    await page.click('button[type="submit"]');

    // cek pesan user muncul
    await expect(page.getByText("what is 2+2?")).toBeVisible({
      timeout: 15_000,
    });

    // tunggu sidebar update (interval 3 detik)
    await page.waitForTimeout(4000);

    // cek conversation muncul di sidebar
    await expect(page.getByText("what is 2+2?").first()).toBeVisible();
  });

  test("existing conversation keeps previous messages after reload", async ({
    page,
  }) => {
    const email = `e2e-history-${Date.now()}@test.com`;
    await registerTestUser(page, email);
    await page.goto("/chat");

    await page.getByTestId("chat-input").fill("remember this: nexus e2e test");
    await page.click('button[type="submit"]');

    // cek pesan muncul
    await expect(page.getByText("remember this: nexus e2e test")).toBeVisible({
      timeout: 15_000,
    });

    // tunggu sidebar update lalu klik conversation
    await page.waitForTimeout(4000);
    await page.getByText("remember this").first().click();

    // cek URL berubah ke /chat/[id]
    await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/, { timeout: 10_000 });

    // reload dan cek history tetap ada
    await page.reload();
    await expect(
      page.getByText("remember this: nexus e2e test").first(),
    ).toBeVisible({ timeout: 10_000 });
  });
});
