-- Add fields to user_settings
ALTER TABLE "user_settings" ADD COLUMN "hierarchical_validation_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "supervisor_email" text;--> statement-breakpoint

-- Create validation tracking table
CREATE TABLE "state_report_validation" (
    "id" text PRIMARY KEY NOT NULL,
    "state_report_id" text NOT NULL REFERENCES "state_report"("id"),
    "user_id" text NOT NULL REFERENCES "user"("id"),
    "supervisor_email" text NOT NULL,
    "original_recipients" text NOT NULL,
    "html_string" text NOT NULL,
    "alerts_json" text,
    "status" text NOT NULL DEFAULT 'pending',
    "validation_link" text UNIQUE,
    "validation_link_expires_at" text,
    "supervisor_comment" text,
    "created_at" text NOT NULL,
    "validated_at" text,
    "service_id" text NOT NULL
);--> statement-breakpoint

CREATE INDEX "state_report_validation_link_idx" ON "state_report_validation" ("validation_link");--> statement-breakpoint
ALTER PUBLICATION powersync ADD TABLE state_report_validation;
