import { describe, expect, it, vi } from "vitest";

const MB = 1024 * 1024;
const sizes = new Map<string, number>();
const getAttachment = vi.fn(async ({ filePath }: { filePath: string }) => Buffer.from(filePath));
const createAttachmentRedirection = vi.fn(async ({ name }: { name?: string }) => `https://api.example/attachment/x/${name}`);

vi.mock("../../services/services", () => ({
  getServices: () => ({
    upload: { getAttachmentSize: async ({ filePath }: { filePath: string }) => sizes.get(filePath) ?? 0, getAttachment },
  }),
}));
vi.mock("../attachmentRedirection", () => ({ createAttachmentRedirection }));

const { buildAlertPhotos, PHOTO_LINKS_TITLE } = await import("./alertPhotos");

const photos = [
  { id: "p1", attachment_id: "alert-1/images/a.jpg", label: "Façade <nord>" },
  { id: "p2", attachment_id: "alert-1/images/b.jpg", label: null },
];

describe("alert photos", () => {
  it("attaches the photos up to 15 MB in total", async () => {
    sizes.set(photos[0]!.attachment_id, 10 * MB);
    sizes.set(photos[1]!.attachment_id, 5 * MB);
    const result = await buildAlertPhotos({ photos, createdBy: "user-1", sentTo: "a@x.fr" });
    expect(result.attachments.map((a) => a.cid)).toEqual(["p1", "p2"]);
    expect(result.html).toContain('src="cid:p1"');
    expect(result.html).not.toContain(PHOTO_LINKS_TITLE);
    expect(createAttachmentRedirection).not.toHaveBeenCalled();
  });

  it("replaces them by 90-day links beyond 15 MB", async () => {
    sizes.set(photos[1]!.attachment_id, 5 * MB + 1);
    getAttachment.mockClear();
    const result = await buildAlertPhotos({ photos, createdBy: "user-1", sentTo: "a@x.fr,b@x.fr" });
    expect(result.attachments).toEqual([]);
    expect(getAttachment).not.toHaveBeenCalled();
    expect(PHOTO_LINKS_TITLE).toBe("Photos (liens valables 90 jours) :");
    expect(result.html).toContain(`<p>${PHOTO_LINKS_TITLE}</p>`);
    expect(result.html).toContain('<a href="https://api.example/attachment/x/photo-1.jpg">Façade &lt;nord&gt;</a>');
    expect(result.html).toContain('<a href="https://api.example/attachment/x/photo-2.jpg">Photo 2</a>');
    expect(createAttachmentRedirection).toHaveBeenCalledWith({
      s3Key: "attachment/alert-1/images/a.jpg",
      createdBy: "user-1",
      sentTo: "a@x.fr,b@x.fr",
      name: "photo-1.jpg",
    });
  });

  it("adds nothing without photos", async () => {
    expect(await buildAlertPhotos({ photos: [], createdBy: "u", sentTo: "" })).toEqual({ html: "", attachments: [] });
  });
});
