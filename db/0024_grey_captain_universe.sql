ALTER TABLE "internal_user" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "whitelist" ADD COLUMN "createdAt" timestamp DEFAULT now();