import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateWrite, readOnlyClientTables, syncPolicies } from "./syncPolicy";

/** Tables and columns of the PowerSync client schema, read from its source. */
const readClientSchema = () => {
  const source = readFileSync(path.resolve(__dirname, "../../../../frontend/src/db/AppSchema.ts"), "utf8");
  const tables = new Map<string, string[]>();
  for (const match of source.matchAll(/const (\w+) = new Table\(\{([\s\S]*?)\n\}\);/g)) {
    if (match[1]!.startsWith("_")) continue; // local-only attachment queue
    const columns = [...match[2]!.matchAll(/^\s*(\w+):\s*column/gm)].map((m) => m[1]!).filter((c) => c !== "id");
    tables.set(match[1]!, columns);
  }
  return tables;
};

describe("sync policies", () => {
  const clientSchema = readClientSchema();

  it("cover every table of the client schema, as writable or read-only", () => {
    const covered = [...Object.keys(syncPolicies), ...readOnlyClientTables].sort();
    expect(covered).toEqual([...clientSchema.keys()].sort());
  });

  it.each(Object.keys(syncPolicies))("list exactly the client columns of %s", (table) => {
    expect([...syncPolicies[table]!.columns].sort()).toEqual([...(clientSchema.get(table) ?? [])].sort());
  });
});

const user = { id: "user-a", service_id: "service-a" };
const noDb = {} as any; // the cases below are decided before any query

describe("evaluateWrite", () => {
  it("refuses tables without a policy", async () => {
    for (const table of [
      "internal_user",
      "whitelist",
      "transactions",
      "constat_validation",
      "attachment_redirection",
    ]) {
      const decision = await evaluateWrite({ trx: noDb, user, table, op: "PUT", id: "x", data: {}, existing: null });
      expect(decision.allowed).toBe(false);
    }
  });

  it("refuses operations the table does not allow", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "service",
      op: "DELETE",
      id: "service-a",
      data: {},
      existing: { id: "service-a" },
    });
    expect(decision.allowed).toBe(false);
  });

  it("refuses unknown columns", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "user",
      op: "PATCH",
      id: user.id,
      data: { email: "admin@culture.gouv.fr" },
      existing: { id: user.id, email: "a@culture.gouv.fr", service_id: "service-a" },
    });
    expect(decision).toMatchObject({ allowed: false });
  });

  it("lets a user edit their own profile but not move service through sync", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "user",
      op: "PATCH",
      id: user.id,
      data: { name: "Nouveau nom", service_id: "service-b" },
      existing: { id: user.id, name: "Ancien", service_id: "service-a" },
    });
    expect(decision).toEqual({ allowed: true, values: { name: "Nouveau nom" }, dropped: ["service_id"] });
  });

  it("refuses editing another user's profile", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "user",
      op: "PATCH",
      id: "user-b",
      data: { name: "Piraté" },
      existing: { id: "user-b", name: "B", service_id: "service-a" },
    });
    expect(decision.allowed).toBe(false);
  });

  it("lets members edit their service, not another one, nor its departments", async () => {
    const own = await evaluateWrite({
      trx: noDb,
      user,
      table: "service",
      op: "PATCH",
      id: "service-a",
      data: { courriel_crmh: "crmh@culture.gouv.fr", dept_numbers: "75,92" },
      existing: { id: "service-a", dept_numbers: "75" },
    });
    expect(own).toEqual({
      allowed: true,
      values: { courriel_crmh: "crmh@culture.gouv.fr" },
      dropped: ["dept_numbers"],
    });

    const other = await evaluateWrite({
      trx: noDb,
      user,
      table: "service",
      op: "PATCH",
      id: "service-b",
      data: { courriel_crmh: "pirate@example.com" },
      existing: { id: "service-b" },
    });
    expect(other.allowed).toBe(false);
  });

  it("accepts unchanged server-owned values sent back by the client", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "user",
      op: "PATCH",
      id: user.id,
      data: { service_id: "service-a", job: "ABF" },
      existing: { id: user.id, service_id: "service-a" },
    });
    expect(decision).toEqual({ allowed: true, values: { service_id: "service-a", job: "ABF" }, dropped: [] });
  });

  it("forces the owner and service of new rows", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "user_settings",
      op: "PUT",
      id: "settings-1",
      data: { user_id: "user-b", service_id: "service-b", default_emails: "x@culture.gouv.fr" },
      existing: null,
    });
    expect(decision).toEqual({
      allowed: true,
      values: { user_id: "user-a", service_id: "service-a", default_emails: "x@culture.gouv.fr" },
      dropped: ["user_id", "service_id"],
    });
  });

  it("creates constats in the user's service, without sending state", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "state_report",
      op: "PUT",
      id: "constat-1",
      data: { titre_edifice: "Église", service_id: "service-b", attachment_id: "x/constat.pdf", created_by: null },
      existing: null,
    });
    expect(decision).toMatchObject({
      allowed: true,
      values: {
        titre_edifice: "Église",
        service_id: "service-a",
        created_by: "user-a",
        attachment_id: null,
        validation_status: null,
        pdf_size: null,
      },
    });
  });

  it("accepts the row id repeated in the data, and refuses another one", async () => {
    const same = await evaluateWrite({
      trx: noDb,
      user,
      table: "state_report",
      op: "PUT",
      id: "constat-2",
      data: { id: "constat-2", titre_edifice: "Église" },
      existing: null,
    });
    expect(same).toMatchObject({ allowed: true, values: { titre_edifice: "Église", created_by: "user-a" } });
    expect((same as any).values.id).toBeUndefined();

    const other = await evaluateWrite({
      trx: noDb,
      user,
      table: "state_report",
      op: "PUT",
      id: "constat-2",
      data: { id: "constat-victime", titre_edifice: "Église" },
      existing: null,
    });
    expect(other.allowed).toBe(false);
  });

  it("refuses replaying a PUT on an existing row", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "state_report",
      op: "PUT",
      id: "constat-1",
      data: {},
      existing: { id: "constat-1", service_id: "service-a", created_by: "user-a" },
    });
    expect(decision.allowed).toBe(false);
  });
});

