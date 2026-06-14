ALTER TABLE "state_report" ADD COLUMN "version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "state_report" ADD COLUMN "taux_degradation" integer;--> statement-breakpoint
ALTER TABLE "state_report" ADD COLUMN "vitesse_degradation" text;--> statement-breakpoint
ALTER TABLE "visited_section" ADD COLUMN "niveau_degradation" text;--> statement-breakpoint
ALTER TABLE "visited_section" ADD COLUMN "preconisations" text;