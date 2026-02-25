CREATE TABLE "atdatabases_migrations_version" (
    "id" integer PRIMARY KEY NOT NULL,
    "version" text
);
--> statement-breakpoint
CREATE TABLE "atdatabases_migrations_applied" (
    "id" bigserial PRIMARY KEY NOT NULL,
    "index" integer NOT NULL,
    "name" text NOT NULL,
    "script" text NOT NULL,
    "applied_at" timestamp
    with
        time zone NOT NULL,
        "ignored_error" text,
        "obsolete" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
    "id" text PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "udap_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "internal_user" (
    "id" text PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "role" text NOT NULL,
    "password" text NOT NULL,
    "temporaryLink" text,
    "temporaryLinkExpiresAt" text,
    "userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delegation" (
    "id" text PRIMARY KEY NOT NULL,
    "createdBy" text NOT NULL,
    "delegatedTo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "whitelist" ( "email" text PRIMARY KEY NOT NULL );
--> statement-breakpoint
CREATE TABLE "service_instructeurs" (
    "id" text PRIMARY KEY NOT NULL,
    "full_name" text NOT NULL,
    "short_name" text NOT NULL,
    "email" text,
    "tel" text,
    "udap_id" text
);
--> statement-breakpoint
CREATE TABLE "clause_v2" (
    "id" text PRIMARY KEY NOT NULL,
    "key" text NOT NULL,
    "value" text NOT NULL,
    "position" integer,
    "udap_id" text,
    "text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pdf_snapshot" (
    "id" text PRIMARY KEY NOT NULL,
    "report_id" text,
    "html" text,
    "report" text,
    "user_id" text
);
--> statement-breakpoint
CREATE TABLE "tmp_pictures" (
    "id" text PRIMARY KEY NOT NULL,
    "reportId" text,
    "createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "picture_lines" (
    "id" text PRIMARY KEY NOT NULL,
    "pictureId" text,
    "lines" text NOT NULL,
    "createdAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "pictures" (
    "id" text PRIMARY KEY NOT NULL,
    "reportId" text,
    "url" text,
    "createdAt" timestamp,
    "finalUrl" text
);
--> statement-breakpoint
CREATE TABLE "transactions" (
    "id" text PRIMARY KEY NOT NULL,
    "op_id" integer NOT NULL,
    "tx_id" integer,
    "entity_id" text NOT NULL,
    "type" text NOT NULL,
    "op" text NOT NULL,
    "data" text,
    "user_id" text NOT NULL,
    "created_at" timestamp,
    "error" text
);
--> statement-breakpoint
CREATE TABLE "report" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text,
    "projectDescription" text,
    "redactedBy" text,
    "meetDate" timestamp,
    "applicantName" text,
    "applicantAddress" text,
    "projectCadastralRef" text,
    "projectSpaceType" text,
    "decision" text,
    "precisions" text,
    "contacts" text,
    "furtherInformation" text,
    "createdBy" text NOT NULL,
    "createdAt" timestamp NOT NULL,
    "serviceInstructeur" text,
    "pdf" text,
    "disabled" boolean,
    "udap_id" text,
    "redactedById" text,
    "applicantEmail" text,
    "city" text,
    "zipCode" text
);
--> statement-breakpoint
CREATE TABLE "sent_email" (
    "id" text PRIMARY KEY NOT NULL,
    "report_id" text,
    "sent_to" text NOT NULL,
    "sent_at" timestamp NOT NULL,
    "udap_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suggested_email" (
    "id" text PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "udap_id" text NOT NULL,
    CONSTRAINT "suggested_email_email_key" UNIQUE ("email")
);
--> statement-breakpoint
CREATE TABLE "udap" (
    "id" text PRIMARY KEY NOT NULL,
    "department" text NOT NULL,
    "completeCoords" text,
    "visible" boolean,
    "name" text,
    "address" text,
    "zipCode" text,
    "city" text,
    "phone" text,
    "email" text,
    "marianne_text" text,
    "drac_text" text,
    "udap_text" text,
    "dept_number" text
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text,
    "default_emails" text,
    "udap_id" text
);
--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_udap_id_fkey" FOREIGN KEY ("udap_id") REFERENCES "public"."udap"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "internal_user" ADD CONSTRAINT "internal_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "delegation" ADD CONSTRAINT "delegation_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "delegation" ADD CONSTRAINT "delegation_delegatedTo_fkey" FOREIGN KEY ("delegatedTo") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "tmp_pictures" ADD CONSTRAINT "tmp_pictures_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."report"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."report"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sent_email" ADD CONSTRAINT "sent_email_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."report"("id") ON DELETE no action ON UPDATE no action;

ALTER PUBLICATION powersync
ADD
TABLE "user",
"delegation",
"service_instructeurs",
"clause_v2",
"pdf_snapshot",
"tmp_pictures",
"picture_lines",
"pictures",
"transactions",
"report",
"sent_email",
"suggested_email",
"udap",
"user_settings";