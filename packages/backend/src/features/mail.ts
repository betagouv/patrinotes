import { createTransport } from "nodemailer";
import { ENV } from "../envVars";
import { format } from "date-fns";
import { sentry } from "./sentry";
import { getPDFInMailName } from "@patrinotes/pdf";
import { Database } from "../db/db";
import { Selectable } from "kysely";
import { getStateReportMailName, MinimalAlert } from "@patrinotes/pdf/constat";
import { createBordereauMailContent } from "./bordereau";
import { getAlertMailSubject, createAlertEmailContent } from "./mail/alertMail";
import { wrapWithDsfrMail } from "./mail/dsfrMailWrapper";
import { AuthUser } from "../routes/authMiddleware";

const transporter = createTransport({
  host: ENV.EMAIL_HOST,
  port: ENV.EMAIL_PORT,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASSWORD,
  },
});

export const sendStateReportMail = ({
  recipients,
  pdfBuffer,
  stateReport,
  user,
}: {
  recipients: string;
  pdfBuffer: Buffer;
  stateReport: Selectable<Database["state_report"]>;
  user: Selectable<Database["user"]>;
}) => {
  sentry?.captureMessage("Sending state report mail", { extra: { recipients, stateReport } });

  const { html, attachments } = createBordereauMailContent({ stateReport, user });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: recipients,
    subject: "Constat d'état " + (stateReport?.titre_edifice ? ` : ${stateReport.titre_edifice}` : ""),
    html,
    attachments: [
      ...attachments,
      {
        filename: getStateReportMailName(stateReport),
        content: pdfBuffer,
      },
    ],
  });
};

export const sendReportMail = ({
  recipients,
  pdfBuffer,
  report,
}: {
  recipients: string;
  pdfBuffer: Buffer;
  report: Selectable<Database["report"]>;
}) => {
  sentry?.captureMessage("Sending report mail", { extra: { recipients, report } });

  const { html: reportHtml, attachments: reportAttachments } = wrapWithDsfrMail({
    title: "Compte-rendu UDAP" + (report?.title ? ` : ${report.title}` : ""),
    content: `<p>Bonjour,</p><p>Vous trouverez ci-joint le compte-rendu de notre rendez-vous.</p><p>Cordialement</p>`,
  });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: recipients,
    subject: "Compte-rendu UDAP" + (report?.title ? ` : ${report.title}` : ""),
    html: reportHtml,
    attachments: [
      ...reportAttachments,
      {
        filename: getPDFInMailName(report),
        content: pdfBuffer,
      },
    ],
  });
};

export const sendPasswordResetMail = ({ email, temporaryLink }: { email: string; temporaryLink: string }) => {
  const resetLink = `${ENV.FRONTEND_URL}/reset-password/${temporaryLink}`;
  const { html: resetHtml, attachments: resetAttachments } = wrapWithDsfrMail({
    title: "Réinitialisation de mot de passe",
    content: `<p>Voici le lien de réinitialisation de votre mot de passe :</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: email,
    subject: "Patrinotes - Réinitialisation de mot de passe",
    html: resetHtml,
    attachments: resetAttachments,
  });
};

export const sendValidationRequestMail = ({
  validatorEmail,
  stateReport,
  validationToken,
  creatorName,
}: {
  validatorEmail: string;
  stateReport: Selectable<Database["state_report"]>;
  validationToken: string;
  creatorName: string;
}) => {
  const link = `${ENV.FRONTEND_URL}/constat-validation/${validationToken}`;
  const title = stateReport.titre_edifice ? ` : ${stateReport.titre_edifice}` : "";

  const { html: validationReqHtml, attachments: validationReqAttachments } = wrapWithDsfrMail({
    title: `Validation requise — Constat d'état${title}`,
    content: `<p>Bonjour,</p>
<p>${creatorName} vous soumet un constat d'état${title} pour validation.</p>
<p>Veuillez consulter le document et l'accepter ou le refuser en cliquant sur le lien ci-dessous :</p>
<p><a href="${link}">${link}</a></p>
<p>Ce lien est valable 7 jours.</p>`,
  });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: validatorEmail,
    subject: `[Validation requise] Constat d'état${title}`,
    html: validationReqHtml,
    attachments: validationReqAttachments,
  });
};

export const sendValidationResultMail = ({
  creatorEmail,
  stateReport,
  accepted,
  comment,
  validatorEmail,
}: {
  creatorEmail: string;
  stateReport: Selectable<Database["state_report"]>;
  accepted: boolean;
  comment?: string | null;
  validatorEmail: string;
}) => {
  const title = stateReport.titre_edifice ? ` : ${stateReport.titre_edifice}` : "";
  const decision = accepted ? "accepté" : "refusé";

  const { html: validationResHtml, attachments: validationResAttachments } = wrapWithDsfrMail({
    title: `Constat d'état${title} — ${accepted ? "Accepté" : "Refusé"}`,
    content: `<p>Bonjour,</p>
<p>Votre constat d'état${title} a été <strong>${decision}</strong> par ${validatorEmail}.</p>
${comment ? `<p>Commentaire : ${comment}</p>` : ""}`,
  });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: creatorEmail,
    subject: `Constat d'état${title} — ${accepted ? "Accepté" : "Refusé"} par le validateur`,
    html: validationResHtml,
    attachments: validationResAttachments,
  });
};

export const sendAlertEmail = async ({
  to,
  stateReport,
  alert,
  user,
}: {
  to: string;
  stateReport: Selectable<Database["state_report"]>;
  alert: MinimalAlert;
  user: AuthUser;
}) => {
  sentry?.captureMessage("Sending alert mail", {
    extra: { to, alertType: alert.alert, monumentName: stateReport.titre_edifice || "" },
  });

  const { html, attachments } = await createAlertEmailContent({ stateReport, alert, user });
  const subject = getAlertMailSubject(alert.alert!, stateReport.titre_edifice || "");

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to,
    subject,
    html,
    attachments,
  });
};
