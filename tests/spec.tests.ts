import { test, expect } from '@playwright/test';

test.describe("Strona logowania", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(" http://localhost:3000/login")
  })

  test("Powinien wyswietlic naglowek", async ({page}) => {
    await expect(page.locator("h1")).toContainText("System Zarządzania Projektami")
  })
  console.log("Testy zostaly zroziony")
})