describe("fiche alerts and corrections", () => {
  const draft = {
    id: "alert-1",
    kind: "alerte",
    status: "draft",
    reference_pop: "PA00079952",
    service_id: "service-a",
    created_by: "user-a",
    sent_at: null,
  };

  it("creates fiche alerts as drafts of the user, in the user's service, never already sent", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_alert",
      op: "PUT",
      id: "alert-1",
      data: { ...draft, service_id: "service-b", created_by: "user-b", sent_at: "2026-11-10T10:00:00.000Z" },
      existing: null,
    });
    expect(decision).toMatchObject({
      allowed: true,
      values: { service_id: "service-a", created_by: "user-a", sent_at: null, status: "draft" },
    });

    const submitted = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_alert",
      op: "PUT",
      id: "alert-2",
      data: { ...draft, status: "submitted" },
      existing: null,
    });
    expect(submitted.allowed).toBe(false);
  });

  it("lets the author submit a draft, then refuses any further change", async () => {
    const submit = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_alert",
      op: "PATCH",
      id: "alert-1",
      data: { status: "submitted", commentaires: "Fissure" },
      existing: draft,
    });
    expect(submit).toMatchObject({ allowed: true, values: { status: "submitted", commentaires: "Fissure" } });

    const edit = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_alert",
      op: "PATCH",
      id: "alert-1",
      data: { commentaires: "Autre" },
      existing: { ...draft, status: "submitted" },
    });
    expect(edit.allowed).toBe(false);
  });

  it("lets the author complete a submitted annotation until it is emailed", async () => {
    const annotation = { ...draft, kind: "annotation", status: "submitted", state_report_id: "constat-1" };
    const edit = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_alert",
      op: "PATCH",
      id: "alert-1",
      data: { commentaires: "Autre" },
      existing: annotation,
    });
    expect(edit).toMatchObject({ allowed: true, values: { commentaires: "Autre" } });

    const sent = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_alert",
      op: "PATCH",
      id: "alert-1",
      data: { commentaires: "Autre" },
      existing: { ...annotation, sent_at: "2026-11-10T10:00:00.000Z" },
    });
    expect(sent.allowed).toBe(false);
  });

  it("refuses alerts of another service", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_alert",
      op: "DELETE",
      id: "alert-1",
      data: {},
      existing: { ...draft, service_id: "service-b", created_by: "user-b" },
    });
    expect(decision.allowed).toBe(false);
  });

  it("keeps corrections in the user's service and their target fixed", async () => {
    const decision = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_correction",
      op: "PUT",
      id: "correction-1",
      data: { target: "mh", reference_pop: "PA00079952", adresse: "1 rue", service_id: "service-b" },
      existing: null,
    });
    expect(decision).toMatchObject({ allowed: true, values: { service_id: "service-a", updated_by: "user-a" } });

    const other = await evaluateWrite({
      trx: noDb,
      user,
      table: "monument_correction",
      op: "PATCH",
      id: "correction-2",
      data: { adresse: "2 rue" },
      existing: { id: "correction-2", target: "mh", reference_pop: "PA1", service_id: "service-b" },
    });
    expect(other.allowed).toBe(false);
  });
});
