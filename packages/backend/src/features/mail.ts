import { createTransport } from "nodemailer";
import { ENV } from "../envVars";
import { format } from "date-fns";
import { sentry } from "./sentry";
import { getPDFInMailName } from "@cr-vif/pdf";
import { Database } from "../db/db";
import { Selectable } from "kysely";
import { getStateReportMailName } from "@cr-vif/pdf/constat";
import { createBordereauMailContent } from "./bordereau";

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
    subject: "CR VIF - Réinitialisation de mot de passe",
    text: `Voici le lien de réinitialisation de votre mot de passe : ${ENV.FRONTEND_URL}/reset-password/${temporaryLink}`,
  });
};
