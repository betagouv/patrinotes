import { readFileSync } from "node:fs";
import path from "node:path";
import { sql } from "kysely";
import { afterAll, describe, expect, it } from "vitest";
import { db } from "./db";

/**
 * Migration 0045 (DAT-07), run on the test database inside a transaction that is rolled back.
 * Skipped when the test database (docker compose -p patrinotes-test) is not running.
 */
const migration = readFileSync(path.resolve(__dirname, "../../../../db/0045_attachments_is_deprecated_null.sql"), "utf8");
const statements = migration.split("--> statement-breakpoint");

const isDatabaseUp = await sql`select 1`
  .execute(db)
  .then(() => true)
  .catch(() => false);

class Rollback extends Error {}

describe.skipIf(!isDatabaseUp)("migration 0045: attachments with is_deprecated NULL", () => {
  afterAll(() => db.destroy());

  it("shows them again without duplicating a constat's plans", async () => {
    const prefix = `m0045-${Date.now()}`;
    const row = (id: string, stateReportId: string, type: string | null, isDeprecated: boolean | null, createdAt: string) => ({
      id: `${prefix}-${id}`,
      attachment_id: `${prefix}/${id}.jpg`,
      state_report_id: `${prefix}-${stateReportId}`,
      type: type as any,
      is_deprecated: isDeprecated,
      created_at: createdAt,
    });

    let result: Record<string, boolean | null> = {};
    let others: Array<boolean | null> = [];
    await db
      .transaction()
      .execute(async (trx) => {
        await trx
          .insertInto("state_report_attachment")
          .values([
            // constat A already has a visible plan de situation: the old copy stays hidden
            row("a-visible", "A", "plan_situation", false, "2026-01-02"),
            row("a-null", "A", "plan_situation", null, "2026-01-01"),
            // constat B has only old copies of its plan de l'édifice: the most recent one is shown, once
            row("b-old", "B", "plan_edifice", null, "2025-01-01"),
            row("b-new", "B", "plan_edifice", null, "2025-06-01"),
            // a hidden (deprecated) plan does not count as visible
            row("c-deprecated", "C", "plan_situation", true, "2026-01-02"),
            row("c-null", "C", "plan_situation", null, "2026-01-01"),
            // vues générales and untyped photos: all shown
            row("d-vue-1", "D", "vue_generale", null, "2025-01-01"),
            row("d-vue-2", "D", "vue_generale", null, "2025-01-02"),
            row("d-untyped", "D", null, null, "2025-01-03"),
          ])
          .execute();
        await trx
          .insertInto("report_attachment")
          .values({ id: `${prefix}-r`, attachment_id: `${prefix}/r.jpg`, report_id: `${prefix}-R`, is_deprecated: null })
          .execute();

        for (const statement of statements) await sql.raw(statement).execute(trx);

        const rows = await trx
          .selectFrom("state_report_attachment")
          .select(["id", "is_deprecated"])
          .where("id", "like", `${prefix}-%`)
          .execute();
        result = Object.fromEntries(rows.map((r) => [r.id.slice(prefix.length + 1), r.is_deprecated]));
        others = (
          await trx.selectFrom("report_attachment").select("is_deprecated").where("id", "=", `${prefix}-r`).execute()
        ).map((r) => r.is_deprecated);
        throw new Rollback();
      })
      .catch((error) => {
        if (!(error instanceof Rollback)) throw error;
      });

    expect(result).toEqual({
      "a-visible": false,
      "a-null": true,
      "b-old": true,
      "b-new": false,
      "c-deprecated": true,
      "c-null": false,
      "d-vue-1": false,
      "d-vue-2": false,
      "d-untyped": false,
    });
    expect(others).toEqual([false]);
  });
});
