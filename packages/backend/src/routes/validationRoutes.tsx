import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { db } from "../db/db";
import { generatePresignedUrl } from "../services/uploadService";
import { Font, renderToBuffer } from "@react-pdf/renderer";
import { StateReportPDFDocument } from "@cr-vif/pdf/constat";
import path from "path";
import React from "react";
import { Service } from "../../../frontend/src/db/AppSchema";
import { sendStateReportMail } from "../features/mail";
import { sendValidationApprovedMail, sendValidationRejectedMail } from "../features/validationMail";
import { parseHTML } from "linkedom";

const _noop = () => React;

export const validationPlugin: FastifyPluginAsyncTypebox = async (fastify, _) => {
  // GET /api/validation/:link - Get validation data (public, no auth)
  fastify.get(
    "/:link",
    {
      schema: {
        params: Type.Object({ link: Type.String() }),
        response: {
          200: Type.Object({
            id: Type.String(),
            stateReportId: Type.String(),
            supervisorEmail: Type.String(),
            status: Type.String(),
            createdAt: Type.String(),
            stateReport: Type.Object({
              titre_edifice: Type.Union([Type.String(), Type.Null()]),
              commune: Type.Union([Type.String(), Type.Null()]),
              date_visite: Type.Union([Type.String(), Type.Null()]),
            }),
            user: Type.Object({
              name: Type.String(),
            }),
          }),
          404: Type.Object({ error: Type.String() }),
          410: Type.Object({ error: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { link } = request.params;

      const validation = await db
        .selectFrom("state_report_validation")
        .where("validation_link", "=", link)
        .selectAll()
        .executeTakeFirst();

      if (!validation) {
        return reply.status(404).send({ error: "Lien de validation non trouvé" });
      }

      // Check if link has expired
      if (validation.validation_link_expires_at && new Date(validation.validation_link_expires_at) < new Date()) {
        return reply.status(410).send({ error: "Le lien de validation a expiré" });
      }

      // Check if already processed
      if (validation.status !== "pending") {
        return reply.status(410).send({ error: "Cette demande de validation a déjà été traitée" });
      }

      const stateReport = await db
        .selectFrom("state_report")
        .where("id", "=", validation.state_report_id)
        .select(["titre_edifice", "commune", "date_visite"])
        .executeTakeFirst();

      const user = await db
        .selectFrom("user")
        .where("id", "=", validation.user_id)
        .select(["name"])
        .executeTakeFirst();

      return {
        id: validation.id,
        stateReportId: validation.state_report_id,
        supervisorEmail: validation.supervisor_email,
        status: validation.status,
        createdAt: validation.created_at,
        stateReport: stateReport || { titre_edifice: null, commune: null, date_visite: null },
        user: user || { name: "" },
      };
    },
  );

  // GET /api/validation/:link/pdf - Get PDF for download (public)
  fastify.get(
    "/:link/pdf",
    {
      schema: {
        params: Type.Object({ link: Type.String() }),
        response: {
          200: Type.String(),
          404: Type.Object({ error: Type.String() }),
          410: Type.Object({ error: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { link } = request.params;

      const validation = await db
        .selectFrom("state_report_validation")
        .where("validation_link", "=", link)
        .selectAll()
        .executeTakeFirst();

      if (!validation) {
        return reply.status(404).send({ error: "Lien de validation non trouvé" });
      }

      // Check if link has expired
      if (validation.validation_link_expires_at && new Date(validation.validation_link_expires_at) < new Date()) {
        return reply.status(410).send({ error: "Le lien de validation a expiré" });
      }

      const stateReport = await db
        .selectFrom("state_report")
        .where("id", "=", validation.state_report_id)
        .selectAll()
        .executeTakeFirst();

      if (!stateReport) {
        return reply.status(404).send({ error: "Constat non trouvé" });
      }

      const service = await db
        .selectFrom("service")
        .where("id", "=", validation.service_id)
        .selectAll()
        .executeTakeFirst();

      if (!service) {
        return reply.status(404).send({ error: "Service non trouvé" });
      }

      // Get attachments URLs for the PDF
      const attachmentQuery = await db
        .selectFrom("state_report_attachment")
        .selectAll()
        .where("state_report_id", "=", validation.state_report_id)
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
        .where("state_report_id", "=", validation.state_report_id)
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

      // Generate PDF from stored HTML
      const pdf = await generateStateReportPdf({
        htmlString: validation.html_string,
        service: service as Service,
        attachmentsUrlMap,
      });

      return pdf.toString("base64");
    },
  );

  // POST /api/validation/:link/decision - Submit decision (public)
  fastify.post(
    "/:link/decision",
    {
      schema: {
        params: Type.Object({ link: Type.String() }),
        body: Type.Object({
          approved: Type.Boolean(),
          comment: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({ success: Type.Boolean(), message: Type.String() }),
          404: Type.Object({ error: Type.String() }),
          410: Type.Object({ error: Type.String() }),
        },
      },
    },
    async (request, reply) => {
      const { link } = request.params;
      const { approved, comment } = request.body;

      const validation = await db
        .selectFrom("state_report_validation")
        .where("validation_link", "=", link)
        .selectAll()
        .executeTakeFirst();

      if (!validation) {
        return reply.status(404).send({ error: "Lien de validation non trouvé" });
      }

      // Check if link has expired
      if (validation.validation_link_expires_at && new Date(validation.validation_link_expires_at) < new Date()) {
        return reply.status(410).send({ error: "Le lien de validation a expiré" });
      }

      // Check if already processed
      if (validation.status !== "pending") {
        return reply.status(410).send({ error: "Cette demande de validation a déjà été traitée" });
      }

      const newStatus = approved ? "approved" : "rejected";

      // Update validation record
      await db
        .updateTable("state_report_validation")
        .set({
          status: newStatus,
          supervisor_comment: comment || null,
          validated_at: new Date().toISOString(),
        })
        .where("id", "=", validation.id)
        .execute();

      // Get user info for notifications
      const user = await db
        .selectFrom("user")
        .innerJoin("internal_user", "internal_user.userId", "user.id")
        .where("user.id", "=", validation.user_id)
        .select(["user.name", "internal_user.email", "user.id"])
        .executeTakeFirst();

      const stateReport = await db
        .selectFrom("state_report")
        .where("id", "=", validation.state_report_id)
        .selectAll()
        .executeTakeFirst();

      if (approved) {
        // Send state report to original recipients
        const service = await db
          .selectFrom("service")
          .where("id", "=", validation.service_id)
          .selectAll()
          .executeTakeFirst();

        if (stateReport && service && user) {
          // Get attachments for PDF generation
          const attachmentQuery = await db
            .selectFrom("state_report_attachment")
            .selectAll()
            .where("state_report_id", "=", validation.state_report_id)
            .execute();

          const attachmentsWithUrl = await Promise.all(
            attachmentQuery.map(async (attachment) => {
              const url = await generatePresignedUrl("attachment/" + attachment.id);
              return { ...attachment, url };
            }),
          );

          const visitedSections = await db
            .selectFrom("visited_section")
            .selectAll()
            .where("state_report_id", "=", validation.state_report_id)
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
              const url = await generatePresignedUrl("attachment/" + attachment.id);
              return { ...attachment, url };
            }),
          );

          const attachmentsUrlMap = [...attachmentsWithUrl, ...attachments].map((attachment) => ({
            id: attachment.id,
            url: attachment.url,
          }));

          // Generate PDF
          const pdf = await generateStateReportPdf({
            htmlString: validation.html_string,
            service: service as Service,
            attachmentsUrlMap,
          });

          // Send to original recipients
          await sendStateReportMail({
            recipients: validation.original_recipients,
            pdfBuffer: pdf,
            stateReport,
            user: { id: user.id, name: user.name!, serviceId: validation.service_id, email: user.email },
          });

          // Notify user of approval
          await sendValidationApprovedMail({
            userEmail: user.email,
            userName: user.name!,
            stateReport,
          });
        }
      } else {
        // Notify user of rejection
        if (user && stateReport) {
          await sendValidationRejectedMail({
            userEmail: user.email,
            userName: user.name!,
            stateReport,
            comment: comment || "",
          });
        }
      }

      return {
        success: true,
        message: approved
          ? "Le constat a été validé et envoyé aux destinataires"
          : "Le constat a été refusé. L'utilisateur a été notifié.",
      };
    },
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
