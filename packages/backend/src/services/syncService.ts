import { Static, TSchema, Type } from "@sinclair/typebox";
import { Database, db } from "../db/db";
import { makeDebug } from "../features/debug";
import { getServices } from "./services";
import { v4 } from "uuid";
import { AuthUser } from "../routes/authMiddleware";
import { text } from "stream/consumers";
import { OnNewImage } from "./uploadService";
import { Selectable } from "kysely";
import { ENV } from "../envVars";

const debug = makeDebug("sync-service");

export const Nullable = <T extends TSchema>(schema: T) => Type.Optional(Type.Union([schema, Type.Null()]));

const blackListedTables = ["internal_user"];

const getBlackListedTables = () => {
  const base = [...blackListedTables];
  if (!ENV.VITE_ALERTES_MH_ENABLED) {
    base.push("state_report_alert", "state_report_alert_attachment");
  }

  return base;
};

export class SyncService {
  async applyCrud(operation: Static<typeof crudTSchema>, user: AuthUser) {
    await db
      .insertInto("transactions")
      .values({
        id: v4(),
        entity_id: operation.id,
        type: operation.type,
        op_id: operation.op_id,
        tx_id: operation.tx_id,
        data: JSON.stringify(operation.data),
        op: operation.op,
        created_at: new Date().toISOString(),
        user_id: user.id,
      })
      .execute();

    if (getBlackListedTables().includes(operation.type)) {
      return { error: "Unauthorized" };
    }

    try {
      if (operation.op === "DELETE") {
        debug("Deleting row on table", operation.type, "with id", operation.id);
        const { type, id } = operation;
        await db
          .deleteFrom(type as any)
          .where("id", "=", id)
          .execute();
      }
      if (operation.op === "PATCH") {
        debug("Patching row on table", operation.type, "with id", operation.id);
        const { type, id, data } = operation;
        await db
          .updateTable(type as any)
          .set(data as any)
          .where("id", "=", id)
          .execute();
      }
      if (operation.op === "PUT") {
        debug("Inserting row on table", operation.type);
        const { type, data, id } = operation;
        await db
          .insertInto(type as any)
          .values({ id, ...data } as any)
          .execute();
      }

      if (operation.type === "picture_lines") {
        debug("updating picture lines");
        const pictureLines = await db.selectFrom("picture_lines").where("id", "=", operation.id).selectAll().execute();
        const { attachmentId, service_id, table } = pictureLines?.[0] || {};

        const onNewImage = onNewImageMap[table!];

        if (onNewImage) {
          getServices().upload.handleNotifyPictureLines({
            pictureId: attachmentId!,
            serviceId: service_id!,
            onNewImage,
          });
        }

        //   if (table === "report_attachment") {
        //   } else if (table === "state_report_attachment") {
        //     debug("picture lines for state report attachment");
        //     const pictureId = attachmentId!;
        //     const onNewImage: OnNewImage = async (tx, { originalName, newName, url }) => {
        //       const possibleColumns = ["plan_situation", "plan_edifice", "vue_generale"] as const;

        //       const attachment = await tx
        //         .selectFrom("state_report_attachment")
        //         .where("id", "=", pictureId)
        //         .selectAll()
        //         .execute();

        //       if (!attachment || !attachment[0]) {
        //         debug("No attachment found for picture", originalName);
        //         return;
        //       }

        //       const stateReportId = attachment[0].state_report_id;

        //       const reportQuery = await tx
        //         .selectFrom("state_report")
        //         .where("id", "=", stateReportId)
        //         .selectAll()
        //         .execute();
        //       const report = reportQuery[0]!;
        //       if (!report) {
        //         debug("No state report found for picture", originalName);
        //         return;
        //       }

        //       const prop = possibleColumns.find((col) => report[col] === originalName);
        //       if (!prop) {
        //         debug("No matching property found for picture", originalName);
        //         return;
        //       }

        //       await tx
        //         .updateTable("state_report")
        //         .set({ [prop]: newName })
        //         .where("id", "=", report.id)
        //         .execute();
        //     };
        //   }
      }
    } catch (e) {
      debug("Error on applyCrud", e);

      return { success: false, error: e };
    }

    return { success: true };
  }
}

