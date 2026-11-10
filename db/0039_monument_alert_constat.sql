ALTER TABLE "monument_alert" ADD COLUMN "state_report_id" text;--> statement-breakpoint
CREATE INDEX "monument_alert_state_report_id_idx" ON "monument_alert" USING btree ("state_report_id");