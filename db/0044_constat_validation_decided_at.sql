ALTER TABLE "constat_validation" ADD COLUMN "decided_at" text;--> statement-breakpoint
-- Accepted before this column existed: the constat was emailed to its recipients at acceptance, the first email sent
-- for it after the validation request gives the date. Declined ones have no trace of the date: left null.
UPDATE "constat_validation" AS cv
SET "decided_at" = to_char(sent.first_sent_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
FROM (
  SELECT v."id", min(e."sent_at") AS first_sent_at
  FROM "constat_validation" v
  JOIN "state_report_sent_email" e ON e."state_report_id" = v."state_report_id" AND e."sent_at" >= v."created_at"::timestamp
  WHERE v."status" = 'accepted'
  GROUP BY v."id"
) AS sent
WHERE cv."id" = sent."id" AND cv."decided_at" IS NULL;
