import { Type, type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import { ReportPDFDocument } from "@cr-vif/pdf";
import { StateReportPDFDocument } from "@cr-vif/pdf/constat";
import { authenticate } from "./authMiddleware";
import { Database, db } from "../db/db";
import { sendReportMail, sendStateReportMail } from "../features/mail";
import { sendValidationRequestMail } from "../features/validationMail";
import { generatePresignedUrl, getPDFName } from "../services/uploadService";
import { Service } from "../../../frontend/src/db/AppSchema";
import path from "path";
import { makeDebug } from "../features/debug";
import { v4 } from "uuid";
import React from "react";
import { Selectable } from "kysely";
import { getServices } from "../services/services";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parseHTML } from "linkedom";
import crypto from "crypto";

const debug = makeDebug("pdf-plugin");

// prevent the auto organize imports from removing React import
const _noop = () => React;

export const pdfPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  fastify.addHook("preHandler", authenticate);

  fastify.post("/report", { schema: reportPdfTSchema }, async (request) => {
    const { reportId, htmlString } = request.body;
    const { service_id } = request.user!;

    const pictures = await db
      .selectFrom("report_attachment")
      .where("report_id", "=", reportId)
      .where("is_deprecated", "=", false)
      .orderBy("created_at", "asc")
      .selectAll()
      .execute();

    const servicesQuery = await db.selectFrom("service").where("id", "=", service_id).selectAll().execute();
    const service = servicesQuery[0]! as Service;

    const pdf = await generateReportPdf({ htmlString, service, pictures: pictures });

    const name = reportId + "/compte_rendu_" + Math.round(Date.now() / 1000) + ".pdf";

    await request.services.upload.uploadAttachment({ buffer: pdf, filePath: name });

    await db.transaction().execute(async (tx) => {
      await tx
        .insertInto("report_attachment")
        .values({
          id: name,
          attachment_id: name,
          is_deprecated: false,
          report_id: reportId,
          created_at: new Date().toISOString(),
          service_id,
        })
        .execute();
      await tx.updateTable("report").set({ attachment_id: name }).where("id", "=", reportId).execute();
    });

    const userMail = request.user!.email;
    const recipients = request.body.recipients
      .replaceAll(";", ",")
      .split(",")
      .map((r) => r.trim());
    if (!recipients.includes(userMail)) recipients.push(userMail);

    const reportsQuery = await db.selectFrom("report").where("id", "=", reportId).selectAll().execute();
    const report = reportsQuery[0] as Selectable<Database["report"]>;
    await sendReportMail({ recipients: recipients.join(","), pdfBuffer: pdf, report: report! });

    for (const recipient of recipients) {
      const id = v4();

      await db
        .insertInto("sent_email")
        .values({ id, report_id: reportId, sent_to: recipient, sent_at: new Date().toISOString(), service_id })
        .execute();

      await db
        .insertInto("suggested_email")
        .values({ id, email: recipient, service_id })
        .execute()
        .catch(() => {});
    }

    return await generatePresignedUrl(name);
  });

  fastify.get(
    "/report",
    {
      schema: {
        querystring: Type.Object({ reportId: Type.String() }),
        response: { 200: Type.Any() },
      },
    },
    async (request) => {
      const { reportId } = request.query;
      const buffer = await request.services.upload.getReportPDF({ reportId });

      return buffer.toString("base64");
    },
  );

  fastify.get(
    "/state-report",
    {
      schema: {
        querystring: Type.Object({ stateReportId: Type.String() }),
        response: { 200: Type.Any() },
      },
    },
    async (request) => {
      const { stateReportId } = request.query;
      const stateReport = await db
        .selectFrom("state_report")
        .where("id", "=", stateReportId)
        .selectAll()
        .executeTakeFirst();
      if (!stateReport || !stateReport.attachment_id) {
        throw new Error("State report or attachment not found");
      }

      const buffer = await request.services.upload.getAttachment({ filePath: stateReport.attachment_id });

      return buffer.toString("base64");
    },
  );

  fastify.post("/state-report", { schema: stateReportPdfTSchema }, async (request) => {
    const user = request.user!;
    const { stateReportId: stateReportId, htmlString } = request.body;
    debug(`Generating PDF for state report ${stateReportId} by user ${user.id}`);
    debug(`HTML string length: ${htmlString.length}`);
    const stateReportQuery = await db
      .selectFrom("state_report")
      .leftJoin("user", "user.id", "state_report.created_by")
      .selectAll(["state_report"])
      .select(["user.name as createdByName"])
      .where("state_report.id", "=", stateReportId)
      .limit(1)
      .execute();

    if (stateReportQuery.length === 0) {
      return "State report not found";
    }

    const attachmentQuery = await db
      .selectFrom("state_report_attachment")
      .selectAll()
      .where("state_report_id", "=", stateReportId)
      .execute();

    const attachmentsWithUrl = await Promise.all(
      attachmentQuery.map(async (attachment) => {
        const url = await generatePresignedUrl("attachment/" + attachment.id);
        return {
          ...attachment,
          url,
        };
      }),
    );

    const visitedSections = await db
      .selectFrom("visited_section")
      .selectAll()
      .where("state_report_id", "=", stateReportId)
      .execute();

    const visitedSectionAttachments = visitedSections?.length
      ? await db
          .selectFrom("visited_section_attachment")
          .selectAll()
          .where(
            "visited_section_id",
            "in",
            visitedSections.map((vs) => vs.id),
          )
          .execute()
      : [];

    const attachments = await Promise.all(
      visitedSectionAttachments.map(async (attachment) => {
        // const buffer = await getServices().upload.getAttachment({ filePath: attachment.id });
        const url = await generatePresignedUrl("attachment/" + attachment.id);
        return {
          ...attachment,
          url,
        };
      }),
    );

    const attachmentsUrlMap = [...attachmentsWithUrl, ...attachments].map((attachment) => ({
      id: attachment.id,
      url: attachment.url,
    }));

    const service = request.user!.service as Service;
    const pdf = await generateStateReportPdf({ htmlString, service, attachmentsUrlMap });

    const name = stateReportId + "/constat_d_etat_" + Math.round(Date.now() / 1000) + ".pdf";
    await request.services.upload.uploadAttachment({ buffer: pdf, filePath: name });

    await db.transaction().execute(async (tx) => {
      await tx
        .insertInto("state_report_attachment")
        .values({
          id: name,
          attachment_id: name,
          is_deprecated: false,
          state_report_id: stateReportId,
          created_at: new Date().toISOString(),
          service_id: request.user!.service_id,
        })
        .execute();

      await tx.updateTable("state_report").set({ attachment_id: name }).where("id", "=", stateReportId).execute();
    });

    const userMail = request.user!.email;
    const recipients = request.body.recipients
      .replaceAll(";", ",")
      .split(",")
      .map((r) => r.trim());
    if (!recipients.includes(userMail)) recipients.push(userMail);

    const stateReport = stateReportQuery[0]! as Selectable<Database["state_report"]>;

    // Check if user has hierarchical validation enabled
    const userSettings = await db
      .selectFrom("user_settings")
      .where("user_id", "=", user.id)
      .where("service_id", "=", user.service_id)
      .selectAll()
      .executeTakeFirst();

    const hierarchicalValidationEnabled = userSettings?.hierarchical_validation_enabled;
    const supervisorEmail = userSettings?.supervisor_email;

    if (hierarchicalValidationEnabled && supervisorEmail) {
      // Create validation record and send to supervisor
      const validationLink = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

      await db
        .insertInto("state_report_validation")
        .values({
          id: v4(),
          state_report_id: stateReportId,
          user_id: user.id,
          supervisor_email: supervisorEmail,
          original_recipients: recipients.join(","),
          html_string: htmlString,
          alerts_json: request.body.alerts ? JSON.stringify(request.body.alerts) : null,
          status: "pending",
          validation_link: validationLink,
          validation_link_expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          service_id: user.service_id,
        })
        .execute();

      // Send validation request email to supervisor
      await sendValidationRequestMail({
        supervisorEmail,
        validationLink,
        stateReport: stateReport!,
        userName: user.name,
      });

      // Return special response indicating pending validation
      return JSON.stringify({ status: "pending_validation", supervisorEmail });
    }

    // Normal flow: send directly to recipients
    await sendStateReportMail({ recipients: recipients.join(","), pdfBuffer: pdf, stateReport: stateReport!, user });

    for (const recipient of recipients) {
      const id = v4();

      await db
        .insertInto("state_report_sent_email")
        .values({
          id,
          state_report_id: stateReportId,
          sent_to: recipient,
          sent_at: new Date().toISOString(),
          service_id: user.service_id,
        })
        .execute();

      await db
        .insertInto("suggested_email")
        .values({ id, email: recipient, service_id: user.service_id })
        .execute()
        .catch(() => {});
    }

    const url = await generatePresignedUrl("attachment/" + name);
    return url;
  });
};

