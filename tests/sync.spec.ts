import { test, expect } from "@playwright/test";
import { mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT}`;

test.describe("Sync (upload-data) robustness", () => {
  let accessToken: string;

  test.beforeAll(async ({ browser }) => {
    await resetDatabase();

    const context = await browser.newContext();
    const page = await context.newPage();
    await signup({ page, user: mockUsers[0] });
    await context.close();

    const resp = await fetch(`${BACKEND_URL}/api/login-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: mockUsers[0].email, password: mockUsers[0].password }),
    });
    const data = (await resp.json()) as { accessToken: string };
    accessToken = data.accessToken;
  });

  test("POST /api/upload-data requires authentication", async ({ request }) => {
    const resp = await request.post(`${BACKEND_URL}/api/upload-data`, {
      data: { op_id: 1, tx_id: 1, id: "whatever", type: "service", op: "PATCH", data: {} },
    });
    // authMiddleware.authenticate throws 403 (not 401) for a missing/invalid token —
    // that's this app's consistent convention.
    expect(resp.status()).toBe(403);
  });

  test("rejects writes to blacklisted tables without mutating them", async ({ request }) => {
    const before = await db
      .selectFrom("internal_user")
      .where("email", "=", mockUsers[0].email)
      .selectAll()
      .executeTakeFirstOrThrow();

    const resp = await request.post(`${BACKEND_URL}/api/upload-data`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        op_id: 999,
        tx_id: 999,
        id: before.id,
        type: "internal_user",
        op: "PATCH",
        data: { role: "admin" },
      },
    });

    expect(resp.ok()).toBeTruthy();
    const body = await resp.json();
    expect(body.error).toBe("Unauthorized");

    const after = await db.selectFrom("internal_user").where("id", "=", before.id).selectAll().executeTakeFirstOrThrow();
    expect(after.role).toBe(before.role); // unchanged — the PATCH was never applied
  });

  test("two conflicting writes to the same row apply last-write-wins with no conflict rejection", async ({
    request,
  }) => {
    const scratchId = "sync-scratch-" + Date.now();

    // PUT: insert a scratch service row
    const putResp = await request.post(`${BACKEND_URL}/api/upload-data`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: {
        op_id: 1,
        tx_id: 1,
        id: scratchId,
        type: "service",
        op: "PUT",
        data: { name: "Scratch A", department: "00", visible: true, dept_numbers: "00" },
      },
    });
    expect(putResp.ok()).toBeTruthy();

    // Two "concurrent" PATCHes racing to set a different name on the same row
    const [patchA, patchB] = await Promise.all([
      request.post(`${BACKEND_URL}/api/upload-data`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { op_id: 2, tx_id: 2, id: scratchId, type: "service", op: "PATCH", data: { name: "Scratch B" } },
      }),
      request.post(`${BACKEND_URL}/api/upload-data`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { op_id: 3, tx_id: 3, id: scratchId, type: "service", op: "PATCH", data: { name: "Scratch C" } },
      }),
    ]);

    // Neither write is rejected as a conflict — there's no optimistic locking
    expect(patchA.ok()).toBeTruthy();
    expect(patchB.ok()).toBeTruthy();
    const bodyA = await patchA.json();
    const bodyB = await patchB.json();
    expect(bodyA.success).toBe(true);
    expect(bodyB.success).toBe(true);

    // The row settled on whichever write actually applied last — one of the two names
    const row = await db.selectFrom("service").where("id", "=", scratchId).selectAll().executeTakeFirstOrThrow();
    expect(["Scratch B", "Scratch C"]).toContain(row.name);

    // All 3 ops (PUT + 2 PATCH) were recorded in the audit log regardless of outcome
    const transactions = await db.selectFrom("transactions").where("entity_id", "=", scratchId).selectAll().execute();
    expect(transactions).toHaveLength(3);

    await db.deleteFrom("transactions").where("entity_id", "=", scratchId).execute();
    await db.deleteFrom("service").where("id", "=", scratchId).execute();
  });
});
