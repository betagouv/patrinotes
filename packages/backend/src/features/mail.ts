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

  const content = createBordereauMailContent({ stateReport, user });

  return transporter.sendMail({
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

  return transporter.sendMail({
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
};

export const sendPasswordResetMail = ({ email, temporaryLink }: { email: string; temporaryLink: string }) => {
  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: email,
    subject: "Patrinotes - Réinitialisation de mot de passe",
    text: `Voici le lien de réinitialisation de votre mot de passe : ${ENV.FRONTEND_URL}/reset-password/${temporaryLink}`,
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
