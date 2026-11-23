/** Accepted files (05 § 7), as checked by the server: photos JPEG, PNG, WebP, HEIC/HEIF up to 20 MB, PDF up to 50 MB. */
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MB = 1024 * 1024;
export const PHOTO_MAX_SIZE = 20 * MB;
export const PDF_MAX_SIZE = 50 * MB;

export const UNSUPPORTED_FORMAT_MESSAGE = "Format de fichier non accepté.";
export const PHOTO_TOO_LARGE_MESSAGE = "Fichier trop volumineux (20 Mo maximum).";

/** A file refused before it is stored or sent; its message is shown to the agent as is. */
export class UploadLimitError extends Error {}

const startsWith = (bytes: Uint8Array, signature: number[], offset = 0) =>
  signature.every((byte, index) => bytes[offset + index] === byte);
const ascii = (bytes: Uint8Array, start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));

/**
 * Type of a file read from its first bytes. Photos are saved with a ".jpg" name and an "image/jpeg" media type whatever
 * the compression produced (a PNG stays a PNG, Safari may give a HEIC): the real type is the one declared on upload.
 */
export const sniffFileType = (data: ArrayBuffer): string | null => {
  const bytes = new Uint8Array(data, 0, Math.min(data.byteLength, 16));
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") return "image/webp";
  if (ascii(bytes, 0, 5) === "%PDF-") return "application/pdf";
  if (ascii(bytes, 4, 8) === "ftyp") {
    const brand = ascii(bytes, 8, 12);
    if (["heic", "heix", "hevc", "hevx", "heim", "heis"].includes(brand)) return "image/heic";
    if (["mif1", "msf1", "heif"].includes(brand)) return "image/heif";
  }
  return null;
};

/** Content type to declare for an upload: the sniffed one, else the recorded media type. */
export const getUploadContentType = (data: ArrayBuffer, mediaType?: string | null) =>
  sniffFileType(data) ?? mediaType ?? "application/octet-stream";

/** Refuses, before it is saved, a photo the server would not accept (checked on the bytes actually uploaded). */
export const assertPhotoAllowed = (data: ArrayBuffer) => {
  const type = sniffFileType(data);
  if (!type || !PHOTO_TYPES.includes(type)) throw new UploadLimitError(UNSUPPORTED_FORMAT_MESSAGE);
  if (data.byteLength > PHOTO_MAX_SIZE) throw new UploadLimitError(PHOTO_TOO_LARGE_MESSAGE);
};