const onNewImageMap: Record<string, OnNewImage> = {
  report_attachment: async (tx, { originalName, newName, url, attachmentId, serviceId }) => {
    debug("picture lines for report attachment");
    const reportAttachmentQuery = await tx
      .selectFrom("report_attachment")
      .where("id", "=", attachmentId)
      .selectAll()
      .execute();

    const reportId = reportAttachmentQuery[0]?.report_id;
    if (!reportId) {
      debug("No report found for picture", originalName);
      return;
    }

    await tx
      .insertInto("report_attachment")
      .values({
        id: newName,
        attachment_id: newName,
        is_deprecated: false,
        report_id: reportId,
        created_at: new Date().toISOString(),
        service_id: serviceId,
      })
      .execute();

    await tx.updateTable("report_attachment").set({ is_deprecated: true }).where("id", "=", originalName).execute();
  },
  state_report_attachment: async (tx, { originalName, newName, url, attachmentId, serviceId }) => {
    debug("picture lines for state report attachment");
    const attachment = await tx
      .selectFrom("state_report_attachment")
      .where("id", "=", attachmentId)
      .selectAll()
      .execute();

    const stateReportId = attachment?.[0]?.state_report_id;
    if (!stateReportId) {
      debug("No attachment found for picture", originalName);
      return;
    }
    const reportQuery = await tx.selectFrom("state_report").where("id", "=", stateReportId).selectAll().execute();

    const report = reportQuery[0]!;
    if (!report) {
      debug("No state report found for picture", originalName);
      return;
    }
    const possibleColumns = ["plan_situation", "plan_edifice", "vue_generale"] as const;
    const prop = possibleColumns.find((p) => report[p] === originalName);
    debug("found prop", prop);
    if (!prop) {
      debug("No matching property found for picture", originalName);
      return;
    }

    await tx
      .insertInto("state_report_attachment")
      .values({
        id: newName,
        attachment_id: newName,
        is_deprecated: false,
        state_report_id: stateReportId,
        created_at: new Date().toISOString(),
        service_id: serviceId,
        label: attachment[0]?.label,
      })
      .execute();

    await tx
      .updateTable("state_report")
      .set({ [prop]: newName })
      .where("id", "=", report.id)
      .execute();

    await tx
      .updateTable("state_report_attachment")
      .set({ is_deprecated: true })
      .where("id", "=", originalName)
      .execute();
  },
  visited_section_attachment: async (tx, { originalName, newName, url, attachmentId, serviceId }) => {
    const attachment = await tx
      .selectFrom("visited_section_attachment")
      .where("id", "=", attachmentId)
      .selectAll()
      .execute();

    console.log("attachment", attachment);
    const visitedSectionId = attachment?.[0]?.visited_section_id;
    if (!visitedSectionId) {
      debug("No attachment found for picture", originalName);
      return;
    }

    await tx
      .insertInto("visited_section_attachment")
      .values({
        id: newName,
        attachment_id: newName,
        is_deprecated: false,
        visited_section_id: visitedSectionId,
        created_at: new Date().toISOString(),
        service_id: serviceId,
        label: attachment[0]?.label,
      })
      .execute();

    await tx
      .updateTable("visited_section_attachment")
      .set({ is_deprecated: true })
      .where("id", "=", originalName)
      .execute();
  },
};

// await tx
//         .insertInto("report_attachment")
//         .values({
//           id: name,
//           attachment_id: name,
//           is_deprecated: false,
//           report_id: picture.report_id,
//           created_at: new Date().toISOString(),
//           service_id: picture.service_id,
//         })
//         .execute();
export const crudTSchema = Type.Object({
  op_id: Type.Number(),
  tx_id: Nullable(Type.Number()),
  id: Type.String(),
  type: Type.String(),
  op: Type.String(),
  data: Type.Optional(Type.Any()),
});
