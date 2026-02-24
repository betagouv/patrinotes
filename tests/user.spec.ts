import { test, expect, type Route } from "@playwright/test";
import { deleteUserByEmail } from "../packages/backend/src/features/auth/keycloak";
import { cleanupDb, mockUsers, signup } from "./utils";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
});

test.beforeAll(async () => {
  for (const user of mockUsers) {
    try {
      await deleteUserByEmail(user.email);
    } catch {}
  }
});

test.afterAll(async () => {});

test.describe("Create user", () => {
  test("should be redirected to the login page", async ({ page }) => {
    await page.waitForURL((url) => url.pathname === "/connexion");
    expect(page.url()).toContain("connexion");
  });

  test("should go to signup page", async ({ page }) => {
    const button = await page.waitForSelector("[href='/inscription']");
    expect(button).toBeDefined();

    await button.click();
    await page.waitForURL((url) => url.pathname === "/inscription");

    expect(page.url()).toContain("inscription");
  });

  test("should create a new user", async ({ page }) => {
    await signup({ page, user: mockUsers[0] });
    expect(page.url()).toContain("/");

    const button = await page.waitForSelector("[data-test-id=logout]");
    await button.click();
    await page.waitForURL((url) => url.pathname === "/connexion");
    expect(page.url()).toContain("connexion");
  });

  test("should login", async ({ page }) => {
    await page.goto("./connexion");

    await page.fill("input[name=email]", mockUsers[0].email);
    await page.fill("input[name=password]", mockUsers[0].password);

    await page.click("button[type=submit]");
    await page.waitForURL((url) => url.pathname === "/");
    expect(page.url()).toContain("/");
  });
});
