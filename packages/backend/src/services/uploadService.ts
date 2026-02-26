import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { ENV } from "../envVars";
import { makeDebug } from "../features/debug";
import { AppError } from "../features/errors";
import { S3 } from "@aws-sdk/client-s3";
import { applyLinesToPicture } from "../features/image";
import { Database, db } from "../db/db";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import { Prettify } from "pastable";
import { Transaction } from "kysely";

const debug = makeDebug("upload");

const client = new S3Client({
  endpoint: ENV.MINIO_URL,
  region: "us-east-1",
  credentials: { accessKeyId: ENV.MINIO_ACCESS_KEY_ID, secretAccessKey: ENV.MINIO_SECRET_KEY },
  bucketEndpoint: true,
  forcePathStyle: true,
});

export const upload = async () => {};
const bucketUrl = `${ENV.MINIO_URL}/${ENV.MINIO_BUCKET}`;

const addAttachmentPrefix = (filePath: string) => "attachment/" + filePath;

export class UploadService {
  async uploadAttachment({ buffer, filePath }: { buffer: Buffer; filePath: string }) {
    debug("Uploading attachment to S3", filePath);
    const command = new PutObjectCommand({
      Bucket: bucketUrl,
      Body: buffer,
      Key: addAttachmentPrefix(filePath),
    });
    await client.send(command);
  }

  async getAttachment({ filePath }: { filePath: string }) {
    const name = addAttachmentPrefix(filePath);
    const command = new GetObjectCommand({ Bucket: bucketUrl, Key: name });
    const response = await client.send(command);

    const buffer = await response.Body?.transformToByteArray();
    if (!buffer) throw new AppError(404, "Attachment not found");
    return Buffer.from(buffer);
  }

  async addPDFToReport({ reportId, buffer, name }: { reportId: string; buffer: Buffer; name: string }) {
    debug("Uploading PDF to S3", name);
    const command = new PutObjectCommand({
      Bucket: bucketUrl,
      Body: buffer,
      Key: name,
    });
    await client.send(command);

    const url = `https://${bucketUrl}/${name}`;
    debug(url);
    return url;
  }

  async getReportPDF({ reportId }: { reportId: string }) {
    const attachment = await db
      .selectFrom("report_attachment")
      .where("report_id", "=", reportId)
      .where("attachment_id", "like", "%.pdf")
      .selectAll()
      .executeTakeFirst();
    console.log(attachment);
    if (!attachment) throw new AppError(404, "PDF not found");

    const command = new GetObjectCommand({ Bucket: bucketUrl, Key: addAttachmentPrefix(attachment.attachment_id) });
    const response = await client.send(command);

    const buffer = await response.Body?.transformToByteArray();
    if (!buffer) throw new AppError(404, "PDF not found");

    return Buffer.from(buffer);
  }

  async handleNotifyPictureLines({
    pictureId,
    serviceId,
    onNewImage,
    // lines,
  }: {
    pictureId: string;
    serviceId: string;
    onNewImage?: OnNewImage;
    // lines: Array<{ points: { x: number; y: number }[]; color: string }>;
  }) {
    debug("Handling picture lines", pictureId);
    const linesQuery = await db.selectFrom("picture_lines").where("attachmentId", "=", pictureId).selectAll().execute();
    const lines = JSON.parse(linesQuery?.[0]?.lines || "[]");

    console.log(linesQuery?.[0]);

    const pictureUrl = await generatePresignedUrl(addAttachmentPrefix(pictureId));

    const buffer = await applyLinesToPicture({ pictureUrl: pictureUrl, lines });

    const name = getPictureName(pictureId, Math.round(Date.now() / 1000));

    debug("Uploading picture to S3", pictureId);
    await this.uploadAttachment({ buffer, filePath: name });
    debug("Picture uploaded", pictureId);

    const url = path.join(`https://${bucketUrl}`, name);

    await db.transaction().execute(async (tx) => {
      if (onNewImage) {
        await onNewImage(tx, {
          originalName: pictureId,
          newName: name,
          url,
          attachmentId: pictureId,
          serviceId: serviceId,
        });
      }
      await tx
        .deleteFrom("picture_lines")
        .where(
          "id",
          "in",
          linesQuery.map((line) => line.id),
        )
        .execute();
    });

    debug(url);
    return url;
  }
}
export type OnNewImage = (
  tx: Transaction<Database>,
  {
    originalName,
    newName,
    url,
    attachmentId,
    serviceId,
  }: { originalName: string; newName: string; url: string; attachmentId: string; serviceId: string },
) => Promise<void> | void;

export async function generatePresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: bucketUrl,
    Key: key,
  });

  const presignedUrl = await getSignedUrl(client as any, command as any, {
    expiresIn: 3600,
  });

  const url = new URL(presignedUrl);
  const pathParts = url.pathname.split("/");

  const encodedPath = pathParts
    .map((part, index) => {
      if (index === 0 || index === 1) return part;
      return encodeURIComponent(part);
    })
    .join("/");

  url.pathname = encodedPath;

  return url.toString();
}

export const getPDFName = (reportId: string) => `${reportId}/compte_rendu.pdf`;
export const getPictureName = (pictureId: string, snapshot?: number) => {
  const hasSnapshot = pictureId.includes("_");
  const cleanName = hasSnapshot ? pictureId.split("_")[0] : pictureId.split(".")[0];
  return `${cleanName}${snapshot ? `_${snapshot}` : ""}.jpg`;
};
