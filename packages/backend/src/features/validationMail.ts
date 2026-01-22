import { createTransport } from "nodemailer";
import { ENV } from "../envVars";
import { sentry } from "./sentry";
import { Selectable } from "kysely";
import { Database } from "../db/db";

const transporter = createTransport({
  host: ENV.EMAIL_HOST,
  port: ENV.EMAIL_PORT,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASSWORD,
  },
});

export const sendValidationRequestMail = ({
  supervisorEmail,
  validationLink,
  stateReport,
  userName,
}: {
  supervisorEmail: string;
  validationLink: string;
  stateReport: Selectable<Database["state_report"]>;
  userName: string;
}) => {
  sentry?.captureMessage("Sending validation request mail", { extra: { supervisorEmail, stateReport } });

  const fullLink = `${ENV.FRONTEND_URL}/validation/${validationLink}`;
  const dateVisite = stateReport.date_visite
    ? new Date(stateReport.date_visite).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Non spécifiée";

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: supervisorEmail,
    subject: `Validation requise - Constat d'état${stateReport.titre_edifice ? ` : ${stateReport.titre_edifice}` : ""}`,
    html: `<p>Bonjour,</p>

<p>${userName} vous demande de valider le constat d'état suivant avant son envoi aux destinataires :</p>

<table style="margin: 20px 0; border-collapse: collapse;">
  <tr>
    <td style="padding: 8px 16px 8px 0; font-weight: bold;">Édifice :</td>
    <td style="padding: 8px 0;">${stateReport.titre_edifice || "Non spécifié"}</td>
  </tr>
  <tr>
    <td style="padding: 8px 16px 8px 0; font-weight: bold;">Commune :</td>
    <td style="padding: 8px 0;">${stateReport.commune || "Non spécifiée"}</td>
  </tr>
  <tr>
    <td style="padding: 8px 16px 8px 0; font-weight: bold;">Date de visite :</td>
    <td style="padding: 8px 0;">${dateVisite}</td>
  </tr>
</table>

<p>Pour consulter le document et donner votre décision, cliquez sur le lien suivant :</p>

<p><a href="${fullLink}" style="display: inline-block; padding: 12px 24px; background-color: #000091; color: white; text-decoration: none; border-radius: 4px;">Consulter et valider le constat</a></p>

<p style="color: #666; font-size: 14px;">Ce lien est valide pendant 30 jours.</p>

<p>Cordialement,<br/>
L'équipe Compte Rendu VIF</p>`,
  });
};

export const sendValidationApprovedMail = ({
  userEmail,
  userName,
  stateReport,
}: {
  userEmail: string;
  userName: string;
  stateReport: Selectable<Database["state_report"]>;
}) => {
  sentry?.captureMessage("Sending validation approved mail", { extra: { userEmail, stateReport } });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: userEmail,
    subject: `Constat validé et envoyé${stateReport.titre_edifice ? ` : ${stateReport.titre_edifice}` : ""}`,
    html: `<p>Bonjour ${userName},</p>

<p>Bonne nouvelle ! Votre constat d'état a été validé par votre responsable hiérarchique et a été envoyé aux destinataires.</p>

<table style="margin: 20px 0; border-collapse: collapse;">
  <tr>
    <td style="padding: 8px 16px 8px 0; font-weight: bold;">Édifice :</td>
    <td style="padding: 8px 0;">${stateReport.titre_edifice || "Non spécifié"}</td>
  </tr>
  <tr>
    <td style="padding: 8px 16px 8px 0; font-weight: bold;">Commune :</td>
    <td style="padding: 8px 0;">${stateReport.commune || "Non spécifiée"}</td>
  </tr>
</table>

<p>Cordialement,<br/>
L'équipe Compte Rendu VIF</p>`,
  });
};

export const sendValidationRejectedMail = ({
  userEmail,
  userName,
  stateReport,
  comment,
}: {
  userEmail: string;
  userName: string;
  stateReport: Selectable<Database["state_report"]>;
  comment: string;
}) => {
  sentry?.captureMessage("Sending validation rejected mail", { extra: { userEmail, stateReport, comment } });

  return transporter.sendMail({
    from: ENV.EMAIL_EMITTER,
    to: userEmail,
    subject: `Constat refusé${stateReport.titre_edifice ? ` : ${stateReport.titre_edifice}` : ""}`,
    html: `<p>Bonjour ${userName},</p>

<p>Votre constat d'état a été refusé par votre responsable hiérarchique.</p>

<table style="margin: 20px 0; border-collapse: collapse;">
  <tr>
    <td style="padding: 8px 16px 8px 0; font-weight: bold;">Édifice :</td>
    <td style="padding: 8px 0;">${stateReport.titre_edifice || "Non spécifié"}</td>
  </tr>
  <tr>
    <td style="padding: 8px 16px 8px 0; font-weight: bold;">Commune :</td>
    <td style="padding: 8px 0;">${stateReport.commune || "Non spécifiée"}</td>
  </tr>
</table>

${
  comment
    ? `<p><strong>Commentaire du responsable :</strong></p>
<blockquote style="margin: 16px 0; padding: 12px 16px; background-color: #f5f5f5; border-left: 4px solid #000091;">
${comment}
</blockquote>`
    : ""
}

<p>Vous pouvez modifier votre constat et le soumettre à nouveau pour validation.</p>

<p>Cordialement,<br/>
L'équipe Compte Rendu VIF</p>`,
  });
};
