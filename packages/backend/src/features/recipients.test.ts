import { describe, expect, it } from "vitest";
import { assertRecipientLimit, MAX_RECIPIENTS, parseRecipients, TOO_MANY_RECIPIENTS_MESSAGE } from "./recipients";

const emails = (count: number) => Array.from({ length: count }, (_, i) => `agent${i}@culture.gouv.fr`);

describe("recipient limit", () => {
  it("counts distinct normalized addresses, whatever the separator", () => {
    expect(parseRecipients(" A@x.fr ; a@x.fr,b@x.fr,, ")).toEqual(["a@x.fr", "b@x.fr"]);
  });

  it("accepts 20 recipients", () => {
    expect(() => assertRecipientLimit(emails(MAX_RECIPIENTS).join(","))).not.toThrow();
    // duplicates do not count twice
    expect(() => assertRecipientLimit([...emails(20), "AGENT0@culture.gouv.fr"])).not.toThrow();
  });

  it("refuses 21 recipients with a 400 and the message shown on the send screen", () => {
    expect(() => assertRecipientLimit(emails(21))).toThrow(
      expect.objectContaining({ status: 400, message: TOO_MANY_RECIPIENTS_MESSAGE }),
    );
    expect(TOO_MANY_RECIPIENTS_MESSAGE).toBe("20 destinataires au maximum par envoi.");
  });
});
