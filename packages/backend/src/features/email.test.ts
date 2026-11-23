import { describe, expect, it } from "vitest";
import { maskEmail } from "./email";

describe("maskEmail", () => {
  it("hides the local part but keeps its length, its ends, the spaces and the domain", () => {
    expect(maskEmail("jean.dupont@culture.gouv.fr")).toBe("j*********t@culture.gouv.fr");
    expect(maskEmail(" Jean@culture.gouv.fr ")).toBe(" J**n@culture.gouv.fr ");
    expect(maskEmail("ab@x.fr")).toBe("**@x.fr");
  });

  it("leaves a value without @ unchanged", () => {
    expect(maskEmail("pas-un-courriel")).toBe("pas-un-courriel");
  });
});
