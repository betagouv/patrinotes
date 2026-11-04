import { db } from "../db/db";
import { AppError } from "./errors";

/**
 * Files live under `attachment/<document id>/…`: the first segment of a path is the compte-rendu, constat,
 * visited section or alert it belongs to (`<id>/images/<uuid>.jpg`, `<id>/compte_rendu_<epoch>.pdf`…).
 * Access to a file is the access to that document's service.
 */

const attachmentPathPattern = /^[A-Za-z0-9_-]+(\/[A-Za-z0-9_.-]+)+$/;

export const getAttachmentDocumentId = (filePath: string) => {
  if (!attachmentPathPattern.test(filePath) || filePath.split("/").includes("..")) {
    throw new AppError(400, "Chemin de fichier invalide");
  }
  return filePath.split("/")[0]!;
};

/** Service of the document a file belongs to; undefined when no such document is stored (yet). */
export const getAttachmentServiceId = async (filePath: string): Promise<string | undefined> => {
  const documentId = getAttachmentDocumentId(filePath);

  const row = await db
    .selectFrom("report")
    .select("service_id")
    .where("id", "=", documentId)
    .unionAll(db.selectFrom("state_report").select("service_id").where("id", "=", documentId))
    .unionAll(db.selectFrom("visited_section").select("service_id").where("id", "=", documentId))
    .unionAll(db.selectFrom("state_report_alert").select("service_id").where("id", "=", documentId))
    .executeTakeFirst();

  return row ? (row.service_id ?? "") : undefined;
};

/** Reading a file requires its document to belong to the user's service. */
export const assertCanReadAttachment = async (user: { service_id: string }, filePath: string) => {
  const serviceId = await getAttachmentServiceId(filePath);
  if (serviceId === undefined) throw new AppError(404, "Attachment not found");
  if (serviceId !== user.service_id) throw new AppError(403, "Accès non autorisé à ce fichier");
};

/**
 * Uploading a file requires its document to belong to the user's service. The document may not be stored yet:
 * photos are uploaded by the attachment queue, independently from the document's own sync.
 */
export const assertCanUploadAttachment = async (user: { service_id: string }, filePath: string) => {
  const serviceId = await getAttachmentServiceId(filePath);
  if (serviceId !== undefined && serviceId !== user.service_id) {
    throw new AppError(403, "Accès non autorisé à ce fichier");
  }
};
