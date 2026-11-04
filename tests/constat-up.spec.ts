import { test, expect, type Page } from "@playwright/test";
import { mockUsers, signup, login } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";
import { hasUpLeftForRapport } from "../packages/frontend/src/features/up/rapportGroupe.utils";

// "Château complexe de Test" (TEST00002) is split into unités patrimoniales by the backend UP mock
// (packages/backend/src/features/up/fixtures/up-mock.json):
//   Chapelle, Corps de logis (> Aile nord, Aile sud), Jardin

/** Types in the monument search and picks an option; retries while the constat form and monuments are loading. */
const pickMonument = async (page: Page, search: string, option: RegExp) => {
  const autocomplete = page.getByLabel("Nom ou référence du monument");
  await autocomplete.waitFor();
  await expect(async () => {
    await autocomplete.fill("");
    await autocomplete.fill(search);
    await expect(page.getByRole("option", { name: option })).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 60_000 });
  await page.getByRole("option", { name: option }).click();
};

const startConstatOnComplexMonument = async (page: Page) => {
  await page.getByText("Créer un constat d'état").click();
  await page.waitForURL((url) => url.pathname.startsWith("/constat/"));

  await pickMonument(page, "Château complexe", /Château complexe de Test/);

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Créer un constat d’état")).toBeVisible();
  return dialog;
};

/**
 * The test stack sometimes reloads the page right after the first visit (service worker install), which wipes the
 * signup/login form: retry, logging in if the account was created by an earlier attempt.
 */
const ensureLoggedIn = async (page: Page, { signupFirst }: { signupFirst: boolean }) => {
  let shouldSignup = signupFirst;
  await expect(async () => {
    const attempt = shouldSignup ? signup : login;
    shouldSignup = !shouldSignup;
    await page.goto(attempt === signup ? "./inscription" : "./connexion");
    await page.waitForSelector("input[name=email]");
    await page.waitForTimeout(1_000);
    await attempt({ page, user: mockUsers[0] });
  }).toPass({ timeout: 150_000 });
};

const getConstatId = (page: Page) => new URL(page.url()).pathname.split("/")[2]!;

