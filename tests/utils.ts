import { Page } from "@playwright/test";
import { Database, db } from "../packages/backend/src/db/db";
import type { Insertable, Selectable } from "kysely";

export const mockServices: Insertable<Database["service"]>[] = [
  {
    name: "Service 1",
    id: "service-1",
    department: "00",
    visible: true,
  },
];

export const mockUsers = [
  {
    nom: "Test",
    prenom: "Runner 1",
    email: "testrunner1@yopmail.com",
    job: "Testeur",
    password: "Password123!",
  },
  {
    nom: "Test",
    prenom: "Runner 2",
    email: "testrunner2@yopmail.com",
    job: "Testeur",
    password: "Password123!",
  },
];

type User = (typeof mockUsers)[0];

export const signup = async ({ page, user, udap = mockServices[0].id }: { page: Page; user: User; udap?: string }) => {
  await page.goto("./inscription");

  await page.fill("input[name=nom]", user.nom);
  await page.fill("input[name=prenom]", user.prenom);
  await page.fill("input[name=email]", user.email);
  await page.fill("input[name=password]", user.password);
  await page.fill("input[name=job]", user.job);

  await page.selectOption("select[name=service_id]", udap);

  await page.check("input[name=cgu]", { force: true });

  await page.click("button[type=submit]");

  await page.waitForURL((url) => url.pathname === "/");
};

export const cleanupDb = async () => {
  const result = await db
    .deleteFrom("internal_user")
    .where(
      "email",
      "in",
      mockUsers.map((u) => u.email),
    )
    .returning("id")
    .execute();

  await db
    .deleteFrom("user")
    .where(
      "id",
      "in",
      result.map((r) => r.id),
    )
    .execute();
};
