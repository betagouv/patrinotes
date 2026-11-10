import { test, expect, type Page } from "@playwright/test";
import { db } from "../packages/backend/src/db/db";
import { resetDatabase } from "./setup";
import { login, mockUsers, openMonumentFiche, signup, startConstatFromFiche } from "./utils";

// "Château de Test" (TEST00001) is a MH simple with two objets mobiliers; "Château complexe de Test" (TEST00002)
// is split into unités patrimoniales by the backend UP mock: Chapelle, Corps de logis (> Aile nord, Aile sud), Jardin.

/** The app scrolls inside a 100vh layout: a tall viewport shows the whole fiche. */
const screenshot = async (page: Page, name: string) => {
  const size = page.viewportSize()!;
  await page.setViewportSize({ width: size.width, height: 2600 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `test-results/fiche-mh/${name}.png` });
  await page.setViewportSize(size);
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

const mailpitApi = () => `http://localhost:${process.env.MAILPIT_WEB_PORT ?? "3018"}/api/v1`;

test.describe("Fiche MH", () => {
  test.describe.configure({ timeout: 240_000 });
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeAll(async () => {
    await resetDatabase();
    // emails of the services an alert goes to (objets mobiliers: CAOA and CRMH; abords: UDAP)
    await db
      .updateTable("service")
      .set({ courriel_caoa: "caoa@test.fr", courriel_crmh: "crmh@test.fr", courriel_udap: "udap@test.fr" })
      .where("id", "=", "service-1")
      .execute();
  });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("crvif/version", "1"));
    page.setDefaultNavigationTimeout(20_000);
  });

  test("fiche d'un MH simple : informations, objets, corrections reprises par le constat", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: true });
    await openMonumentFiche(page, "Château de Test", /^Château de Test/);

    await expect(page.getByRole("heading", { level: 1, name: "Château de Test" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Informations" })).toBeVisible();
    await expect(page.getByText("Façades et toitures")).toBeVisible();
    await expect(page.getByText("AB 12")).toBeVisible();
    await expect(page.getByRole("link", { name: "Table de test" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ensemble patrimonial" })).toHaveCount(0);
    await screenshot(page, "1-mh-simple");

    // « Compléter les infos »: the service corrects the cadastre
    await page.getByRole("button", { name: "Compléter les infos" }).click();
    await page.getByLabel("Référence cadastrale").fill("AB 99");
    await page.getByRole("button", { name: "Valider les modifications" }).click();
    await expect(page.getByText("AB 99")).toBeVisible();
    await expect
      .poll(async () => (await db.selectFrom("monument_correction").select("reference_cadastrale").execute())[0]?.reference_cadastrale, {
        timeout: 30_000,
      })
      .toBe("AB 99");

    // the constat created from the fiche gets the corrected information
    await page.getByRole("button", { name: "Créer un constat d’état" }).click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));
    const constatId = new URL(page.url()).pathname.split("/")[2]!;
    await expect(page.getByText("AB 99")).toBeVisible();
    await expect
      .poll(
        async () =>
          (await db.selectFrom("state_report").select(["reference_pop", "reference_cadastrale"]).where("id", "=", constatId).executeTakeFirst()) ??
          null,
        { timeout: 30_000 },
      )
      .toEqual({ reference_pop: "TEST00001", reference_cadastrale: "AB 99" });

    // and leads back to the fiche
    await page.getByRole("link", { name: "Voir la fiche du monument" }).click();
    await page.waitForURL((url) => url.pathname === "/monument/TEST00001");
  });

  test("alerte depuis la fiche, sans constat, envoyée par courriel", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });
    await page.request.delete(`${mailpitApi()}/messages`);
    await openMonumentFiche(page, "Château de Test", /^Château de Test/);

    await page.getByRole("button", { name: "Signaler une alerte…" }).click();
    const drawer = page.locator(".MuiDrawer-paper");
    await drawer.getByRole("button", { name: /Abords de l'édifice/ }).click();
    await expect(drawer.getByText("Alerte : Abords de l'édifice")).toBeVisible();
    await expect(drawer.getByText("udap@test.fr")).toBeVisible();
    await drawer.getByLabel("Commentaires").fill("Fissure sur le mur d'enceinte");
    await screenshot(page, "2-alerte-formulaire");
    await drawer.getByRole("button", { name: "Valider" }).click();
    await expect(drawer.getByText("Alerte signalée")).toBeVisible();
    await screenshot(page, "3-alerte-signalee");
    await drawer.getByRole("button", { name: "Fermer" }).click();

    // sent by the outbox once synced
    await expect
      .poll(
        async () =>
          (await db.selectFrom("monument_alert").select(["status", "sent_at"]).where("kind", "=", "alerte").execute())[0] ?? null,
        { timeout: 60_000 },
      )
      .toMatchObject({ status: "submitted", sent_at: expect.anything() });
    await expect
      .poll(
        async () => {
          const response = await page.request.get(`${mailpitApi()}/search?query=${encodeURIComponent("to:udap@test.fr")}`);
          const { messages } = await response.json();
          return messages.map((m: { Subject: string }) => m.Subject);
        },
        { timeout: 30_000 },
      )
      .toContain("Alerte Abords de l'édifice - Château de Test");

    // it shows in the history of the fiche
    await page.getByRole("button", { name: /^Historique/ }).click();
    await expect(page.getByText("Commentaires : Fissure sur le mur d'enceinte")).toBeVisible();
    await expect(page.getByText(/Envoyée à : udap@test.fr/)).toBeVisible({ timeout: 30_000 });
    await screenshot(page, "4-historique");
  });

  test("fiche d'un objet mobilier : annotation depuis le constat et alerte", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });

    // annotation de visite: a click on the objet's card in the constat, kept on the objet's fiche without email
    await startConstatFromFiche(page, "Château de Test", /^Château de Test/);
    await page.getByRole("button", { name: "Table de test" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("group", { name: "Présence de l’objet" }).getByText("Oui").click();
    await dialog.getByRole("group", { name: "L’objet est-il en sécurité ?" }).getByText("Non").click();
    await dialog.getByLabel("Commentaires").fill("La porte de l’édifice ne ferme pas.");
    await screenshot(page, "5-annotation");
    await dialog.getByRole("button", { name: "Valider" }).click();
    await dialog.waitFor({ state: "hidden" });
    await expect(page).toHaveURL(/\/constat\//);

    await page.goto("./objet/OBJ00001");
    await expect(page.getByRole("heading", { level: 1, name: "Table de test" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Édifice de conservation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Château de Test" }).first()).toBeVisible();

    await page.getByRole("button", { name: /^Historique/ }).click();
    await expect(page.getByText("Annotations de visite")).toBeVisible();
    await expect(page.getByText("Objet présent au sein de l’édifice")).toBeVisible();
    await expect(page.getByText("Objet en insécurité")).toBeVisible();

    // alerte on the objet: its form opens directly
    await page.getByRole("button", { name: "Signaler une alerte…" }).click();
    const drawer = page.locator(".MuiDrawer-paper");
    await drawer.getByText("Dégradation importante").click();
    await drawer.getByLabel("Commentaires").fill("Moisissures sur l’ensemble de l’objet");
    await drawer.getByRole("button", { name: "Valider" }).click();
    await expect(drawer.getByText("Alerte signalée")).toBeVisible();
    await drawer.getByRole("button", { name: "Fermer" }).click();

    await expect(page.getByText("Commentaires : Moisissures sur l’ensemble de l’objet")).toBeVisible();
    await screenshot(page, "6-fiche-objet");

    // uploaded by PowerSync
    await expect
      .poll(
        () =>
          db
            .selectFrom("monument_alert")
            .select(["kind", "status", "probleme", "presence", "securite", "should_send"])
            .where("objet_reference", "=", "OBJ00001")
            .orderBy("created_at")
            .execute(),
        { timeout: 30_000 },
      )
      .toMatchObject([
        { kind: "annotation", status: "submitted", presence: "oui", securite: "non", should_send: false },
        { kind: "alerte", status: "submitted", probleme: "Dégradation importante", should_send: true },
      ]);
  });

  test("MH complexe : arbre de l'ensemble patrimonial et fiche d'une UP", async ({ page }) => {
    await ensureLoggedIn(page, { signupFirst: false });
    await openMonumentFiche(page, "Château complexe", /Château complexe de Test/);

    await expect(page.getByRole("heading", { name: "Ensemble patrimonial" })).toBeVisible({ timeout: 30_000 });
    const tree = page.getByRole("tree", { name: "Ensemble patrimonial" });
    await expect(tree.getByRole("link", { name: "Chapelle" })).toBeVisible();
    await expect(tree.getByRole("link", { name: "Aile sud" })).toHaveCount(0);
    await screenshot(page, "7-mh-complexe");

    // the hierarchy opens one level at a time
    await tree.getByRole("button", { name: "Déplier Corps de logis" }).click();
    await expect(tree.getByRole("link", { name: "Aile sud" })).toBeVisible();

    await tree.getByRole("link", { name: "Aile sud" }).click();
    await page.waitForURL((url) => url.searchParams.get("up") === "mock-test-6");
    await expect(page.getByRole("heading", { level: 1, name: "Aile sud" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Unité patrimoniale" })).toBeVisible();
    await expect(page.getByText("ITEST6")).toBeVisible();
    await expect(tree.getByText("Aile sud")).toHaveAttribute("aria-current", "page");
    await screenshot(page, "8-fiche-up");
    await page.setViewportSize({ width: 360, height: 800 });
    await screenshot(page, "9-fiche-up-mobile");
    await page.setViewportSize({ width: 1440, height: 900 });

    // a constat from an UP's fiche is about that UP, without asking
    await page.getByRole("button", { name: "Créer un constat d’état" }).click();
    await page.waitForURL((url) => url.pathname.startsWith("/constat/"));
    await expect(page.getByText("Château complexe de Test | Aile sud")).toBeVisible();
    const constatId = new URL(page.url()).pathname.split("/")[2]!;
    await expect
      .poll(
        async () =>
          (await db.selectFrom("state_report").select(["up_id", "up_chemin"]).where("id", "=", constatId).executeTakeFirst()) ?? null,
        { timeout: 30_000 },
      )
      .toEqual({ up_id: "mock-test-6", up_chemin: JSON.stringify([{ id: "mock-test-2", intitule: "Corps de logis" }]) });
  });
});
