CREATE TABLE "constat_pdf_download" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"state_report_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "constat_pdf_download" ADD CONSTRAINT "constat_pdf_download_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "constat_pdf_download" ADD CONSTRAINT "constat_pdf_download_state_report_id_fkey" FOREIGN KEY ("state_report_id") REFERENCES "public"."state_report"("id") ON DELETE no action ON UPDATE no action;