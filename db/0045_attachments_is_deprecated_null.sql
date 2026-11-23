-- DAT-07: rows copied by 0026 kept is_deprecated NULL; the sync rules and the attachment queue only take
-- is_deprecated = false (0), so their photos never reached the devices. Team decision: show them again, without
-- duplicates.
-- A constat has one plan de situation and one plan de l'édifice: a NULL row of those types stays hidden (true) when
-- the constat already has a visible one of the same type; otherwise the most recent NULL row of that type is shown
-- (false) and the older ones stay hidden. Vues générales, other photos and the other tables: shown (false).
WITH ranked AS (
  SELECT
    a."id",
    EXISTS (
      SELECT 1
      FROM "state_report_attachment" visible
      WHERE visible."state_report_id" = a."state_report_id"
        AND visible."type" = a."type"
        AND visible."is_deprecated" = false
    ) AS has_visible,
    row_number() OVER (
      PARTITION BY a."state_report_id", a."type"
      ORDER BY a."created_at" DESC NULLS LAST, a."id" DESC
    ) AS rank
  FROM "state_report_attachment" a
  WHERE a."is_deprecated" IS NULL AND a."type" IN ('plan_situation', 'plan_edifice')
)
UPDATE "state_report_attachment" AS a
SET "is_deprecated" = (ranked.has_visible OR ranked.rank > 1)
FROM ranked
WHERE a."id" = ranked."id";
--> statement-breakpoint
UPDATE "state_report_attachment" SET "is_deprecated" = false WHERE "is_deprecated" IS NULL;
--> statement-breakpoint
UPDATE "report_attachment" SET "is_deprecated" = false WHERE "is_deprecated" IS NULL;
--> statement-breakpoint
UPDATE "visited_section_attachment" SET "is_deprecated" = false WHERE "is_deprecated" IS NULL;
--> statement-breakpoint
UPDATE "state_report_alert_attachment" SET "is_deprecated" = false WHERE "is_deprecated" IS NULL;
--> statement-breakpoint
UPDATE "monument_alert_attachment" SET "is_deprecated" = false WHERE "is_deprecated" IS NULL;
