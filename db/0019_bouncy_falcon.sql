CREATE TABLE "constat_validation" (
    "id" text PRIMARY KEY NOT NULL,
    "state_report_id" text,
    "token" text NOT NULL,
    "token_expires_at" text NOT NULL,
    "validator_email" text NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "comment" text,
    "recipients" text NOT NULL,
    "pdf_path" text NOT NULL,
    "created_at" text NOT NULL,
    "service_id" text
);
--> statement-breakpoint
ALTER TABLE "user_settings"
ADD COLUMN "validation_enabled" boolean DEFAULT false;
--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "validation_email" text;

ALTER PUBLICATION powersync ADD TABLE "constat_validation";