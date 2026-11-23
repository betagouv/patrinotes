import { describe, expect, it } from "vitest";
import { assertUploadAllowed, MB } from "./uploadLimits";

const refusal = (message: string) => expect.objectContaining({ status: 400, message });

describe("upload limits (05 § 7)", () => {
  it("accepts photos up to 20 MB in JPEG, PNG, WebP, HEIC or HEIF", () => {
    for (const contentType of ["image/jpeg", "image/png", "image/webp", "image/heic", "IMAGE/HEIF"]) {
      expect(() => assertUploadAllowed({ contentType, size: 20 * MB })).not.toThrow();
    }
    expect(assertUploadAllowed({ contentType: " Image/JPEG ", size: 1000 })).toEqual({ contentType: "image/jpeg", size: 1000 });
  });

  it("refuses a photo over 20 MB", () => {
    expect(() => assertUploadAllowed({ contentType: "image/jpeg", size: 20 * MB + 1 })).toThrow(
      refusal("Fichier trop volumineux (20 Mo maximum)."),
    );
  });

  it("accepts PDF up to 50 MB and refuses beyond", () => {
    expect(() => assertUploadAllowed({ contentType: "application/pdf", size: 50 * MB, accept: "pdf" })).not.toThrow();
    expect(() => assertUploadAllowed({ contentType: "application/pdf", size: 50 * MB + 1, accept: "pdf" })).toThrow(
      refusal("Fichier trop volumineux (50 Mo maximum)."),
    );
  });

  it("refuses other formats, and photos where a PDF is expected", () => {
    for (const contentType of ["image/gif", "image/svg+xml", "text/html", "application/octet-stream", ""]) {
      expect(() => assertUploadAllowed({ contentType, size: 10 })).toThrow(refusal("Format de fichier non accepté."));
    }
    expect(() => assertUploadAllowed({ contentType: "image/jpeg", size: 10, accept: "pdf" })).toThrow(
      refusal("Format de fichier non accepté."),
    );
  });

  it("refuses an empty or invalid size", () => {
    for (const size of [0, -1, 1.5, Number.NaN]) {
      expect(() => assertUploadAllowed({ contentType: "image/png", size })).toThrow(expect.objectContaining({ status: 400 }));
    }
  });
});
