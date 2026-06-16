import { createTransport } from "nodemailer";
import { ENV } from "../envVars";
import { format } from "date-fns";
import { sentry } from "./sentry";
import { getPDFInMailName } from "@patrinotes/pdf";
import { Database } from "../db/db";
import { Selectable } from "kysely";
import { MinimalAlert } from "@patrinotes/pdf/constat";
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

export const sendStateReportMail = async ({
  recipients,
  pdfUrl,
  stateReport,
  user,
}: {
  recipients: string;
  pdfUrl: string;
  stateReport: Selectable<Database["state_report"]>;
  user: Selectable<Database["user"]>;
}) => {
  sentry?.captureMessage("Sending state report mail", { extra: { recipients, stateReport } });

  const { html, attachments } = createBordereauMailContent({ stateReport, user, pdfUrl });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: recipients,
    subject: "Constat d'état " + (stateReport?.titre_edifice ? ` : ${stateReport.titre_edifice}` : ""),
    html,
    attachments,
  });
};

export const sendReportMail = async ({
  recipients,
  pdfUrl,
  report,
}: {
  recipients: string;
  pdfUrl: string;
  report: Selectable<Database["report"]>;
}) => {
  sentry?.captureMessage("Sending report mail", { extra: { recipients, report } });

  const { html: reportHtml, attachments: reportAttachments } = wrapWithDsfrMail({
    title: "Compte-rendu UDAP" + (report?.title ? ` : ${report.title}` : ""),
    content: `
      <p>Madame, Monsieur,</p>

<p>Suite à notre rencontre du ${
      report.meetDate
        ? new Date(report.meetDate).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : ""
    } pour échanger sur votre projet ${report.title || ""}, veuillez trouver le rapport établi en cliquant sur le lien suivant : <a href="${pdfUrl}">Télécharger le compte-rendu</a> (lien valable 1 mois).</p>

<p>
<b>Rappel important :</b> Ce compte-rendu ne remplace pas la demande d’autorisation de travaux.
</p>
<p>
<b>Pour aller plus loin :</b>
</p>
<ul>
<li>Plus d’information sur la mission des UDAP : <a href="https://www.culture.gouv.fr/regions/les-unites-departementales-de-l-architecture-et-du-patrimoine-udap">Site du ministère de la culture</a></li>
<li>Entreprendre des travaux en sites protégés : <a href="https://www.culture.gouv.fr/catalogue-des-demarches-et-subventions/mes-travaux-en-site-protege">En savoir plus</a></li>
</ul>

Cordialement, ${report.redactedBy}
    `,
  });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: recipients,
    subject: "Compte-rendu UDAP" + (report?.title ? ` : ${report.title}` : ""),
    html: reportHtml,
    attachments: [...reportAttachments],
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
<p>${creatorName} vous soumet un constat d'état pour validation${title}.</p>
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

  const stateReportLink = `${ENV.FRONTEND_URL}/constat/${stateReport.id}`;

  const { html: validationResHtml, attachments: validationResAttachments } = wrapWithDsfrMail({
    title: `Constat d'état${title} — ${accepted ? "Accepté" : "Refusé"}`,
    content: `<p>Bonjour,</p>
<p>Votre <a href="${stateReportLink}">constat d'état${title}</a> a été <strong>${decision}</strong> par ${validatorEmail}.</p>
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
    sentry?.captureException(error, {
      extra: { to, alertType: alert.alert, monumentName: stateReport.titre_edifice || "" },
    });
    throw error;
  }
};
