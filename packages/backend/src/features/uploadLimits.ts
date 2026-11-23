import { AppError } from "./errors";

/** Accepted files (05 § 7): photos JPEG, PNG, WebP or HEIC/HEIF up to 20 MB, PDF up to 50 MB. */
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"] as const;
export const PDF_TYPE = "application/pdf";
export const MB = 1024 * 1024;
export const PHOTO_MAX_SIZE = 20 * MB;
export const PDF_MAX_SIZE = 50 * MB;

export const UNSUPPORTED_FORMAT_MESSAGE = "Format de fichier non accepté.";
export const tooLargeMessage = (maxSize: number) => `Fichier trop volumineux (${maxSize / MB} Mo maximum).`;

/**
 * Checks the type and size a client declares for a file it is about to upload. Both are then signed in the upload URL,
 * so the storage refuses a different type or size (see UploadService.getPresignedUploadUrl).
 */
export const assertUploadAllowed = ({
  contentType,
  size,
  accept = "photo-or-pdf",
}: {
  contentType: string;
  size: number;
  accept?: "photo-or-pdf" | "pdf";
}) => {
  const type = contentType.trim().toLowerCase();
  const isPdf = type === PDF_TYPE;
  const isPhoto = (PHOTO_TYPES as readonly string[]).includes(type);
  if (!isPdf && (accept === "pdf" || !isPhoto)) throw new AppError(400, UNSUPPORTED_FORMAT_MESSAGE);
  if (!Number.isInteger(size) || size <= 0) throw new AppError(400, "Taille du fichier invalide");
  const maxSize = isPdf ? PDF_MAX_SIZE : PHOTO_MAX_SIZE;
  if (size > maxSize) throw new AppError(400, tooLargeMessage(maxSize));
  return { contentType: type, size };
};
