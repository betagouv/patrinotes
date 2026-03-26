ALTER TABLE "report_attachment" ADD COLUMN "is_ignored" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "state_report_alert_attachment" ADD COLUMN "is_ignored" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "state_report_attachment" ADD COLUMN "is_ignored" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "visited_section_attachment" ADD COLUMN "is_ignored" boolean DEFAULT false;