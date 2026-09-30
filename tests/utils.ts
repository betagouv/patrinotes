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

  // "Fonction" is a preset dropdown (JobSelect) with a free-text fallback behind
  // the "Autre..." option — mockUsers' job values aren't in the preset list.
  await page.getByLabel("Fonction").selectOption("Autre...");
  await page.getByLabel("Précisez votre fonction").fill(user.job);

  await page.selectOption("select[name=service_id]", udap);

  await page.check("input[name=cgu]", { force: true });

  await page.click("button[type=submit]");

  await page.waitForURL((url) => url.pathname === "/");

  await waitForLoggedIn(page);
};

export const login = async ({ page, user }: { page: Page; user: User }) => {
  await page.goto("./connexion");
  await page.fill("input[name=email]", user.email);
  await page.fill("input[name=password]", user.password);
  await page.click("button[type=submit]");
  await page.waitForURL((url) => url.pathname === "/");
  await waitForLoggedIn(page);
};

export const waitForLoggedIn = async (page: Page) => {
  await page.waitForSelector("text=Déconnexion", { state: "attached" });
};

/**
 * Creates a new constat, selects the mock monument, fills the mandatory
 * "Contexte de la visite" fields and fills one detailed section
 * ("Couverture"). Leaves the user on the "constat-detaille" step so callers
 * can add alerts/photos before moving on to "Constat général".
 */
export const fillMinimalConstat = async (
  page: Page,
  opts?: { proprietaireEmail?: string; visitDate?: string; sectionComment?: string },
) => {
  await page.getByText("Créer un constat d'état").click();
  await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

  const autocomplete = page.getByLabel("Nom ou référence du monument");
  await autocomplete.waitFor();
  await autocomplete.fill("Château de Test");
  await page.getByRole("option", { name: /Château de Test/ }).click();
  await page.waitForFunction(() => document.body.innerText.includes("Château de Test"));

  await page.getByRole("button", { name: "Contexte de la visite" }).click();
  await page.waitForURL((url) => url.search.includes("contexte-visite"));

  await page.locator("input[id=nature-visite-0]").check({ force: true });
  await page.getByLabel("Date de la visite").fill(opts?.visitDate ?? "2024-01-15");
  await page.fill("input[name=redacted_by]", "Agent Test");
  await page.fill("input[name=proprietaire]", "Jean Dupont");
  await page.fill("input[name=proprietaire_email]", opts?.proprietaireEmail ?? "jean.dupont@example.com");

  await page.getByRole("button", { name: /Constat d'état/ }).click();
  await page.waitForURL((url) => url.search.includes("constat-detaille"));

  await page.getByRole("button", { name: "Couverture" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  await dialog.getByRole("radio", { name: "Bon" }).check({ force: true });
  await dialog.getByRole("radio", { name: "50%" }).check({ force: true });
  await dialog.locator("textarea").fill(opts?.sectionComment ?? "Bon état général, pas de dégradation visible.");
  await dialog.getByRole("button", { name: "Valider" }).click();
  await dialog.waitFor({ state: "hidden" });
};

/**
 * From the "constat-detaille" step, navigates to "Constat général", fills
 * the mandatory état/proportion radios and finalizes, landing on the PDF
 * preview (mode=view).
 */
export const finalizeConstat = async (page: Page) => {
  await page.getByRole("button", { name: "Constat général" }).click();
  await page.waitForURL((url) => url.search.includes("constat-general"));

  await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
  await page.getByRole("radio", { name: "50%" }).first().check({ force: true });

  await page.getByRole("button", { name: "Finaliser le constat" }).click();
  await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));
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
