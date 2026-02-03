import { Selectable } from "kysely";
import { Database } from "../../db/db";
import { MinimalAlert } from "@cr-vif/pdf/constat";
import {
  ABORDS_DE_L_EDIFICE_SECTION,
  ARCHEOLOGIE_SECTION,
  BIODIVERSITE_SECTION,
  EDIFICE_EN_PERIL_SECTION,
  OBJETS_MOBILIERS_SECTION,
  SECURITE_SECTION,
  SITE_CLASSE_OU_INSCRIT_SECTION,
} from "@cr-vif/pdf/utils";
import { AuthUser } from "../../routes/authMiddleware";
import { getServices } from "../../services/services";

const getProblemDescription = ({ alert, user }: { alert: MinimalAlert; user: AuthUser }) => {
  if (alert.alert === EDIFICE_EN_PERIL_SECTION) {
    return `des potentiels désordres susceptibles de relever de votre pouvoir de police ont été repérés par`;
  }

  if (alert.alert === ARCHEOLOGIE_SECTION) {
    return `une potentielle atteinte à un enjeu archéologique a été relevée par`;
  }

  const natureDescription = alertNatureMap[alert.alert as keyof typeof alertNatureMap] || "relatif à " + alert.alert;
  return `un potentiel problème ${natureDescription} qui pourrait relever de votre compétence, a été identifié par`;
};

const alertNatureMap = {
  [OBJETS_MOBILIERS_SECTION]: "relatif aux objets et mobiliers",
  [ABORDS_DE_L_EDIFICE_SECTION]: "relatif aux abords de l'édifice",
  [SITE_CLASSE_OU_INSCRIT_SECTION]: "relatif au site classé ou inscrit",
  [BIODIVERSITE_SECTION]: "relatif à la biodiversité",
  [SECURITE_SECTION]: "relatif à la sécurité",
};

export const createAlertEmailContent = async ({
  stateReport,
  alert,
  user,
}: {
  stateReport: Selectable<Database["state_report"]>;
  alert: MinimalAlert;
  user: AuthUser;
}) => {
  const uploadService = getServices().upload;

  const alertAttachments = alert.attachments.filter((att) => !att.is_deprecated);
  const mailAttachments = await Promise.all(
    alertAttachments.map(async (attachment) => {
      const buffer = await uploadService.getAttachment({ filePath: attachment.id });

      return {
        filename: attachment.label || "Photo",
        content: buffer,
        cid: attachment.id,
        contentType: "image/png",
      };
    }),
  );

  const html = `
    <p>Madame, Monsieur,</p>
    <p>Dans le cadre d’un constat d’état réalisé sur le monument historique <b>${uppercaseFirstLetter(stateReport.titre_edifice!)}</b>${stateReport.commune ? `, situé à ${stateReport.commune}` : ``},
  ${getProblemDescription({ alert, user })} l’agent ${getServicePronom(user.service.name!)}, en charge du contrôle scientifique et technique, ${user.name} :</p>

  ${alert.commentaires ? `<p>${alert.commentaires}</p>` : ""}
    ${
      mailAttachments.length
        ? `<p>
        ${mailAttachments.map((att) => `<img src="cid:${att.cid}" alt="${att.filename}" style="max-width: 600px; max-height: 400px; display: block; margin: 10px 0;" />`).join("")}
    </p>`
        : ""
    }

  <p>Pour toute information complémentaire, ou pour communiquer l’éventuelle suite donnée à cette alerte, merci de contacter : <br/>
  <b>${user.name} - ${user.service.name!}</b><br/>
  <b>${user.email}</b>
  </p>
  <p>Merci,</p>

  <p>Ministère de la culture</p>

  <p>(Envoi automatique depuis le service numérique Patrimoine Embarqué)</p>
  `;

  return { html, attachments: mailAttachments };
};

const getServicePronom = (serviceName: string) => {
  if (serviceName.includes("UDAP")) return `de l’${serviceName}`;
  if (serviceName.includes("SRA")) return `du ${serviceName}`;
  if (serviceName.includes("CRMH")) return `de la ${serviceName}`;
  return `du ${serviceName}`;
};

const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getAlertMailSubject = (alertType: string, monumentName: string): string => {
  return `Alerte ${alertType} - ${monumentName}`;
};
