import { test, expect } from "@playwright/test";
import { registerTestUser } from "./helpers/auth";

test.describe("Chat", () => {
  test("authenticated user can open chat page", async ({ page }) => {
    const email = `e2e-chat-${Date.now()}@test.com`;

    await registerTestUser(page, email);
    await page.goto("/chat");

    await expect(page).toHaveURL(/chat/);
  });

  test("user can send a message", async ({ page }) => {
    const email = `e2e-message-${Date.now()}@test.com`;

    await registerTestUser(page, email);
    await page.goto("/chat");

    await page.fill('input[placeholder="ask anything..."]', "hello nexus");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/, {
      timeout: 15_000,
    });
  });

  test("new message creates or opens a conversation URL", async ({ page }) => {
    const email = `e2e-conversation-${Date.now()}@test.com`;

    await registerTestUser(page, email);
    await page.goto("/chat");

    await page.fill('input[placeholder="ask anything..."]', "what is 2+2?");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/, {
      timeout: 15_000,
    });
  });

  test("existing conversation keeps previous messages after reload", async ({
    page,
  }) => {
    const email = `e2e-history-${Date.now()}@test.com`;

    await registerTestUser(page, email);
    await page.goto("/chat");

    await page.fill(
      'input[placeholder="ask anything..."]',
      "remember this: nexus e2e test",
    );

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/chat\/[a-zA-Z0-9-]+/, {
      timeout: 15_000,
    });

    await page.waitForTimeout(3000);

    const conversationUrl = page.url();

    await page.reload();

    await expect(page).toHaveURL(conversationUrl);
    await expect(
      page.getByText("remember this: nexus e2e test").first(),
    ).toBeVisible();
  });
});
