import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT}`;

test.describe("Admin whitelist", () => {
  let adminToken: string;

  test.beforeAll(async ({ browser }) => {
    await resetDatabase();

    // Create the admin user via signup UI flow
    const context = await browser.newContext();
    const page = await context.newPage();
    await signup({ page, user: mockUsers[0] });
    await context.close();

    // Upgrade to admin role
    await db.updateTable("internal_user").set({ role: "admin" }).where("email", "=", mockUsers[0].email).execute();

    // Obtain admin token for API tests
    const resp = await fetch(`${BACKEND_URL}/api/admin/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mockUsers[0].email, password: mockUsers[0].password }),
    });
    const data = (await resp.json()) as { accessToken: string };
    adminToken = data.accessToken;
  });

  // ---------------------------------------------------------------------------
  // API tests
  // ---------------------------------------------------------------------------

  test("GET /api/admin/whitelist returns paginated whitelist", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/whitelist`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(Array.isArray(data.emails)).toBe(true);
    expect(typeof data.total).toBe("number");
    expect(typeof data.page).toBe("number");
    expect(typeof data.limit).toBe("number");
    // mockUsers[0].email was inserted by resetDatabase
    expect(data.emails).toContain(mockUsers[0].email);
  });

  test("GET /api/admin/whitelist respects page/limit params", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/whitelist?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(data.emails).toHaveLength(1);
    expect(data.limit).toBe(1);
    expect(data.page).toBe(1);
  });

  test("GET /api/admin/whitelist returns 401 without token", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/whitelist`);
    expect(resp.ok()).toBe(false);
  });

  test("POST /api/admin/whitelist adds a new email", async ({ request }) => {
    const email = "new-entry@whitelist-test.com";

    const resp = await request.post(`${BACKEND_URL}/api/admin/whitelist`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { email },
    });

    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(data.email).toBe(email);

    const row = await db.selectFrom("whitelist").where("email", "=", email).selectAll().executeTakeFirst();
    expect(row?.email).toBe(email);
  });

  test("POST /api/admin/whitelist returns 409 for duplicate email", async ({ request }) => {
    // mockUsers[0].email is already in whitelist from resetDatabase
    const resp = await request.post(`${BACKEND_URL}/api/admin/whitelist`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { email: mockUsers[0].email },
    });

    expect(resp.status()).toBe(409);
  });

  test("DELETE /api/admin/whitelist/:email removes an email", async ({ request }) => {
    const email = "to-delete@whitelist-test.com";
    await db.insertInto("whitelist").values({ email }).execute();

    const resp = await request.delete(`${BACKEND_URL}/api/admin/whitelist/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resp.ok()).toBe(true);

    const row = await db.selectFrom("whitelist").where("email", "=", email).selectAll().executeTakeFirst();
    expect(row).toBeUndefined();
  });

  test("DELETE /api/admin/whitelist/:email returns 404 for unknown email", async ({ request }) => {
    const resp = await request.delete(`${BACKEND_URL}/api/admin/whitelist/notexist@example.com`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resp.status()).toBe(404);
  });

  // ---------------------------------------------------------------------------
  // UI test
  // ---------------------------------------------------------------------------

  test("admin page shows whitelist and allows add/delete", async ({ page }) => {
    // Log in via the login form (mockUsers[0] is already admin from beforeAll)
    await page.goto("./connexion");
    await page.fill("input[name=email]", mockUsers[0].email);
    await page.fill("input[name=password]", mockUsers[0].password);
    await page.click("button[type=submit]");
    await page.waitForURL((url) => url.pathname === "/");

    // Navigate to admin page
    await page.goto("./admin");

    // Page should show the whitelist heading
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("whitelist");

    // The existing whitelisted emails should be visible
    await expect(page.locator("table")).toContainText(mockUsers[0].email);

    // Add a new email via the form
    const newEmail = "ui-added@whitelist-test.com";
    await page.fill("input[type=email]", newEmail);
    await page.click("button[type=submit]");

    // Wait for the new email to appear in the table
    await expect(page.locator("table")).toContainText(newEmail, { timeout: 5000 });

    // Delete the newly added email
    const row = page.locator("tr", { hasText: newEmail });
    await row.locator("button", { hasText: "Supprimer" }).click();

    // Email should be gone from the table
    await expect(page.locator("table")).not.toContainText(newEmail, { timeout: 5000 });
  });
});
