CREATE TABLE "attachment_redirection" (
	"id" text PRIMARY KEY NOT NULL,
	"s3_key" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"created_by" text NOT NULL,
	"sent_to" text NOT NULL
);
