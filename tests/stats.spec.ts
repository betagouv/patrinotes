import { test, expect } from "@playwright/test";
import { mockUsers, mockServices, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";
import { sql } from "kysely";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT}`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const getToken = async (email: string, password: string) => {
  const resp = await fetch(`${BACKEND_URL}/api/login-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await resp.json()) as { accessToken: string };
  return data.accessToken;
};

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

test.describe("Stats", () => {
  let adminToken: string;
  let regularToken: string;
  let userId0: string; // has documents — user[1] has none, no ID needed

  // IDs for cleanup
  const testReportIds = ["stats-report-draft", "stats-report-sent"];
  const testStateReportIds = ["stats-constat-sent", "stats-constat-abandoned", "stats-constat-recent"];
  const testSentEmailId = "stats-sent-email-1";
  const testStateReportSentEmailId = "stats-sr-sent-email-1";

  test.beforeAll(async ({ browser }) => {
    await resetDatabase();

    // Sign up two users
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await signup({ page: page1, user: mockUsers[0] });
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await signup({ page: page2, user: mockUsers[1] });
    await context2.close();

    // Retrieve user IDs
    const user0 = await db
      .selectFrom("user")
      .where("email", "=", mockUsers[0].email)
      .select("id")
      .executeTakeFirstOrThrow();
    userId0 = user0.id;

    // Upgrade user[0] to admin
    await db.updateTable("internal_user").set({ role: "admin" }).where("email", "=", mockUsers[0].email).execute();

    // Get tokens
    adminToken = await getToken(mockUsers[0].email, mockUsers[0].password);
    regularToken = await getToken(mockUsers[1].email, mockUsers[1].password);

    // Insert test documents for user[0]

    // Draft compte rendu (no sent_email)
    await db
      .insertInto("report")
      .values({
        id: testReportIds[0],
        createdBy: userId0,
        createdAt: new Date().toISOString(),
        service_id: mockServices[0].id,
      } as any)
      .execute();

    // Sent compte rendu
    await db
      .insertInto("report")
      .values({
        id: testReportIds[1],
        createdBy: userId0,
        createdAt: new Date().toISOString(),
        service_id: mockServices[0].id,
      } as any)
      .execute();
    await db
      .insertInto("sent_email")
      .values({
        id: testSentEmailId,
        report_id: testReportIds[1],
        sent_to: "recipient@example.com",
        sent_at: new Date().toISOString(),
        service_id: mockServices[0].id,
      })
      .execute();

    // Sent constat (alerts_sent = true)
    await db
      .insertInto("state_report")
      .values({
        id: testStateReportIds[0],
        created_by: userId0,
        created_at: new Date().toISOString(),
        service_id: mockServices[0].id,
        alerts_sent: true,
      })
      .execute();
    await db
      .insertInto("state_report_sent_email")
      .values({
        id: testStateReportSentEmailId,
        state_report_id: testStateReportIds[0],
        sent_to: "recipient@example.com",
        sent_at: new Date().toISOString(),
        service_id: mockServices[0].id,
      })
      .execute();

    // Abandoned constat: created 30 days ago, alerts_sent = false
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await db
      .insertInto("state_report")
      .values({
        id: testStateReportIds[1],
        created_by: userId0,
        created_at: thirtyDaysAgo.toISOString(),
        service_id: mockServices[0].id,
        alerts_sent: false,
      })
      .execute();

    // Recent draft constat: created today, alerts_sent = false (NOT abandoned)
    await db
      .insertInto("state_report")
      .values({
        id: testStateReportIds[2],
        created_by: userId0,
        created_at: new Date().toISOString(),
        service_id: mockServices[0].id,
        alerts_sent: false,
      })
      .execute();
  });

  test.afterAll(async () => {
    await db.deleteFrom("state_report_sent_email").where("id", "=", testStateReportSentEmailId).execute();
    await db.deleteFrom("sent_email").where("id", "=", testSentEmailId).execute();
    await db.deleteFrom("state_report").where("id", "in", testStateReportIds).execute();
    await db.deleteFrom("report").where("id", "in", testReportIds).execute();
  });

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  test("GET /api/stats/public returns correct shape without auth", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/public`);
    expect(resp.ok()).toBe(true);

    const data = await resp.json();
    expect(typeof data.totalConstats).toBe("number");
    expect(typeof data.totalReports).toBe("number");
    expect(typeof data.totalUsers).toBe("number");
    expect(typeof data.usersWithNoDocuments).toBe("number");
    expect(typeof data.activeUsersInPeriod).toBe("number");
    expect(typeof data.periodFrom).toBe("string");
    expect(typeof data.periodTo).toBe("string");
  });

  test("GET /api/stats/public counts constats and reports correctly", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/public`);
    const data = await resp.json();

    // 3 state_reports inserted, none disabled
    expect(data.totalConstats).toBe(3);
    // 2 reports inserted, none disabled
    expect(data.totalReports).toBe(2);
    // 2 users signed up
    expect(data.totalUsers).toBe(2);
    // user[1] has no documents
    expect(data.usersWithNoDocuments).toBe(1);
  });

  test("GET /api/stats/public counts active users in period", async ({ request }) => {
    const from = new Date();
    from.setMonth(from.getMonth() - 3);
    const to = new Date();

    const resp = await request.get(
      `${BACKEND_URL}/api/stats/public?from=${from.toISOString().slice(0, 10)}&to=${to.toISOString().slice(0, 10)}`,
    );
    const data = await resp.json();

    // Only user[0] sent documents (1 sent_email + 1 state_report_sent_email) in the period
    expect(data.activeUsersInPeriod).toBe(1);
  });

  test("GET /api/stats/public returns 0 active users for out-of-range period", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/public?from=2000-01-01&to=2000-01-02`);
    const data = await resp.json();
    expect(data.activeUsersInPeriod).toBe(0);
  });

  test("GET /api/stats/public does not count disabled constats", async ({ request }) => {
    const disabledId = "stats-constat-disabled";
    await db
      .insertInto("state_report")
      .values({
        id: disabledId,
        created_by: userId0,
        created_at: new Date().toISOString(),
        service_id: mockServices[0].id,
        alerts_sent: false,
        disabled: true,
      })
      .execute();

    try {
      const resp = await request.get(`${BACKEND_URL}/api/stats/public`);
      const data = await resp.json();
      expect(data.totalConstats).toBe(3); // still 3, disabled one not counted
    } finally {
      await db.deleteFrom("state_report").where("id", "=", disabledId).execute();
    }
  });

  // ---------------------------------------------------------------------------
  // Admin API
  // ---------------------------------------------------------------------------

  test("GET /api/stats/admin returns 403 without token", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/admin`);
    expect(resp.ok()).toBe(false);
    expect(resp.status()).toBe(403);
  });

  test("GET /api/stats/admin returns 403 for non-admin user", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/admin`, {
      headers: { Authorization: `Bearer ${regularToken}` },
    });
    expect(resp.status()).toBe(403);
  });

  test("GET /api/stats/admin returns correct data for admin", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    expect(resp.ok()).toBe(true);

    const data = await resp.json();
    expect(Array.isArray(data.constatsByService)).toBe(true);
    expect(typeof data.abandonedConstats).toBe("number");
  });

  test("GET /api/stats/admin counts abandoned constats correctly", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await resp.json();

    // Only the constat created 30 days ago with alerts_sent=false is abandoned
    expect(data.abandonedConstats).toBe(1);
  });

  test("GET /api/stats/admin counts sent constats per service", async ({ request }) => {
    const resp = await request.get(`${BACKEND_URL}/api/stats/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await resp.json();

    const service1 = data.constatsByService.find((s: { serviceId: string }) => s.serviceId === mockServices[0].id);
    expect(service1).toBeDefined();
    // Only 1 constat with alerts_sent=true for service-1
    console.log("Service 1 sent constats:", service1.sentConstats);

    expect(service1.sentConstats).toBe(1);
  });

  // ---------------------------------------------------------------------------
  // UI tests
  // ---------------------------------------------------------------------------

  test("stats page is accessible without auth and shows public stats", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("./stats");

    await expect(page.locator("h1")).toContainText("Statistiques", { timeout: 10000 });

    // KPI cards showing counts should be visible
    await expect(page.getByText("Constats d'état créés")).toBeVisible();
    await expect(page.getByText("Comptes rendus créés")).toBeVisible();
    await expect(page.getByText("Utilisateurs inscrits")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Taux d'adoption" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Taux de rétention à 3 mois" })).toBeVisible();

    // Admin section should not be visible (not logged in)
    await expect(page.getByText("Statistiques par service (admin)")).not.toBeVisible();
  });

  test("stats page shows admin section when logged in as admin", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("./connexion");
    await page.fill("input[name=email]", mockUsers[0].email);
    await page.fill("input[name=password]", mockUsers[0].password);
    await page.click("button[type=submit]");
    await page.waitForURL((url) => url.pathname === "/");
    await page.waitForTimeout(1000);

    await page.goto("./stats");
    await expect(page.locator("h1")).toContainText("Statistiques", { timeout: 10000 });

    // Admin section should be visible
    await expect(page.getByText("Statistiques par service (admin)")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Constats abandonnés")).toBeVisible();
  });

  test("changing date range refetches retention stats", async ({ page }) => {
    test.setTimeout(60000);

    await page.goto("./stats");
    await expect(page.locator("h1")).toContainText("Statistiques", { timeout: 10000 });

    // Set a range far in the past — active users should become 0
    const fromInput = page.locator("input[type=date]").first();
    const toInput = page.locator("input[type=date]").nth(1);

    await fromInput.fill("2000-01-01");
    await toInput.fill("2000-01-31");

    // Wait for the refetch — retention KPI should update to show 0
    await expect(page.getByText("0 / ")).toBeVisible({ timeout: 5000 });
  });
});
