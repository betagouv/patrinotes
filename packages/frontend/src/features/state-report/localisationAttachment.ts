import { v7 } from "uuid";
import { attachmentQueue, db } from "../../db/db";

// Stored in the attachment_id path itself (not the label) so identification is a permanent,
// structural fact about the row — synced via the DB like everything else, so it works
// identically no matter which device created or later reopens it.
const LOCALISATION_PATH_SEGMENT = "/localisation/";

export function isLocalisationAttachment(attachmentId: string | null | undefined): boolean {
  return !!attachmentId && attachmentId.includes(LOCALISATION_PATH_SEGMENT);
}

/**
 * Inserts the freshly exported localisation image as a new visited_section_attachment,
 * deprecating the previous one (if any). No caption label is set, so the PDF and the app's
 * photo grid show none — the app displays its own friendly label locally instead.
 */
export async function upsertLocalisationAttachment({
  visitedSectionId,
  serviceId,
  blob,
}: {
  visitedSectionId: string;
  serviceId: string;
  blob: Blob;
}): Promise<void> {
  const existing = await db
    .selectFrom("visited_section_attachment")
    .select("id")
    .where("visited_section_id", "=", visitedSectionId)
    .where("attachment_id", "like", `${visitedSectionId}${LOCALISATION_PATH_SEGMENT}%`)
    .where((eb) => eb.or([eb("is_deprecated", "=", 0), eb("is_deprecated", "is", null)]))
    .executeTakeFirst();

  const data = await blob.arrayBuffer();
  const attachmentId = `${visitedSectionId}${LOCALISATION_PATH_SEGMENT}${v7()}.jpg`;

  await attachmentQueue.saveFile({ id: attachmentId, fileExtension: "jpg", data, mediaType: "image/jpeg" });
  await db
    .insertInto("visited_section_attachment")
    .values({
      id: v7(),
      attachment_id: attachmentId,
      visited_section_id: visitedSectionId,
      service_id: serviceId,
      label: "",
      created_at: new Date().toISOString(),
      is_deprecated: 0,
    })
    .execute();

  if (existing) {
    await db.updateTable("visited_section_attachment").set({ is_deprecated: 1 }).where("id", "=", existing.id).execute();
  }
}

/** Clears the pins/drawings/zone saved on the section so a fresh map opens empty next time. */
export async function clearLocalisationData(visitedSectionId: string): Promise<void> {
  await db
    .updateTable("visited_section")
    .set({ localisation_pins: null, localisation_drawings: null, localisation_zone: null })
    .where("id", "=", visitedSectionId)
    .execute();
}