const fillContexteVisite = async (page: Page) => {
  await page.getByRole("button", { name: "Contexte de la visite" }).click();
  await page.waitForURL((url) => url.search.includes("contexte-visite"));
  await page.locator("input[id=nature-visite-0]").check({ force: true });
  await page.getByLabel("Date de la visite").fill("2024-01-15");
  await page.fill("input[name=redacted_by]", "Agent Test");
  await page.fill("input[name=proprietaire]", "Jean Dupont");
  await page.fill("input[name=proprietaire_email]", "jean.dupont@example.com");
  await page.getByRole("button", { name: /Constat d'état/ }).click();
  await page.waitForURL((url) => url.search.includes("constat-detaille"));
};

/** Constat détaillé (évaluation v2): « Niveau de dégradation » of the « Couverture » section. */
const fillCouverture = async (page: Page, niveau = "Léger") => {
  await page.getByRole("button", { name: "Couverture" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  await dialog.getByRole("radio", { name: niveau }).check({ force: true });
  await dialog.locator("textarea").fill(`Dégradation ${niveau.toLowerCase()} de la couverture.`);
  await dialog.getByRole("button", { name: "Valider" }).click();
  await dialog.waitFor({ state: "hidden" });
};

const fillConstatGeneral = async (page: Page) => {
  await page.getByRole("button", { name: "Constat général" }).click();
  await page.waitForURL((url) => url.search.includes("constat-general"));
  await page.getByRole("radio", { name: "Bon" }).first().check({ force: true });
};

test.describe("Constat d'état sur un MH complexe", () => {
  // first sync after signup/login can be slow on the test stack
  test.describe.configure({ timeout: 240_000 });

  test.beforeAll(async () => {
    await resetDatabase();
  });

  // AuthContext reloads the page on the very first visit (no "crvif/version" yet), which can wipe the signup form
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("crvif/version", "1"));
    page.setDefaultNavigationTimeout(20_000);
  });

  test("ne propose pas d'enchaînement quand toutes les parties sont déjà couvertes", () => {
    const tree = { rootId: "monument", ups: [{ id: "monument" }, { id: "chapelle" }] } as any;
    expect(hasUpLeftForRapport(tree, new Set([null, "chapelle"]))).toBe(false);
    expect(hasUpLeftForRapport(tree, new Set(["chapelle"]))).toBe(true); // « Ensemble du monument » is still free
  });

  test("constat sur une UP de second niveau", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: true });

    const dialog = await startConstatOnComplexMonument(page);

    await expect(dialog.getByText("Pour quelle partie du monument")).toBeVisible();
    await expect(dialog.getByRole("radio", { name: "Ensemble du monument" })).toBeVisible();
    await expect(dialog.getByRole("radio")).toHaveCount(4);
    await expect(dialog.getByRole("button", { name: "Créer un constat" })).toBeDisabled();

    // browse into "Corps de logis"
    await dialog.getByRole("button", { name: "Voir les UP de niveau inférieur de Corps de logis" }).click();
    await expect(dialog.getByText("Corps de logis", { exact: true })).toBeVisible();
    await expect(dialog.getByRole("radio", { name: "Ensemble de l’UP" })).toBeVisible();

    await dialog.getByRole("radio", { name: "Aile sud" }).check({ force: true });
    await dialog.getByRole("button", { name: "Créer un constat" }).click();
    await dialog.waitFor({ state: "hidden" });

    await expect(page.getByText("Château complexe de Test | Aile sud")).toBeVisible();
    await expect(page.getByText("Changer de monument ou d’UP")).toBeVisible();

    // Informations step: "Monument historique" and "Unité patrimoniale" blocks
    const infos = page.locator("main");
    await expect(infos.getByRole("heading", { name: "Unité patrimoniale" }).first()).toBeVisible();
    await expect(infos.getByText("ITEST1").first()).toBeVisible(); // identifiant agrégé du monument
    await expect(infos.getByText("ITEST6").first()).toBeVisible(); // identifiant agrégé de l'UP
    await expect(infos.getByText("Partie d'immeuble").first()).toBeVisible();
    await expect(infos.getByText("Classé", { exact: true }).first()).toBeVisible();
    await expect(infos.getByText("Corps de logis", { exact: true }).first()).toBeVisible(); // "Fait partie de"

    const id = getConstatId(page);
    await expect
      .poll(async () => {
        const report = await db.selectFrom("state_report").selectAll().where("id", "=", id).executeTakeFirst();
        return report && { ref: report.reference_pop, up: report.up_id, chemin: report.up_chemin };
      })
      .toEqual({
        ref: "TEST00002",
        up: "mock-test-6",
        chemin: JSON.stringify([{ id: "mock-test-2", intitule: "Corps de logis" }]),
      });

    // switch to another UP of the same monument without losing the constat
    await page.getByText("Changer de monument ou d’UP").click();
    await page.getByRole("button", { name: "Changer d’UP" }).click();
    const changeDialog = page.getByRole("dialog");
    // the dialog opens on the level of the current UP (inside "Corps de logis"): go back up to reach "Chapelle"
    await changeDialog.getByText("Retour").click();
    await changeDialog.getByRole("radio", { name: "Chapelle" }).check({ force: true });
    await changeDialog.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("Château complexe de Test | Chapelle")).toBeVisible();

    await expect
      .poll(async () => {
        const report = await db.selectFrom("state_report").selectAll().where("id", "=", id).executeTakeFirst();
        return report && { up: report.up_id, identifiant: report.up_identifiant, chemin: report.up_chemin };
      })
      .toEqual({ up: "mock-test-3", identifiant: "ITEST3", chemin: null });
  });

  test("constat sur l'ensemble du monument, et annulation", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });

    // "Annuler" leaves the constat without monument
    let dialog = await startConstatOnComplexMonument(page);
    await dialog.getByRole("button", { name: "Annuler" }).click();
    await dialog.waitFor({ state: "hidden" });
    await expect(page.getByLabel("Nom ou référence du monument")).toBeVisible();

    await pickMonument(page, "Château complexe", /Château complexe de Test/);
    dialog = page.getByRole("dialog");
    await dialog.getByRole("radio", { name: "Ensemble du monument" }).check({ force: true });
    await dialog.getByRole("button", { name: "Créer un constat" }).click();
    await dialog.waitFor({ state: "hidden" });

    await expect(page.getByRole("heading", { name: "Château complexe de Test", exact: true })).toBeVisible();

    const id = getConstatId(page);
    await expect
      .poll(async () => {
        const report = await db.selectFrom("state_report").selectAll().where("id", "=", id).executeTakeFirst();
        return report && { ref: report.reference_pop, up: report.up_id, monument: report.up_monument_identifiant };
      })
      .toEqual({ ref: "TEST00002", up: null, monument: "ITEST1" });
  });

  test("les constats antérieurs d'une UP ne montrent que ceux de cette UP", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });

    const user = await db
      .selectFrom("user")
      .select(["id", "service_id"])
      .where("email", "=", mockUsers[0].email)
      .executeTakeFirstOrThrow();
    const sentConstat = (id: string, date: string, up: { id: string; intitule: string } | null) => ({
      id,
      version: 2,
      reference_pop: "TEST00002",
      titre_edifice: "Château complexe de Test",
      up_id: up?.id ?? null,
      up_intitule: up?.intitule ?? null,
      up_monument_identifiant: "ITEST1",
      nature_visite: "complète",
      redacted_by: "Agent Antérieur",
      attachment_id: `fake-pdf-${id}`,
      disabled: false,
      service_id: user.service_id,
      created_by: user.id,
      created_at: date,
    });
    await db
      .insertInto("state_report")
      .values([
        sentConstat("prev-chapelle", "2025-01-10T10:00:00.000Z", { id: "mock-test-3", intitule: "Chapelle" }),
        sentConstat("prev-jardin", "2025-02-10T10:00:00.000Z", { id: "mock-test-4", intitule: "Jardin" }),
        sentConstat("prev-ensemble", "2025-03-10T10:00:00.000Z", null),
      ])
      .execute();

    const dialog = await startConstatOnComplexMonument(page);
    await dialog.getByRole("radio", { name: "Chapelle" }).check({ force: true });
    await dialog.getByRole("button", { name: "Créer un constat" }).click();
    await dialog.waitFor({ state: "hidden" });

    const previous = page.getByRole("button", { name: "Constats antérieurs" }).first();
    await expect(previous).toBeVisible({ timeout: 30_000 });
    await previous.click();
    await expect(page.getByText("10/01/2025 - visite complète - Chapelle").first()).toBeVisible();
    await expect(page.getByText("10/02/2025")).toHaveCount(0);
    await expect(page.getByText("10/03/2025")).toHaveCount(0);
  });

  test("rapport groupé : deux UP enchaînées, envoyées dans un seul PDF et un seul courriel", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });
    const mailpitPort = process.env.MAILPIT_WEB_PORT ?? "3018";
    await page.request.delete(`http://localhost:${mailpitPort}/api/v1/messages`);

    // 1st constat: Chapelle
    const dialog = await startConstatOnComplexMonument(page);
    await dialog.getByRole("radio", { name: "Chapelle" }).check({ force: true });
    await dialog.getByRole("button", { name: "Créer un constat" }).click();
    await dialog.waitFor({ state: "hidden" });
    await expect(page.getByText("Château complexe de Test | Chapelle")).toBeVisible();
    const chapelleId = getConstatId(page);

    await fillContexteVisite(page);
    await fillCouverture(page);
    await fillConstatGeneral(page);
    await page.getByRole("button", { name: "Finaliser le constat" }).click();

    // « Finaliser le constat » offers the other UP of the monument (Chapelle, already done, is not listed)
    const finaliser = page.getByRole("dialog");
    await expect(finaliser.getByRole("heading", { name: "Finaliser le constat" })).toBeVisible();
    await expect(finaliser.getByText("Vos observations seront réunies au sein d’un même document.")).toBeVisible();
    await expect(finaliser.getByRole("radio", { name: "Chapelle" })).toHaveCount(0);
    await expect(finaliser.getByRole("button", { name: "Commencer un nouveau constat" })).toBeDisabled();
    await finaliser.getByRole("radio", { name: "Jardin" }).check({ force: true });
    await finaliser.getByRole("button", { name: "Commencer un nouveau constat" }).click();

    // 2nd constat: Jardin, same rapport, visit context prefilled
    await page.waitForURL((url) => !url.pathname.includes(chapelleId) && url.search.includes("contexte-visite"));
    const jardinId = getConstatId(page);
    await expect(page.getByText("Château complexe de Test | Jardin")).toBeVisible();
    await expect(page.getByText("Ce constat sera envoyé dans un même document avec : Chapelle")).toBeVisible();
    await expect(page.locator("input[name=proprietaire]")).toHaveValue("Jean Dupont");
    await expect(page.locator("input[name=redacted_by]")).toHaveValue("Agent Test");

    await expect
      .poll(async () => {
        const reports = await db
          .selectFrom("state_report")
          .select(["id", "rapport_id", "up_id", "proprietaire_email"])
          .where("id", "in", [chapelleId, jardinId])
          .execute();
        const chapelle = reports.find((r) => r.id === chapelleId);
        const jardin = reports.find((r) => r.id === jardinId);
        return {
          sameRapport: !!chapelle?.rapport_id && chapelle.rapport_id === jardin?.rapport_id,
          jardinUp: jardin?.up_id,
          jardinEmail: jardin?.proprietaire_email,
        };
      })
      .toEqual({ sameRapport: true, jardinUp: "mock-test-4", jardinEmail: "jean.dupont@example.com" });

    await page.getByRole("button", { name: /Constat d'état/ }).click();
    await page.waitForURL((url) => url.search.includes("constat-detaille"));
    await fillCouverture(page, "Important");
    await fillConstatGeneral(page);
    await page.getByRole("button", { name: "Finaliser le constat" }).click();

    const finaliserJardin = page.getByRole("dialog");
    await expect(finaliserJardin.getByRole("heading", { name: "Finaliser le constat" })).toBeVisible();
    await expect(finaliserJardin.getByRole("radio", { name: "Jardin" })).toHaveCount(0);
    await expect(finaliserJardin.getByRole("radio", { name: "Chapelle" })).toHaveCount(0);
    await finaliserJardin.getByRole("button", { name: "Passer et finaliser" }).click();

    // one preview for both constats
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));
    await expect(page.getByText("Prévisualisation du rapport (2 constats)")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText("Ces 2 constats seront envoyés ensemble")).toBeVisible();
    await expect(page.getByText("Chapitre 1 :")).toBeVisible();
    await expect(page.getByText("Chapitre 2 :")).toBeVisible();

    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));
    const recipient = `rapport+${Date.now()}@example.com`;
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.waitFor();
    await emailInput.fill(recipient);
    await emailInput.press("Enter");
    await page.getByText(recipient).waitFor();
    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));
    await expect(page.getByText("Votre constat d'état a bien été envoyé !")).toBeVisible();

    // both constats share the same PDF
    const [chapelle, jardin] = await Promise.all(
      [chapelleId, jardinId].map((id) =>
        db.selectFrom("state_report").select(["attachment_id"]).where("id", "=", id).executeTakeFirstOrThrow(),
      ),
    );
    expect(chapelle.attachment_id).toBeTruthy();
    expect(jardin.attachment_id).toBe(chapelle.attachment_id);

    // a single email, naming the monument and its parts
    await expect
      .poll(
        async () => {
          const response = await page.request.get(`http://localhost:${mailpitPort}/api/v1/messages`);
          const { messages } = await response.json();
          return messages
            .filter((m: any) => m.To.some((to: any) => to.Address === recipient))
            .map((m: any) => m.Subject);
        },
        { timeout: 20_000 },
      )
      .toEqual(["Constat d'état  : Château complexe de Test (2 parties du monument)"]);

    // the rapport is closed: its constats are read-only
    await page.goto(`./constat/${chapelleId}?step=constat-general&mode=view`);
    await expect(page.getByRole("button", { name: "Voir le constat" })).toBeVisible({ timeout: 30_000 });
  });

  test("rapport groupé : un constat incomplet bloque l'envoi", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });

    const dialog = await startConstatOnComplexMonument(page);
    await dialog.getByRole("radio", { name: "Ensemble du monument" }).check({ force: true });
    await dialog.getByRole("button", { name: "Créer un constat" }).click();
    await dialog.waitFor({ state: "hidden" });
    const ensembleId = getConstatId(page);

    await fillContexteVisite(page);
    await fillCouverture(page);
    await fillConstatGeneral(page);
    await page.getByRole("button", { name: "Finaliser le constat" }).click();

    const finaliser = page.getByRole("dialog");
    await expect(finaliser.getByRole("radio", { name: "Ensemble du monument" })).toBeDisabled();
    await finaliser.getByRole("button", { name: "Voir les UP de niveau inférieur de Corps de logis" }).click();
    await finaliser.getByRole("radio", { name: "Aile nord" }).check({ force: true });
    await finaliser.getByRole("button", { name: "Commencer un nouveau constat" }).click();
    await page.waitForURL((url) => !url.pathname.includes(ensembleId) && url.search.includes("contexte-visite"));
    await expect(page.getByText("Château complexe de Test | Aile nord")).toBeVisible();

    // back to the first constat, without filling the second one
    await page.getByRole("link", { name: "Ensemble du monument" }).click();
    await page.waitForURL((url) => url.pathname.includes(ensembleId));
    await page.goto(`./constat/${ensembleId}?step=constat-general&mode=view`);
    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Passer et finaliser" }).click();

    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));
    await expect(page.getByText("Prévisualisation du rapport (2 constats)")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/à compléter : .*État général/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Continuer" })).toBeDisabled();
  });

  test("un MH simple se finalise et s'envoie seul, sans fenêtre de rapport groupé", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });

    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));
    await pickMonument(page, "Château de Test", /^Château de Test/);
    await expect(page.getByRole("heading", { name: "Château de Test", exact: true })).toBeVisible();
    const id = getConstatId(page);

    await fillContexteVisite(page);
    await fillCouverture(page);
    await fillConstatGeneral(page);
    await page.getByRole("button", { name: "Finaliser le constat" }).click();
    await page.waitForURL((url) => url.pathname.includes("/pdf") && url.search.includes("mode=view"));
    await expect(page.getByText("Prévisualisation du constat")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/seront envoyés ensemble/)).toHaveCount(0);

    await page.getByRole("button", { name: "Continuer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=send"));
    const recipient = `simple+${Date.now()}@example.com`;
    const emailInput = page.locator('input[type="text"]').first();
    await emailInput.fill(recipient);
    await emailInput.press("Enter");
    await page.getByText(recipient).waitFor();
    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForURL((url) => url.search.includes("mode=sent"));

    const report = await db
      .selectFrom("state_report")
      .select(["attachment_id", "rapport_id"])
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
    expect(report.attachment_id).toBeTruthy();
    expect(report.rapport_id).toBeNull();
  });

  test("un MH simple ne propose pas d'UP", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });

    await page.getByText("Créer un constat d'état").click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));
    await pickMonument(page, "Château de Test", /^Château de Test/);
    await expect(page.getByRole("heading", { name: "Château de Test", exact: true })).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByText("Changer de monument", { exact: true })).toBeVisible();
  });
});
