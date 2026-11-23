import { getServices } from "../../services/services";
import { createAttachmentRedirection } from "../attachmentRedirection";
import { escapeHtml } from "./escapeHtml";

/** Above this total, an alert's photos are sent as links instead of attachments (09 § 12: SMTP size limit). */
export const MAX_ATTACHED_PHOTOS_SIZE = 15 * 1024 * 1024;
export const PHOTO_LINKS_TITLE = "Photos (liens valables 90 jours) :";

type Photo = { id: string; attachment_id: string; label?: string | null };

/**
 * Photos of an alert email (constat alert or fiche alert). Up to 15 MB in total they are attached and shown in the
 * email; beyond, each one is replaced by a 90-day short link (/attachment/:id), listed under PHOTO_LINKS_TITLE.
 */
export const buildAlertPhotos = async ({
  photos,
  createdBy,
  sentTo,
}: {
  photos: Photo[];
  /** user the short links are created for, and their recipients (as for the PDF links) */
  createdBy: string;
  sentTo: string;
}) => {
  if (!photos.length) return { html: "", attachments: [] };
  const uploadService = getServices().upload;

  const sizes = await Promise.all(photos.map((photo) => uploadService.getAttachmentSize({ filePath: photo.attachment_id })));
  const totalSize = sizes.reduce((total, size) => total + size, 0);

  if (totalSize > MAX_ATTACHED_PHOTOS_SIZE) {
    const links = await Promise.all(
      photos.map(async (photo, index) => {
        const extension = photo.attachment_id.split(".").pop() || "jpg";
        const url = await createAttachmentRedirection({
          s3Key: "attachment/" + photo.attachment_id,
          createdBy,
          sentTo,
          name: `photo-${index + 1}.${extension}`,
        });
        return { url, label: photo.label || `Photo ${index + 1}` };
      }),
    );
    const html = `<p>${PHOTO_LINKS_TITLE}</p>
    <ul>${links.map((link) => `<li><a href="${link.url}">${escapeHtml(link.label)}</a></li>`).join("")}</ul>`;
    return { html, attachments: [] };
  }

  const attachments = await Promise.all(
    photos.map(async (photo) => ({
      filename: photo.label || "Photo",
      content: await uploadService.getAttachment({ filePath: photo.attachment_id }),
      cid: photo.id,
      contentType: "image/png",
    })),
  );
  const html = `<p>${attachments
    .map(
      (att) =>
        `<img src="cid:${att.cid}" alt="${escapeHtml(att.filename)}" style="max-width: 600px; max-height: 400px; display: block; margin: 10px 0;" />`,
    )
    .join("")}</p>`;
  return { html, attachments };
};
