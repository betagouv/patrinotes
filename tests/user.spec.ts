import { test, expect } from "@playwright/test";
import { apiSignIn, clearLoginMails, getLoginMail, login, mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";

test.describe("Create user", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("./");
  });

  test("should be redirected to the login page", async ({ page }) => {
    await page.waitForURL((url) => url.pathname === "/connexion");
    expect(page.url()).toContain("connexion");
  });

  test("the profile form needs a verified sign-in first", async ({ page }) => {
    await page.goto("./inscription");
    await page.waitForURL((url) => url.pathname === "/connexion");
  });

  test("should create a new user on the first sign-in", async ({ page }) => {
    await signup({ page, user: mockUsers[0] });
    expect(page.url()).toContain("/");

    const internalUser = await db
      .selectFrom("internal_user")
      .where("email", "=", mockUsers[0].email)
      .selectAll()
      .executeTakeFirstOrThrow();
    expect(internalUser.role).toBe("user");

    await page.getByRole("button", { name: "Déconnexion" }).click();
    await page.waitForURL((url) => url.pathname === "/connexion");
    expect(page.url()).toContain("connexion");
  });

  test("should login with the code received by email", async ({ page }) => {
    await login({ page, user: mockUsers[0] });
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("should login with the link received by email", async ({ page }) => {
    await clearLoginMails(mockUsers[0].email);
    await page.goto("./connexion");
    await page.fill("input[name=email]", mockUsers[0].email);
    await page.getByRole("button", { name: "Recevoir un lien de connexion" }).click();
    await page.waitForSelector("input[name=code]");

    const { link } = await getLoginMail(mockUsers[0].email);
    await page.goto(link);
    await page.waitForURL((url) => url.pathname === "/");
    await page.waitForSelector("text=Déconnexion", { state: "attached" });

    // single use
    await page.getByRole("button", { name: "Déconnexion" }).click();
    await page.waitForURL((url) => url.pathname === "/connexion");
    await page.goto(link);
    await expect(page.getByText("Le lien ou le code est invalide ou a expiré")).toBeVisible();
  });

  test("logout revokes the session", async () => {
    const session = await apiSignIn(mockUsers[0]);
    const BACKEND_API = `http://localhost:${process.env.BACKEND_PORT}/api`;

    const logout = await fetch(`${BACKEND_API}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    expect(logout.status).toBe(200);

    const refresh = await fetch(`${BACKEND_API}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    expect(refresh.status).toBe(401);

    const authed = await fetch(`${BACKEND_API}/created-at`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    expect(authed.status).toBe(403);
  });
});

test.describe("Dept numbers on signup", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test("should create all dept_number rows when service has multiple depts", async ({ page }) => {
    await signup({ page, user: mockUsers[0], udap: "service-multi-dept" });

    const internalUser = await db
      .selectFrom("internal_user")
      .where("email", "=", mockUsers[0].email)
      .select("userId")
      .executeTakeFirstOrThrow();

    const userDepts = await db
      .selectFrom("user_dept")
      .where("user_id", "=", internalUser.userId)
      .select("dept_number")
      .execute();

    const deptNumbers = userDepts.map((d) => d.dept_number);
    expect(deptNumbers).toHaveLength(3);
    expect(deptNumbers).toContain("01");
    expect(deptNumbers).toContain("02");
    expect(deptNumbers).toContain("03");
  });
});
