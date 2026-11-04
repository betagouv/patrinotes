import { describe, expect, it, vi } from "vitest";

vi.mock("../db/db", () => ({ db: {} }));
const { getAttachmentDocumentId } = await import("./attachmentAccess");

describe("getAttachmentDocumentId", () => {
  it("returns the document a file belongs to", () => {
    expect(getAttachmentDocumentId("constat-1/images/0192f.jpg")).toBe("constat-1");
    expect(getAttachmentDocumentId("report-0192f/compte_rendu_1730700000.pdf")).toBe("report-0192f");
    expect(getAttachmentDocumentId("section-1/localisation/0192f.jpg")).toBe("section-1");
  });

  it("refuses paths that could escape the document folder", () => {
    for (const path of ["../secret.pdf", "constat-1/../../x", "/constat-1/a.jpg", "constat-1", "a b/c.jpg", ""]) {
      expect(() => getAttachmentDocumentId(path)).toThrow();
    }
  });
});
