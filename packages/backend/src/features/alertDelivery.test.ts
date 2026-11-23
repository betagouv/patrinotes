import { sql } from "kysely";
import { afterAll, describe, expect, it, vi } from "vitest";

const sendAlertEmail = vi.fn(async (_args: { to: string; alert: { id: string } }) => ({}));
vi.mock("./mail", () => ({ sendAlertEmail, sendMonumentAlertEmail: vi.fn() }));

const { db } = await import("../db/db");
const { runAlertDelivery, MAX_SEND_ATTEMPTS } = await import("./alertDelivery");

/** Runs on the test database (docker compose -p patrinotes-test); skipped when it is not running. */
const isDatabaseUp = await sql`select 1`
  .execute(db)
  .then(() => true)
  .catch(() => false);

describe.skipIf(!isDatabaseUp)("retry of constat alerts that failed (DAT-08)", () => {
  const prefix = `alert-delivery-${Date.now()}`;
  const ids = {
    user: `${prefix}-user`,
    constat: `${prefix}-constat`,
    failed: `${prefix}-failed`,
    sent: `${prefix}-sent`,
    notChosen: `${prefix}-not-chosen`,
    exhausted: `${prefix}-exhausted`,
  };
  const old = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  afterAll(async () => {
    await db.deleteFrom("state_report_alert").where("state_report_id", "=", ids.constat).execute();
    await db.deleteFrom("state_report").where("id", "=", ids.constat).execute();
    await db.deleteFrom("user").where("id", "=", ids.user).execute();
    await db.destroy();
  });

  it("sends again only the alerts that failed, never one already sent or not chosen, then marks the constat", async () => {
    const service = await db.selectFrom("service").select("id").executeTakeFirstOrThrow();
    await db
      .insertInto("user")
      .values({ id: ids.user, email: `${prefix}@culture.gouv.fr`, name: "Agent Test", job: "", service_id: service.id } as any)
      .execute();
    await db
      .insertInto("state_report")
      .values({
        id: ids.constat,
        created_by: ids.user,
        service_id: service.id,
        attachment_id: `${ids.constat}/constat.pdf`,
        created_at: new Date().toISOString(),
        alerts_sent: false,
        disabled: false,
      } as any)
      .execute();
    const alert = (id: string, values: Record<string, unknown>) => ({
      id,
      state_report_id: ids.constat,
      alert: "Sécurité",
      should_send: true,
      additional_emails: `${id}@example.com`,
      service_id: service.id,
      ...values,
    });
    await db
      .insertInto("state_report_alert")
      .values([
        alert(ids.failed, { send_attempts: 1, last_send_attempt_at: old }),
        alert(ids.sent, { send_attempts: 1, last_send_attempt_at: old, sent_at: old }),
        // not selected by the agent when sending: never tried, never sent by the job
        alert(ids.notChosen, { send_attempts: 0 }),
      ] as any)
      .execute();

    await runAlertDelivery();

    expect(sendAlertEmail.mock.calls.map(([args]) => args.alert.id)).toEqual([ids.failed]);
    expect(sendAlertEmail.mock.calls[0]![0].to).toBe(`${ids.failed}@example.com`);
    const rows = await db
      .selectFrom("state_report_alert")
      .select(["id", "sent_at", "send_attempts"])
      .where("state_report_id", "=", ids.constat)
      .execute();
    const byId = Object.fromEntries(rows.map((row) => [row.id, row]));
    expect(byId[ids.failed]).toMatchObject({ send_attempts: 2, sent_at: expect.anything() });
    expect(byId[ids.notChosen]).toMatchObject({ send_attempts: 0, sent_at: null });
    const constat = await db.selectFrom("state_report").select("alerts_sent").where("id", "=", ids.constat).executeTakeFirst();
    expect(constat?.alerts_sent).toBe(true);

    // nothing left to send: a second run sends nothing
    await runAlertDelivery();
    expect(sendAlertEmail).toHaveBeenCalledTimes(1);
  });

  it("stops after the maximum number of attempts", async () => {
    sendAlertEmail.mockClear();
    sendAlertEmail.mockRejectedValue(new Error("SMTP indisponible"));
    await db.updateTable("state_report").set({ alerts_sent: false }).where("id", "=", ids.constat).execute();
    await db
      .insertInto("state_report_alert")
      .values({
        id: ids.exhausted,
        state_report_id: ids.constat,
        alert: "Sécurité",
        should_send: true,
        additional_emails: "x@example.com",
        send_attempts: MAX_SEND_ATTEMPTS - 1,
        last_send_attempt_at: old,
      } as any)
      .execute();

    await runAlertDelivery();
    expect(sendAlertEmail).toHaveBeenCalledTimes(1);
    const row = await db.selectFrom("state_report_alert").selectAll().where("id", "=", ids.exhausted).executeTakeFirst();
    expect(row).toMatchObject({ send_attempts: MAX_SEND_ATTEMPTS, sent_at: null });

    await db.updateTable("state_report_alert").set({ last_send_attempt_at: old }).where("id", "=", ids.exhausted).execute();
    await runAlertDelivery();
    expect(sendAlertEmail).toHaveBeenCalledTimes(1);
  });
});
