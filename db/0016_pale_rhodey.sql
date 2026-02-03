ALTER TABLE "state_report_alert" ADD COLUMN "mandatory_emails" text;--> statement-breakpoint
ALTER TABLE "state_report_alert" ADD COLUMN "additional_emails" text;--> statement-breakpoint
ALTER TABLE "state_report_alert" DROP COLUMN "send_email";--> statement-breakpoint
ALTER TABLE "state_report_alert" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "state_report_alert" DROP COLUMN "nom_service_contacte";