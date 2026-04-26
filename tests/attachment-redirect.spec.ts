import { test, expect } from "@playwright/test";
import { db } from "../packages/backend/src/db/db";
import { subDays } from "date-fns";

const backendPort = process.env.BACKEND_PORT ?? "3011";

test.describe("Attachment redirect route", () => {
  test.beforeAll(async () => {
    await db.deleteFrom("attachment_redirection").execute();
  });

  test("redirects to a presigned S3 URL for a valid id", async ({ request }) => {
    const id = "test-redir-" + Date.now();
    await db
      .insertInto("attachment_redirection")
      .values({
        id,
        s3_key: "attachment/test-redir/some.pdf",
        created_at: new Date().toISOString(),
        created_by: "test-user",
        sent_to: "test@example.com",
      })
      .execute();

    const response = await request.get(`http://127.0.0.1:${backendPort}/attachment/${id}`, {
      maxRedirects: 0,
    });

    expect(response.status()).toBe(302);
    const location = response.headers()["location"];
    expect(location).toBeDefined();
    // Presigned S3/MinIO URLs contain X-Amz-Signature
    expect(location).toContain("X-Amz-Signature");
  });

  test("returns 404 for an unknown id", async ({ request }) => {
    const response = await request.get(`http://127.0.0.1:${backendPort}/attachment/unknown-id-xyz`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
  });

  test("returns 410 for a link older than 90 days", async ({ request }) => {
    const id = "test-expired-" + Date.now();
    await db
      .insertInto("attachment_redirection")
      .values({
        id,
        s3_key: "attachment/test-expired/old.pdf",
        created_at: subDays(new Date(), 91).toISOString(),
        created_by: "test-user",
        sent_to: "test@example.com",
      })
      .execute();

    const response = await request.get(`http://127.0.0.1:${backendPort}/attachment/${id}`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(410);
  });

  test("a link on exactly day 90 is still valid", async ({ request }) => {
    const id = "test-day90-" + Date.now();
    await db
      .insertInto("attachment_redirection")
      .values({
        id,
        s3_key: "attachment/test-day90/some.pdf",
        created_at: subDays(new Date(), 90).toISOString(),
        created_by: "test-user",
        sent_to: "test@example.com",
      })
      .execute();

    const response = await request.get(`http://127.0.0.1:${backendPort}/attachment/${id}`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(302);
  });
});
