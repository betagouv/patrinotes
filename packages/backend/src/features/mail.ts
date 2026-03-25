import { createTransport } from "nodemailer";
import { ENV } from "../envVars";
import { format } from "date-fns";
import { sentry } from "./sentry";
import { getPDFInMailName } from "@cr-vif/pdf";
import { Database } from "../db/db";
import { Selectable } from "kysely";
import { getStateReportMailName, MinimalAlert } from "@cr-vif/pdf/constat";
import { createBordereauMailContent } from "./bordereau";
import { getAlertMailSubject, createAlertEmailContent } from "./mail/alertMail";
import { AuthUser } from "../routes/authMiddleware";

const transporter = createTransport({
  host: ENV.EMAIL_HOST,
  port: ENV.EMAIL_PORT,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASSWORD,
  },
});

export const sendStateReportMail = async ({
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

  const content = createBordereauMailContent({ stateReport, user });

  try {
    return await transporter.sendMail({
      from: ENV.EMAIL_EMITTER,
      to: recipients,
      subject: "Constat d'état " + (stateReport?.titre_edifice ? ` : ${stateReport.titre_edifice}` : ""),
      html: content,
      attachments: [
        {
          filename: getStateReportMailName(stateReport),
          content: pdfBuffer,
        },
      ],
    });
  } catch (error) {
    sentry?.captureException(error, { extra: { recipients, stateReportId: stateReport.id } });
    throw error;
  }
};

export const sendReportMail = async ({
  recipients,
  pdfBuffer,
  report,
}: {
  recipients: string;
  pdfBuffer: Buffer;
  report: Selectable<Database["report"]>;
}) => {
  sentry?.captureMessage("Sending report mail", { extra: { recipients, report } });

  try {
    return await transporter.sendMail({
      from: ENV.EMAIL_EMITTER,
      to: recipients,
      subject: "Compte-rendu UDAP" + (report?.title ? ` : ${report.title}` : ""),
      text: `Bonjour,

Vous trouverez ci-joint le compte-rendu de notre rendez-vous.

Cordialement`,
      attachments: [
        {
          filename: getPDFInMailName(report),
          content: pdfBuffer,
        },
      ],
    });
  } catch (error) {
    sentry?.captureException(error, { extra: { recipients, reportId: report.id } });
    throw error;
  }
};

export const sendPasswordResetMail = async ({ email, temporaryLink }: { email: string; temporaryLink: string }) => {
  try {
    return await transporter.sendMail({
      from: ENV.EMAIL_EMITTER,
      to: email,
      subject: "Patrinotes - Réinitialisation de mot de passe",
      text: `Voici le lien de réinitialisation de votre mot de passe : ${ENV.FRONTEND_URL}/reset-password/${temporaryLink}`,
    });
  } catch (error) {
    sentry?.captureException(error, { extra: { email } });
    throw error;
  }
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

  try {
    const { html, attachments } = await createAlertEmailContent({ stateReport, alert, user });
    const subject = getAlertMailSubject(alert.alert!, stateReport.titre_edifice || "");

    return await transporter.sendMail({
      from: ENV.EMAIL_EMITTER,
      to,
      subject,
      html,
      attachments,
    });
  } catch (error) {
    sentry?.captureException(error, { extra: { to, alertType: alert.alert, monumentName: stateReport.titre_edifice || "" } });
    throw error;
  }
};
