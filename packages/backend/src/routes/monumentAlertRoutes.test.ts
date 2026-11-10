import { describe, expect, it, vi } from "vitest";

vi.mock("../db/db", () => ({ db: {} }));
vi.mock("../features/mail", () => ({ sendMonumentAlertEmail: vi.fn() }));

const { getMonumentAlertRecipients } = await import("./monumentAlertRoutes");

describe("getMonumentAlertRecipients", () => {
  it("merges mandatory and additional emails, lowercased, deduplicated, valid only", () => {
    expect(
      getMonumentAlertRecipients({
        mandatory_emails: "CRMH:crmh@culture.gouv.fr;CAOA:;Mairie:Mairie@Ville.fr",
        additional_emails: " mairie@ville.fr, autre@ville.fr ,pas-un-email",
      }),
    ).toEqual(["crmh@culture.gouv.fr", "mairie@ville.fr", "autre@ville.fr"]);
  });

  it("returns nothing without emails", () => {
    expect(getMonumentAlertRecipients({ mandatory_emails: null, additional_emails: null })).toEqual([]);
  });
});