const generateReportPdf = async ({
  htmlString,
  service,
  pictures,
}: {
  htmlString: string;
  service: Service;
  pictures: Selectable<Database["report_attachment"]>[];
}) => {
  const fontsPath = path.resolve(process.cwd(), "./public");

  Font.register({
    family: "Marianne",
    fonts: [
      {
        src: path.join(fontsPath, `fonts/Marianne-Regular.ttf`),
        fontStyle: "normal",
        fontWeight: "normal",
      },
      { src: path.join(fontsPath, `/fonts/Marianne-Bold.ttf`), fontStyle: "normal", fontWeight: "bold" },
      {
        src: path.join(fontsPath, `/fonts/Marianne-RegularItalic.ttf`),
        fontStyle: "italic",
        fontWeight: "normal",
      },
      {
        src: path.join(fontsPath, `/fonts/Marianne-BoldItalic.ttf`),
        fontStyle: "italic",
        fontWeight: "bold",
      },
    ],
  });

  const pdfImages = await Promise.all(
    pictures.map(async (p) => ({
      url: await generatePresignedUrl("attachment/" + p.attachment_id),
    })),
  );

  return renderToBuffer(
    <ReportPDFDocument
      service={service as Omit<Selectable<Database["service"]>, "visible"> & { visible: any }} // postgres boolean vs sqlite integer
      htmlString={htmlString}
      images={{ marianne: "./public/marianne.png", marianneFooter: "./public/marianne_footer.png" }}
      pictures={pdfImages}
    />,
  );
};

