-- Default for new rows only. Existing NULL rows (copied by 0026) are deliberately left as they are:
-- making them synchronisable would show old plans and photos in constats and their PDF (decision pending).
ALTER TABLE "monument_alert_attachment" ALTER COLUMN "is_deprecated" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "report_attachment" ALTER COLUMN "is_deprecated" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "state_report_alert_attachment" ALTER COLUMN "is_deprecated" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "state_report_attachment" ALTER COLUMN "is_deprecated" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "visited_section_attachment" ALTER COLUMN "is_deprecated" SET DEFAULT false;