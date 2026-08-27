import { test, expect } from "@playwright/test";
import { mockUsers, mockServices, signup, login } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT}`;

test.describe("Admin whitelist", () => {
  let adminToken: string;
  let nonAdminToken: string;

  test.beforeAll(async ({ browser }) => {
    await resetDatabase();

    // Create the admin user via signup UI flow
    const context = await browser.newContext();
    const page = await context.newPage();
    await signup({ page, user: mockUsers[0] });
    await context.close();

    // Create a second, non-admin user for access-control tests
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await signup({ page: page2, user: mockUsers[1] });
    await context2.close();

    // Upgrade to admin role
    await db.updateTable("internal_user").set({ role: "admin" }).where("email", "=", mockUsers[0].email).execute();
    // Obtain admin token for API tests
    const resp = await fetch(`${BACKEND_URL}/api/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mockUsers[0].email, password: mockUsers[0].password }),
    });
    const data = (await resp.json()) as { accessToken: string };
    adminToken = data.accessToken;

    const resp2 = await fetch(`${BACKEND_URL}/api/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mockUsers[1].email, password: mockUsers[1].password }),
    });
    const data2 = (await resp2.json()) as { accessToken: string };
    nonAdminToken = data2.accessToken;
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
    expect(Array.isArray(data.data)).toBe(true);
    expect(typeof data.total).toBe("number");
    expect(typeof data.page).toBe("number");
    expect(typeof data.limit).toBe("number");
    // mockUsers[0].email was inserted by resetDatabase
    expect(data.data.map((d: { email: string }) => d.email)).toContain(mockUsers[0].email);
  });

  test("GET /api/admin/whitelist respects page/limit params", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/whitelist?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(data.data).toHaveLength(1);
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

  test("DELETE /api/admin/whitelist removes an email", async ({ request }) => {
    const email = "to-delete@whitelist-test.com";
    await db.insertInto("whitelist").values({ email }).execute();

    const resp = await request.delete(`${BACKEND_URL}/api/admin/whitelist`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { email },
    });

    expect(resp.ok()).toBe(true);

    const row = await db.selectFrom("whitelist").where("email", "=", email).selectAll().executeTakeFirst();
    expect(row).toBeUndefined();
  });

  test("DELETE /api/admin/whitelist returns 404 for unknown email", async ({ request }) => {
    const resp = await request.delete(`${BACKEND_URL}/api/admin/whitelist`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: { email: "notexist@example.com" },
    });

    expect(resp.status()).toBe(404);
  });

  test("GET /api/admin/me returns the authenticated admin's profile", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(data.email).toBe(mockUsers[0].email);
  });

  test("GET /api/admin/whitelist/export returns whitelist rows as JSON", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/whitelist/export`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.map((d: { email: string }) => d.email)).toContain(mockUsers[0].email);
  });

  test("GET /api/admin/users/export returns user rows, filtered by search", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/users/export`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(data.map((d: { email: string }) => d.email)).toContain(mockUsers[0].email);
    expect(data.map((d: { email: string }) => d.email)).toContain(mockUsers[1].email);

    const filteredResp = await request.get(`${BACKEND_URL}/api/admin/users/export`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      params: { search: mockUsers[0].email },
    });
    const filtered = await filteredResp.json();
    expect(filtered.map((d: { email: string }) => d.email)).toEqual([mockUsers[0].email]);
  });

  test("GET /api/admin/users respects the search filter", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      params: { search: mockUsers[1].email },
    });

    expect(resp.ok()).toBe(true);
    const data = await resp.json();
    expect(data.data.map((u: { email: string }) => u.email)).toEqual([mockUsers[1].email]);
  });

  test("admin routes return 403 for an authenticated non-admin user", async ({ request }) => {
    for (const req of [
      () => request.get(`${BACKEND_URL}/api/admin/whitelist`, { headers: { Authorization: `Bearer ${nonAdminToken}` } }),
      () => request.get(`${BACKEND_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${nonAdminToken}` } }),
      () => request.get(`${BACKEND_URL}/api/admin/me`, { headers: { Authorization: `Bearer ${nonAdminToken}` } }),
    ]) {
      const resp = await req();
      expect(resp.status()).toBe(403);
    }
  });

  // ---------------------------------------------------------------------------
  // UI test
  // ---------------------------------------------------------------------------

  test("admin page shows whitelist and allows add/delete", async ({ page }) => {
    test.setTimeout(60000);
    // Log in via the login form (mockUsers[0] is already admin from beforeAll)
    await login({ page, user: mockUsers[0] });

    // Navigate to admin page
    await page.goto("./admin");

    // Page should show the admin heading
    await page.waitForSelector("h1");
    await expect(page.locator("h1")).toContainText("Administration");

    // The existing whitelisted emails should be visible
    await expect(page.locator("#whitelist-table > table")).toContainText(mockUsers[0].email);

    // Add a new email via the form
    const newEmail = "ui-added@whitelist-test.com";
    await page.fill("input[type=email]", newEmail);
    await page.click("button[type=submit]");

    // Wait for the new email to appear in the table
    await expect(page.locator("#whitelist-table > table")).toContainText(newEmail, { timeout: 5000 });

    // Delete the newly added email
    const row = page.locator("#whitelist-table > table tr", { hasText: newEmail });
    await row.locator("button", { hasText: "Supprimer" }).click();

    // Email should be gone from the table
    await expect(page.locator("#whitelist-table > table")).not.toContainText(newEmail, { timeout: 5000 });
  });

  const paginationScenarios = [
    {
      name: "whitelist",
      tab: null as string | null,
      tableSelector: "#whitelist-table > table tbody tr",
      tabpanelSelector: "#tabpanel-whitelist",
      countBefore: async () =>
        Number(
          (await db.selectFrom("whitelist").select(db.fn.countAll<number>().as("count")).executeTakeFirst())
            ?.count ?? 0,
        ),
      seed: async () => {
        const extraEmails = Array.from({ length: 22 }, (_, i) => `wl-pagination-${i + 1}@test.com`);
        await db
          .insertInto("whitelist")
          .values(extraEmails.map((email) => ({ email })))
          .execute();
        return extraEmails;
      },
      cleanup: async (extraEmails: string[]) => {
        await db.deleteFrom("whitelist").where("email", "in", extraEmails).execute();
      },
    },
    {
      name: "users",
      tab: "Utilisateurs",
      tableSelector: "#users-table > table tbody tr",
      tabpanelSelector: "#tabpanel-users",
      countBefore: async () =>
        Number(
          (await db.selectFrom("user").select(db.fn.countAll<number>().as("count")).executeTakeFirst())?.count ?? 0,
        ),
      seed: async () => {
        const extraUsers = Array.from({ length: 22 }, (_, i) => ({
          id: `pagination-user-${i + 1}`,
          name: `Pagination User ${i + 1}`,
          email: `users-pagination-${i + 1}@test.com`,
          service_id: mockServices[0].id,
        }));
        const extraInternalUsers = extraUsers.map((u) => ({
          id: `pagination-internal-${u.id}`,
          email: u.email,
          role: "user",
          userId: u.id,
        }));
        await db.insertInto("user").values(extraUsers).execute();
        await db.insertInto("internal_user").values(extraInternalUsers).execute();
        return { extraUsers, extraInternalUsers };
      },
      cleanup: async ({
        extraUsers,
        extraInternalUsers,
      }: {
        extraUsers: { id: string }[];
        extraInternalUsers: { id: string }[];
      }) => {
        await db
          .deleteFrom("internal_user")
          .where(
            "id",
            "in",
            extraInternalUsers.map((u) => u.id),
          )
          .execute();
        await db
          .deleteFrom("user")
          .where(
            "id",
            "in",
            extraUsers.map((u) => u.id),
          )
          .execute();
      },
    },
  ];

  for (const scenario of paginationScenarios) {
    test(`${scenario.name} table shows pagination and navigates to page 2`, async ({ page }) => {
      test.setTimeout(60000);

      const beforeCount = await scenario.countBefore();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const seeded: any = await scenario.seed();
      const page2Count = beforeCount + 22 - 20;

      try {
        await login({ page, user: mockUsers[0] });

        await page.goto("./admin");
        await page.waitForSelector("h1");

        if (scenario.tab) {
          await page.getByRole("button", { name: scenario.tab }).click();
        }

        // Page 1 should have exactly 20 rows
        await expect(page.locator(scenario.tableSelector)).toHaveCount(20, { timeout: 5000 });

        // Pagination nav should be visible
        await expect(page.locator(`${scenario.tabpanelSelector} nav.fr-pagination`)).toBeVisible();

        // Click page 2
        await page.locator(`${scenario.tabpanelSelector} button[title='Page 2']`).click();

        // Page 2 should show the remaining rows
        await expect(page.locator(scenario.tableSelector)).toHaveCount(page2Count, { timeout: 5000 });
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (scenario.cleanup as any)(seeded);
      }
    });
  }
});
