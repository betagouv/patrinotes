ALTER TABLE "picture_lines" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DROP TABLE "picture_lines" CASCADE;
--> statement-breakpoint
ALTER TABLE "state_report_attachment"
ALTER COLUMN "created_at"
SET DEFAULT now();
--> statement-breakpoint
ALTER TABLE "state_report_attachment" ADD COLUMN "type" text;
--> statement-breakpoint
-- plan_situation (single attachment ID)
INSERT INTO
    state_report_attachment (
        id,
        attachment_id,
        state_report_id,
        type,
        service_id,
        created_at
    )
SELECT
    gen_random_uuid (),
    plan_situation,
    id,
    'plan_situation',
    service_id,
    NOW()
FROM state_report
WHERE
    plan_situation IS NOT NULL
    AND plan_situation != '';

-- plan_edifice (single attachment ID)
INSERT INTO
    state_report_attachment (
        id,
        attachment_id,
        state_report_id,
        type,
        service_id,
        created_at
    )
SELECT
    gen_random_uuid (),
    plan_edifice,
    id,
    'plan_edifice',
    service_id,
    NOW()
FROM state_report
WHERE
    plan_edifice IS NOT NULL
    AND plan_edifice != '';

-- vue_generale (semicolon-separated list of attachment IDs)
INSERT INTO
    state_report_attachment (
        id,
        attachment_id,
        state_report_id,
        type,
        service_id,
        created_at
    )
SELECT gen_random_uuid (), trim(vue_id), sr.id, 'vue_generale', sr.service_id, NOW()
FROM state_report sr, unnest (
        string_to_array (sr.vue_generale, ';')
    ) AS vue_id
WHERE
    sr.vue_generale IS NOT NULL
    AND sr.vue_generale != ''
    AND trim(vue_id) != '';

ALTER TABLE "state_report" DROP COLUMN "plan_situation";
--> statement-breakpoint
ALTER TABLE "state_report" DROP COLUMN "plan_edifice";
--> statement-breakpoint
ALTER TABLE "state_report" DROP COLUMN "vue_generale";