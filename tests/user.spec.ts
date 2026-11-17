import { test, expect, type Route } from "@playwright/test";
import { deleteUserByEmail } from "../packages/backend/src/features/auth/keycloak";
import { cleanupDb, mockServices, mockUsers, signup } from "./utils";
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

    await page.getByRole("button", { name: "Déconnexion" }).first().click();
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

test.describe("Email case and whitespace", () => {
  const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT}`;

  test.beforeAll(async () => {
    await resetDatabase();
  });

  test("signup and login accept a whitelisted email typed with capitals and spaces", async ({ request }) => {
    const user = mockUsers[1];
    // whitelist holds the lowercase address; users often type "Prenom.Nom@..." (Outlook, autocomplete)
    const typed = `  ${user.email.toUpperCase()} `;

    const signupResp = await request.post(`${BACKEND_URL}/api/create-user`, {
      data: {
        name: `${user.prenom} ${user.nom}`,
        email: typed,
        password: user.password,
        job: user.job,
        service_id: mockServices[0].id,
        newsletter: false,
        cgu: true,
      },
    });
    expect(signupResp.status(), await signupResp.text()).toBe(200);

    const stored = await db.selectFrom("user").where("email", "=", user.email).selectAll().executeTakeFirst();
    expect(stored, "user should be stored with the normalized email").toBeTruthy();

    const loginResp = await request.post(`${BACKEND_URL}/api/login-user`, {
      data: { email: typed, password: user.password },
    });
    expect(loginResp.status(), await loginResp.text()).toBe(200);
    expect((await loginResp.json()).user.id).toBe(stored!.id);
  });
});

test.describe("Dept numbers on signup", () => {
  test.beforeAll(async () => {
    await resetDatabase();
  });

  test("should create all dept_number rows when service has multiple depts", async ({ page }) => {
    await signup({ page, user: mockUsers[0], udap: "service-multi-dept" });

    const user = await db
      .selectFrom("user")
      .where("email", "=", mockUsers[0].email)
      .select("id")
      .executeTakeFirstOrThrow();

    const userDepts = await db.selectFrom("user_dept").where("user_id", "=", user.id).select("dept_number").execute();

    const deptNumbers = userDepts.map((d) => d.dept_number);
    expect(deptNumbers).toHaveLength(3);
    expect(deptNumbers).toContain("01");
    expect(deptNumbers).toContain("02");
    expect(deptNumbers).toContain("03");
  });
});
