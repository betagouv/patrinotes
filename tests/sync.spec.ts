import { test, expect, type APIRequestContext } from "@playwright/test";
import { mockServices, mockUsers, signup } from "./utils";
import { resetDatabase } from "./setup";
import { db } from "../packages/backend/src/db/db";

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT}`;

const login = async (user: (typeof mockUsers)[number]) => {
  const resp = await fetch(`${BACKEND_URL}/api/login-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, password: user.password }),
  });
  const data = (await resp.json()) as { accessToken: string; user: { id: string } };
  return { token: data.accessToken, id: data.user.id };
};

type Op = { id: string; type: string; op: "PUT" | "PATCH" | "DELETE"; data?: Record<string, unknown> };

let opId = 1;
const upload = async (request: APIRequestContext, token: string, op: Op) => {
  const resp = await request.post(`${BACKEND_URL}/api/upload-data`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { op_id: opId, tx_id: opId++, ...op },
  });
  expect(resp.ok()).toBeTruthy(); // refusals are 200, so the client's upload queue keeps going
  return (await resp.json()) as { success?: boolean; error?: unknown };
};

// A and B work in service-1, C in another service
test.describe.serial("Sync (upload-data) access control", () => {
  let a: { token: string; id: string };
  let b: { token: string; id: string };
  let c: { token: string; id: string };

  test.beforeAll(async ({ browser }) => {
    await resetDatabase();
    await db.deleteFrom("delegation").execute();

    const services = [mockServices[0].id, mockServices[0].id, mockServices[1].id];
    for (const [index, user] of mockUsers.entries()) {
      const context = await browser.newContext();
      const page = await context.newPage();
      await signup({ page, user, udap: services[index] });
      await context.close();
    }

    [a, b, c] = await Promise.all(mockUsers.map(login));
  });

  test.afterAll(async () => {
    await db.deleteFrom("delegation").execute();
  });

  test("POST /api/upload-data requires authentication", async ({ request }) => {
    const resp = await request.post(`${BACKEND_URL}/api/upload-data`, {
      data: { op_id: 1, tx_id: 1, id: "whatever", type: "service", op: "PATCH", data: {} },
    });
    // authMiddleware.authenticate throws 403 (not 401) for a missing/invalid token —
    // that's this app's consistent convention.
    expect(resp.status()).toBe(403);
  });

  test("refuses tables clients may not write, without mutating them", async ({ request }) => {
    const before = await db
      .selectFrom("internal_user")
      .where("email", "=", mockUsers[0].email)
      .selectAll()
      .executeTakeFirstOrThrow();

    const body = await upload(request, a.token, {
      id: before.id,
      type: "internal_user",
      op: "PATCH",
      data: { role: "admin" },
    });
    expect(body.error).toBe("Forbidden");
    const after = await db
      .selectFrom("internal_user")
      .where("id", "=", before.id)
      .selectAll()
      .executeTakeFirstOrThrow();
    expect(after.role).toBe(before.role);

    const whitelist = await upload(request, a.token, {
      id: "pirate@example.com",
      type: "whitelist",
      op: "PUT",
      data: { email: "pirate@example.com" },
    });
    expect(whitelist.error).toBe("Forbidden");
    const added = await db.selectFrom("whitelist").where("email", "=", "pirate@example.com").selectAll().execute();
    expect(added).toHaveLength(0);
  });

  test("a user edits their own profile only, never its email", async ({ request }) => {
    expect(
      (await upload(request, a.token, { id: a.id, type: "user", op: "PATCH", data: { job: "ABF" } })).success,
    ).toBe(true);

    const email = await upload(request, a.token, {
      id: a.id,
      type: "user",
      op: "PATCH",
      data: { email: mockUsers[1].email },
    });
    expect(email.error).toBe("Forbidden");

    const other = await upload(request, a.token, { id: b.id, type: "user", op: "PATCH", data: { name: "Piraté" } });
    expect(other.error).toBe("Forbidden");

    const users = await db.selectFrom("user").where("id", "in", [a.id, b.id]).selectAll().execute();
    expect(users.find((u) => u.id === a.id)).toMatchObject({ email: mockUsers[0].email, job: "ABF" });
    expect(users.find((u) => u.id === b.id)?.name).not.toBe("Piraté");
  });

  test("members edit their own service; concurrent writes are last-write-wins", async ({ request }) => {
    const serviceId = mockServices[0].id;
    const { name } = await db
      .selectFrom("service")
      .where("id", "=", serviceId)
      .select("name")
      .executeTakeFirstOrThrow();

    const [patchA, patchB] = await Promise.all([
      upload(request, a.token, { id: serviceId, type: "service", op: "PATCH", data: { name: "Scratch B" } }),
      upload(request, b.token, { id: serviceId, type: "service", op: "PATCH", data: { name: "Scratch C" } }),
    ]);
    expect(patchA.success).toBe(true);
    expect(patchB.success).toBe(true);
    const row = await db.selectFrom("service").where("id", "=", serviceId).selectAll().executeTakeFirstOrThrow();
    expect(["Scratch B", "Scratch C"]).toContain(row.name);

    const other = await upload(request, c.token, {
      id: serviceId,
      type: "service",
      op: "PATCH",
      data: { courriel_crmh: "pirate@example.com" },
    });
    expect(other.error).toBe("Forbidden");

    // every operation is recorded in the audit log, refused or not
    const transactions = await db.selectFrom("transactions").where("entity_id", "=", serviceId).selectAll().execute();
    expect(transactions.length).toBeGreaterThanOrEqual(3);

    await db.updateTable("service").set({ name }).where("id", "=", serviceId).execute();
  });

  test("comptes-rendus: only the creator, the redactor or a delegate may edit", async ({ request }) => {
    const reportId = "report-sync-" + Date.now();

    // createdBy and service_id are set by the server, whatever the client sends
    const created = await upload(request, a.token, {
      id: reportId,
      type: "report",
      op: "PUT",
      data: {
        title: "CR de A",
        createdBy: c.id,
        service_id: mockServices[1].id,
        disabled: 0,
        createdAt: new Date().toISOString(),
      },
    });
    expect(created.success).toBe(true);
    const report = await db.selectFrom("report").where("id", "=", reportId).selectAll().executeTakeFirstOrThrow();
    expect(report).toMatchObject({ createdBy: a.id, service_id: mockServices[0].id });

    // a colleague without delegation, then someone of another service
    expect(
      (await upload(request, b.token, { id: reportId, type: "report", op: "PATCH", data: { title: "B" } })).error,
    ).toBe("Forbidden");
    expect(
      (await upload(request, c.token, { id: reportId, type: "report", op: "PATCH", data: { title: "C" } })).error,
    ).toBe("Forbidden");

    // A delegates to B: B may now edit, delete, and name A as redactor
    const delegationId = "delegation-sync-" + Date.now();
    const delegation = await upload(request, a.token, {
      id: delegationId,
      type: "delegation",
      op: "PUT",
      data: { createdBy: a.id, delegatedTo: b.id },
    });
    expect(delegation.success).toBe(true);

    expect(
      (await upload(request, b.token, { id: reportId, type: "report", op: "PATCH", data: { title: "Modifié par B" } }))
        .success,
    ).toBe(true);

    const onBehalf = "report-sync-b-" + Date.now();
    expect(
      (
        await upload(request, b.token, {
          id: onBehalf,
          type: "report",
          op: "PUT",
          data: { title: "CR pour A", redactedById: a.id, disabled: 0, createdAt: new Date().toISOString() },
        })
      ).success,
    ).toBe(true);

    // B cannot name as redactor someone who did not delegate to them
    const notDelegated = await upload(request, b.token, {
      id: "report-sync-c-" + Date.now(),
      type: "report",
      op: "PUT",
      data: { title: "CR pour C", redactedById: c.id, disabled: 0, createdAt: new Date().toISOString() },
    });
    expect(notDelegated.error).toBe("Forbidden");

    // photos follow the rights on their compte-rendu
    expect(
      (
        await upload(request, c.token, {
          id: `${reportId}/images/pirate.jpg`,
          type: "report_attachment",
          op: "PUT",
          data: { report_id: reportId, attachment_id: `${reportId}/images/pirate.jpg`, is_deprecated: 0 },
        })
      ).error,
    ).toBe("Forbidden");

    // once withdrawn, the delegation no longer applies
    expect((await upload(request, a.token, { id: delegationId, type: "delegation", op: "DELETE" })).success).toBe(true);
    expect(
      (await upload(request, b.token, { id: reportId, type: "report", op: "PATCH", data: { disabled: 1 } })).error,
    ).toBe("Forbidden");

    const after = await db.selectFrom("report").where("id", "=", reportId).selectAll().executeTakeFirstOrThrow();
    expect(after).toMatchObject({ title: "Modifié par B", disabled: false });
  });

  test("delegations are granted by their author, to colleagues of the same service", async ({ request }) => {
    const forged = await upload(request, b.token, {
      id: "delegation-forged-" + Date.now(),
      type: "delegation",
      op: "PUT",
      data: { createdBy: a.id, delegatedTo: b.id },
    });
    // createdBy is forced to the sender: B can only delegate their own documents, here to themself
    expect(forged.error).toBe("Forbidden");

    const otherService = await upload(request, a.token, {
      id: "delegation-other-" + Date.now(),
      type: "delegation",
      op: "PUT",
      data: { createdBy: a.id, delegatedTo: c.id },
    });
    expect(otherService.error).toBe("Forbidden");
  });

  test("constats: only the creator or a delegate may edit them and their sections", async ({ request }) => {
    const constatId = "constat-sync-" + Date.now();
    const created = await upload(request, a.token, {
      id: constatId,
      type: "state_report",
      op: "PUT",
      data: { titre_edifice: "Église", attachment_id: "faux.pdf", disabled: 0, created_at: new Date().toISOString() },
    });
    expect(created.success).toBe(true);
    const constat = await db
      .selectFrom("state_report")
      .where("id", "=", constatId)
      .selectAll()
      .executeTakeFirstOrThrow();
    expect(constat).toMatchObject({ created_by: a.id, service_id: mockServices[0].id, attachment_id: null });

    const section = (token: string, id: string) =>
      upload(request, token, {
        id,
        type: "visited_section",
        op: "PUT",
        data: { state_report_id: constatId, section: "Couverture" },
      });

    expect((await section(a.token, "section-a-" + Date.now())).success).toBe(true);
    expect((await section(b.token, "section-b-" + Date.now())).error).toBe("Forbidden");
    expect((await section(c.token, "section-c-" + Date.now())).error).toBe("Forbidden");
    expect(
      (await upload(request, b.token, { id: constatId, type: "state_report", op: "PATCH", data: { notes: "B" } }))
        .error,
    ).toBe("Forbidden");

    const delegationId = "delegation-constat-" + Date.now();
    await upload(request, a.token, {
      id: delegationId,
      type: "delegation",
      op: "PUT",
      data: { createdBy: a.id, delegatedTo: b.id },
    });
    expect((await section(b.token, "section-b2-" + Date.now())).success).toBe(true);
    expect(
      (await upload(request, b.token, { id: constatId, type: "state_report", op: "PATCH", data: { notes: "B" } }))
        .success,
    ).toBe(true);
    await upload(request, a.token, { id: delegationId, type: "delegation", op: "DELETE" });
  });
});
