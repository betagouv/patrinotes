import { randomInt } from "crypto";
import base62 from "base62";
import { db } from "../db/db";
import { ENV } from "../envVars";

/** Public short link `/attachment/:id`, valid 90 days (see attachmentRedirectRoutes). */
export const createAttachmentRedirection = async ({
  s3Key,
  createdBy,
  sentTo,
  name,
}: {
  s3Key: string;
  createdBy: string;
  sentTo: string;
  name?: string;
}) => {
  const id = base62.encode(randomInt(1, 281474976710655));
  await db
    .insertInto("attachment_redirection")
    .values({ id, s3_key: s3Key, created_at: new Date().toISOString(), created_by: createdBy, sent_to: sentTo, name })
    .execute();
  return `${ENV.BACKEND_URL}/attachment/${id}${name ? `/${name}` : ""}`;
};