const generateStateReportPdf = async ({
  htmlString,
  service,
  attachmentsUrlMap,
}: {
  htmlString: string;
  service: Service;
  attachmentsUrlMap: { id: string; url: string }[];
}) => {
  const fontsPath = path.resolve(process.cwd(), "./public");
  Font.register({
    family: "Marianne",
    fonts: [
      {
        src: path.join(fontsPath, `fonts/Marianne-Regular.ttf`),
        fontStyle: "normal",
        fontWeight: "normal",
      },
      { src: path.join(fontsPath, `/fonts/Marianne-Bold.ttf`), fontStyle: "normal", fontWeight: "bold" },
      {
        src: path.join(fontsPath, `/fonts/Marianne-RegularItalic.ttf`),
        fontStyle: "italic",
        fontWeight: "normal",
      },
      {
        src: path.join(fontsPath, `/fonts/Marianne-BoldItalic.ttf`),
        fontStyle: "italic",
        fontWeight: "bold",
      },
    ],
  });

  const mappedHtmlString = replaceImageUrls(htmlString, (attachmentId, currentUrl, img) => {
    const newUrl = attachmentsUrlMap.find((att) => att.id === attachmentId)?.url;
    if (newUrl) {
      return newUrl;
    }
    return currentUrl;
  });

  return renderToBuffer(
    <StateReportPDFDocument
      service={service}
      htmlString={mappedHtmlString}
      images={{ marianne: "./public/marianne.png", marianneFooter: "./public/marianne_footer.png" }}
    />,
  );
};

function replaceImageUrls(
  htmlString: string,
  customUrlFunction: (attachmentId: string, currentUrl: string, img: HTMLImageElement) => string,
) {
  const wrappedHtml = `<!DOCTYPE html><html><body>${htmlString}</body></html>`;

  const { document } = parseHTML(wrappedHtml);
  const doc = document;

  const images = doc.querySelectorAll("img[data-attachment-id]");

  images.forEach((img) => {
    const attachmentId = img.getAttribute("data-attachment-id");
    const currentSrc = img.getAttribute("src");

    const newUrl = customUrlFunction(attachmentId!, currentSrc!, img as HTMLImageElement);

    if (newUrl) {
      img.setAttribute("src", newUrl);
    }
  });
  return doc.body.innerHTML;
}

export const reportPdfTSchema = {
  body: Type.Object({
    htmlString: Type.String(),
    reportId: Type.String(),
    recipients: Type.String(),
  }),
  response: { 200: Type.String() },
};

const AlertSchema = Type.Object({
  id: Type.String(),
  alert: Type.Union([Type.String(), Type.Null()]),
  email: Type.String(),
});

export const stateReportPdfTSchema = {
  body: Type.Object({
    htmlString: Type.String(),
    stateReportId: Type.String(),
    recipients: Type.String(),
    alerts: Type.Optional(Type.Array(AlertSchema)),
  }),
  response: { 200: Type.String() },
};
