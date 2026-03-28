ALTER TABLE "state_report" DROP COLUMN "bilan_quinquennal";
--> statement-breakpoint
ALTER TABLE "state_report"
ADD COLUMN "bilan_quinquennal" boolean DEFAULT true;
--> statement-breakpoint
ALTER TABLE "picture_lines" ADD COLUMN "newAttachmentId" text;
--> statement-breakpoint
ALTER TABLE "state_report"
ADD COLUMN "visite_partielle_parties" text;
--> statement-breakpoint
UPDATE "state_report"
SET
    "visite_partielle_parties" = "visite_partielle_details";
--> statement-breakpoint
UPDATE "state_report" SET "visite_partielle_details" = NULL;