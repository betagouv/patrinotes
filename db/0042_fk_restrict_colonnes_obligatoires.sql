ALTER TABLE "report" DROP CONSTRAINT "report_createdBy_fkey";
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_service_id_fkey";
--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE restrict ON UPDATE no action;