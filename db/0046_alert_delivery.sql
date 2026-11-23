ALTER TABLE "monument_alert" ADD COLUMN "send_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "state_report_alert" ADD COLUMN "sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "state_report_alert" ADD COLUMN "send_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "state_report_alert" ADD COLUMN "last_send_attempt_at" timestamp;--> statement-breakpoint
-- Alerts of constats whose alerts are marked sent: considered sent, so a later send of the constat never repeats them.
-- (Alerts of constats with alerts_sent false keep sent_at NULL: a new send of the constat tries them again, as before.
-- The backend job only retries alerts it saw fail, send_attempts > 0, so nothing older is sent by it.)
UPDATE "state_report_alert" AS a
SET "sent_at" = (now() AT TIME ZONE 'UTC')
FROM "state_report" AS r
WHERE r."id" = a."state_report_id" AND r."attachment_id" IS NOT NULL AND r."alerts_sent" = true;
