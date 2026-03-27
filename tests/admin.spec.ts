import { test, expect } from "@playwright/test";
import { db } from "../packages/backend/src/db/db";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";

const adminUser = mockUsers[0];
const regularUser = mockUsers[1];

test.describe("Admin panel", () => {
  test.use({ baseURL: `http://localhost:${process.env.ADMIN_PORT}` });

  test.beforeAll(async () => {
    await resetDatabase();
  });

  test.describe("unauthenticated", () => {
    test("redirects / to /login", async ({ page }) => {
      await page.goto("/");
      await page.waitForURL((url) => url.pathname === "/login");
      expect(page.url()).toContain("/login");
    });

    test("redirects /dashboard to /login", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForURL((url) => url.pathname === "/login");
      expect(page.url()).toContain("/login");
    });
  });

  test.describe("login", () => {
    test.beforeAll(async ({ browser }) => {
      // Create both users via the frontend signup flow — use an explicit context
      // with the frontend baseURL since test.use() only applies to the page fixture
      const frontendContext = await browser.newContext({
        baseURL: `http://localhost:${process.env.FRONTEND_PORT}`,
      });

      const frontendPage = await frontendContext.newPage();
      await signup({ page: frontendPage, user: adminUser });

      const frontendPage2 = await frontendContext.newPage();
      await signup({ page: frontendPage2, user: regularUser });

      await frontendContext.close();

      // Promote adminUser to admin in internal_user
      await db
        .updateTable("internal_user")
        .set({ role: "admin" })
        .where("email", "=", adminUser.email)
        .execute();
    });

    test("rejects non-admin user with an error message", async ({ page }) => {
      await page.goto("/login");

      await page.fill("input[name=email]", regularUser.email);
      await page.fill("input[name=password]", regularUser.password);
      await page.click("button[type=submit]");

      await expect(page.getByText("Accès refusé")).toBeVisible();
      expect(page.url()).toContain("/login");
    });

    test("rejects wrong password with an error message", async ({ page }) => {
      await page.goto("/login");

      await page.fill("input[name=email]", adminUser.email);
      await page.fill("input[name=password]", "wrongpassword");
      await page.click("button[type=submit]");

      await expect(page.getByText("Courriel ou mot de passe incorrect")).toBeVisible();
      expect(page.url()).toContain("/login");
    });

    test("admin user can login and reaches dashboard", async ({ page }) => {
      await page.goto("/login");

      await page.fill("input[name=email]", adminUser.email);
      await page.fill("input[name=password]", adminUser.password);
      await page.click("button[type=submit]");

      await page.waitForURL((url) => url.pathname === "/dashboard");
      expect(page.url()).toContain("/dashboard");
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
    });

    test("already logged-in admin is redirected from /login to /dashboard", async ({ page }) => {
      await page.goto("/login");

      await page.fill("input[name=email]", adminUser.email);
      await page.fill("input[name=password]", adminUser.password);
      await page.click("button[type=submit]");
      await page.waitForURL((url) => url.pathname === "/dashboard");

      // Now navigate back to /login — should redirect to /dashboard
      await page.goto("/login");
      await page.waitForURL((url) => url.pathname === "/dashboard");
      expect(page.url()).toContain("/dashboard");
    });

    test("logout clears session and redirects to /login", async ({ page }) => {
      await page.goto("/login");

      await page.fill("input[name=email]", adminUser.email);
      await page.fill("input[name=password]", adminUser.password);
      await page.click("button[type=submit]");
      await page.waitForURL((url) => url.pathname === "/dashboard");

      await page.getByRole("button", { name: "Se déconnecter" }).click();
      await page.waitForURL((url) => url.pathname === "/login");
      expect(page.url()).toContain("/login");

      // After logout, /dashboard should redirect back to /login
      await page.goto("/dashboard");
      await page.waitForURL((url) => url.pathname === "/login");
    });
  });
});
