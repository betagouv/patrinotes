CREATE TABLE "monument_alert" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"status" text NOT NULL,
	"reference_pop" text NOT NULL,
	"titre_edifice" text,
	"commune" text,
	"up_id" text,
	"up_intitule" text,
	"objet_reference" text,
	"objet_titre" text,
	"alert" text,
	"probleme" text,
	"presence" text,
	"etat" text,
	"securite" text,
	"commentaires" text,
	"should_send" boolean,
	"mandatory_emails" text,
	"additional_emails" text,
	"created_by" text,
	"created_by_name" text,
	"created_at" timestamp,
	"submitted_at" timestamp,
	"sent_at" timestamp,
	"service_id" text
);
--> statement-breakpoint
CREATE TABLE "monument_alert_attachment" (
	"id" text PRIMARY KEY NOT NULL,
	"is_deprecated" boolean,
	"attachment_id" text NOT NULL,
	"monument_alert_id" text NOT NULL,
	"label" text,
	"created_at" timestamp,
	"service_id" text
);
--> statement-breakpoint
CREATE TABLE "monument_correction" (
	"id" text PRIMARY KEY NOT NULL,
	"target" text NOT NULL,
	"reference_pop" text NOT NULL,
	"up_id" text,
	"objet_reference" text,
	"nature_edifice" text,
	"adresse" text,
	"commune" text,
	"commune_historique" text,
	"reference_cadastrale" text,
	"periode_construction" text,
	"nature_protection" text,
	"parties_protegees" text,
	"description" text,
	"emplacement" text,
	"updated_at" timestamp,
	"updated_by" text,
	"service_id" text
);
--> statement-breakpoint
CREATE INDEX "monument_alert_reference_pop_idx" ON "monument_alert" USING btree ("reference_pop");--> statement-breakpoint
CREATE INDEX "monument_alert_service_id_idx" ON "monument_alert" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "monument_correction_reference_pop_idx" ON "monument_correction" USING btree ("reference_pop");
--> statement-breakpoint
ALTER PUBLICATION powersync ADD TABLE monument_alert;--> statement-breakpoint
ALTER PUBLICATION powersync ADD TABLE monument_alert_attachment;--> statement-breakpoint
ALTER PUBLICATION powersync ADD TABLE monument_correction;
