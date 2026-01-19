import { AbstractAttachmentQueue, AttachmentRecord, AttachmentState } from "@powersync/attachments";
import { v4 } from "uuid";
import { attachmentStorage } from "./db";

export class AttachmentQueue extends AbstractAttachmentQueue {
  onAttachmentIdsChange(onUpdate: (ids: string[]) => void): void {
    this.powersync.watch(
      ` SELECT attachment_id FROM report_attachment
        UNION ALL
        SELECT attachment_id FROM state_report_attachment
        UNION ALL
        SELECT attachment_id FROM visited_section_attachment
        UNION ALL
        SELECT attachment_id FROM state_report_alert_attachment`,
      [],
      {
        onResult: ({ rows }) => onUpdate(rows?._array?.map((r) => r.attachment_id) ?? []),
      },
    );
  }

  async newAttachmentRecord(record?: Partial<AttachmentRecord>): Promise<AttachmentRecord> {
    const fileId = record?.id ?? v4();
    const filename = record?.filename ?? fileId;
    return {
      id: fileId,
      filename,
      state: AttachmentState.QUEUED_UPLOAD,
      ...record,
    };
  }

  getLocalFilePathSuffix(filename: string): string {
    return filename;
  }

  getLocalUri(filePath: string): string {
    return filePath;
  }

  async saveAttachment({
    attachmentId,
    buffer,
    mediaType = "image/jpeg",
  }: {
    attachmentId: string;
    buffer: ArrayBuffer;
    mediaType?: string;
  }): Promise<void> {
    const localUri = this.getLocalFilePathSuffix(attachmentId);

    const picAttachment = await this.newAttachmentRecord({
      id: attachmentId,
      local_uri: localUri,
      media_type: mediaType,
    });

    const fullPath = this.getLocalUri(attachmentId);
    await attachmentStorage.writeFile(fullPath, buffer);
    await this.saveToQueue(picAttachment);
  }
}
