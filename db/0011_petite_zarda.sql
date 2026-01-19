CREATE TABLE "state_report_alert" (
    "id" text PRIMARY KEY NOT NULL,
    "state_report_id" text NOT NULL,
    "alert" text NOT NULL,
    "commentaires" text,
    "show_in_report" boolean,
    "service_id" text
);
--> statement-breakpoint
CREATE TABLE "state_report_alert_attachment" (
    "id" text PRIMARY KEY NOT NULL,
    "is_deprecated" boolean,
    "attachment_id" text NOT NULL,
    "state_report_alert_id" text NOT NULL,
    "label" text,
    "created_at" timestamp,
    "service_id" text
);

ALTER PUBLICATION powersync ADD TABLE state_report_alert;

ALTER PUBLICATION powersync ADD TABLE state_report_alert_attachment;