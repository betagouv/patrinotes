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

/** MH complexe: its unités patrimoniales come from the backend UP mock (features/up/fixtures/up-mock.json). */
export const mockPopImmeubleComplexe = {
  ...mockPopImmeuble,
  reference: "TEST00002",
  id: "TEST00002",
  titre_editorial_de_la_notice: "Château complexe de Test",
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
  },
  {
    nom: "Test",
    prenom: "Runner 2",
    email: "testrunner2@yopmail.com",
    job: "Testeur",
  },
  {
    nom: "Test",
    prenom: "Runner 3",
    email: "testrunner3@yopmail.com",
    job: "Testeur",
  },
];

type User = (typeof mockUsers)[0];

// --- sign-in by email: the code is read from the email caught by Mailpit ---------------------------

const MAILPIT_URL = `http://localhost:${process.env.MAILPIT_WEB_PORT ?? "3018"}`;
const BACKEND_API = `http://localhost:${process.env.BACKEND_PORT}/api`;

const mailpitQuery = (email: string) => encodeURIComponent(`to:"${email}"`);

/** Removes the sign-in emails already received by this address, so the next one is unambiguous. */
export const clearLoginMails = async (email: string) => {
  await fetch(`${MAILPIT_URL}/api/v1/search?query=${mailpitQuery(email)}`, { method: "DELETE" });
};

/** Waits for the sign-in email of this address and returns its code and link. */
export const getLoginMail = async (email: string) => {
  for (let attempt = 0; attempt < 50; attempt++) {
    const search = await fetch(`${MAILPIT_URL}/api/v1/search?query=${mailpitQuery(email)}&limit=1`).then((r) =>
      r.json(),
    );
    const id = search.messages?.[0]?.ID;
    if (id) {
      const message = await fetch(`${MAILPIT_URL}/api/v1/message/${id}`).then((r) => r.json());
      const html: string = message.HTML ?? "";
      const code = html.match(/data-test-id="login-code">\s*(\d{6})\s*</)?.[1];
      const link = html.match(/href="([^"]*\/auth-callback\?magic=[^"]+)"/)?.[1]?.replace(/&amp;/g, "&");
      if (code && link) return { code, link };
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`No sign-in email received by ${email}`);
};

// The test stack may reload the page on its own (Vite optimizing a dependency on first use, the first
// visit of a fresh browser context, service worker install), wiping what a form step had typed: each
// step below is retried a few times.
const MAX_ATTEMPTS = 3;
const STEP_TIMEOUT = 15_000;

/**
 * Fills the email on /connexion and types the code received by email.
 * Resolves with where the app went: "/" (account exists) or "/inscription" (first sign-in).
 */
const signInWithCode = async (page: Page, email: string): Promise<"/" | "/inscription"> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await clearLoginMails(email);
      await page.goto("./connexion");
      await page.fill("input[name=email]", email);
      await page.getByRole("button", { name: "Recevoir un lien de connexion" }).click();
      await page.waitForSelector("input[name=code]", { timeout: STEP_TIMEOUT });

      const { code } = await getLoginMail(email);
      await page.fill("input[name=code]", code);
      await page.getByRole("button", { name: "Se connecter" }).click();

      await page.waitForURL((url) => url.pathname === "/" || url.pathname === "/inscription", {
        timeout: STEP_TIMEOUT,
      });
      return new URL(page.url()).pathname as "/" | "/inscription";
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

/** First sign-in: email + code, then the profile form on /inscription. Just signs in if the account exists. */
export const signup = async ({ page, user, udap = mockServices[0].id }: { page: Page; user: User; udap?: string }) => {
  const landing = await signInWithCode(page, user.email);

  if (landing === "/inscription") {
    let lastError: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        // the verified sign-in is kept in localStorage, the form survives a reload empty
        await page.fill("input[name=nom]", user.nom);
        await page.fill("input[name=prenom]", user.prenom);

        // "Fonction" is a preset dropdown (JobSelect) with a free-text fallback behind
        // the "Autre..." option — mockUsers' job values aren't in the preset list.
        await page.getByLabel("Fonction").selectOption("Autre...");
        await page.getByLabel("Précisez votre fonction").fill(user.job);

        await page.selectOption("select[name=service_id]", udap);

        await page.check("input[name=cgu]", { force: true });

        await page.click("button[type=submit]");

        await page.waitForURL((url) => url.pathname === "/", { timeout: STEP_TIMEOUT });
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
        if (new URL(page.url()).pathname !== "/inscription") break;
      }
    }
    if (lastError) throw lastError;
  }

  await waitForLoggedIn(page);
};

export const login = async ({ page, user }: { page: Page; user: Pick<User, "email"> }) => {
  const landing = await signInWithCode(page, user.email);
  if (landing === "/inscription") throw new Error(`${user.email} has no account yet`);
  await waitForLoggedIn(page);
};

/**
 * Signs in through the API (no browser) and returns the session; creates the account on the first
 * sign-in. For API tests that need a bearer token.
 */
export const apiSignIn = async (user: User, serviceId = mockServices[0].id) => {
  const post = async (path: string, body: unknown) => {
    const resp = await fetch(`${BACKEND_API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(`${path}: ${resp.status} ${JSON.stringify(data)}`);
    return data;
  };

  await clearLoginMails(user.email);
  await post("/auth/magic-link", { email: user.email });
  const { code } = await getLoginMail(user.email);
  let result = await post("/auth/magic-link/verify", { email: user.email, code });

  if (result.status === "signup-required") {
    result = await post("/auth/signup", {
      signupToken: result.signupToken,
      name: `${user.prenom} ${user.nom}`,
      job: user.job,
      service_id: serviceId,
      newsletter: false,
      cgu: true,
    });
  }

  return result as { accessToken: string; refreshToken: string; expiresAt: string; user: { id: string } };
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
