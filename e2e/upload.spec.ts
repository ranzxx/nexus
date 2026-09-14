import { test, expect } from "@playwright/test";
import path from "path";
import { registerTestUser, login } from "./helpers/auth";

test("user can upload a PDF document", async ({ page }) => {
  const email = `e2e-upload-${Date.now()}@test.com`;

  await registerTestUser(page, email);
  await login(page, email);
  await page.goto("/chat");

  const filePath = path.join(process.cwd(), "e2e/fixtures/test-document.pdf");

  const input = page.getByTestId("pdf-upload").locator('input[type="file"]');
  await input.setInputFiles(filePath);

  await expect(
    page.getByText("test-document.pdf", { exact: true }),
  ).toBeVisible({
    timeout: 30_000,
  });
});