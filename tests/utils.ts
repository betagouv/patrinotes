import { Page } from "@playwright/test";
import { Database, db } from "../packages/backend/src/db/db";
import type { Insertable, Selectable } from "kysely";

export const mockPopObjets: Insertable<Database["pop_objets"]>[] = [
  {
    reference: "OBJ00001",
    id: "OBJ00001",
    titre_editorial: "Table de test",
    reference_a_une_notice_merimee_mh: "TEST00001",
    departement_format_numerique: "00",
  },
  {
    reference: "OBJ00002",
    id: "OBJ00002",
    titre_editorial: "Tableau de test",
    reference_a_une_notice_merimee_mh: "TEST00001",
    departement_format_numerique: "00",
  },
];

export const mockPopImmeuble = {
  departement_format_numerique: "00",
  reference: "TEST00001",
  id: "TEST00001",
  titre_editorial_de_la_notice: "Château de Test",
  commune_forme_editoriale: "Paris",
  commune_forme_index: "Paris",
  denomination_de_l_edifice: "Château",
  adresse_forme_editoriale: "1 rue de la Paix, Paris",
  cadastre: "AB 12",
  siecle_de_la_campagne_principale_de_construction: "17e siècle",
  typologie_de_la_protection: "Classé MH",
  precision_de_la_protection: "Façades et toitures",
  description_de_l_edifice: "Monument historique de test",
} satisfies Insertable<Database["pop_immeubles"]>;

export const mockServices: Insertable<Database["service"]>[] = [
  {
    name: "Service 1",
    id: "service-1",
    department: "00",
    visible: true,
    dept_numbers: "00",
  },
  {
    name: "Service Multi Dept",
    id: "service-multi-dept",
    department: "01",
    visible: true,
    dept_numbers: "01,02,03",
  },
];

export const mockServiceInstructeur: Insertable<Database["service_instructeurs"]> = {
  id: "instr-test-1",
  full_name: "Direction de l'Urbanisme",
  short_name: "Urbanisme Test",
  email: "urbanisme@mairie-test.fr",
  tel: "01 23 45 67 89",
  service_id: "service-1",
};

export const mockClauses: Insertable<Database["clause_v2"]>[] = [
  {
    id: "clause-type-espace-1",
    key: "type-espace",
    value: "exterieur",
    position: 1,
    service_id: "service-1",
    text: "Ce projet se situe en espace extérieur.",
  },
  {
    id: "clause-decision-1",
    key: "decision",
    value: "favorable",
    position: 1,
    service_id: "service-1",
    text: "Avis favorable sous réserve des prescriptions ci-après.",
  },
  {
    id: "clause-contacts-1",
    key: "contacts-utiles",
    value: "mairie",
    position: 1,
    service_id: "service-1",
    text: "Mairie de Test, contact@mairie-test.fr",
  },
  {
    id: "clause-bonnes-pratiques-1",
    key: "bonnes-pratiques",
    value: "materiaux",
    position: 1,
    service_id: "service-1",
    text: "Utiliser des matériaux traditionnels.",
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
  {
    nom: "Test",
    prenom: "Runner 3",
    email: "testrunner3@yopmail.com",
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

  await page.waitForTimeout(1000);
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
