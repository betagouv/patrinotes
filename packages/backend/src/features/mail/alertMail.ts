import { Selectable } from "kysely";
import { Database } from "../../db/db";
import { getStateReportTitle, MinimalAlert } from "@patrinotes/pdf/constat";
import { wrapWithDsfrMail } from "./dsfrMailWrapper";
import { escapeHtml, escapeMultiline } from "./escapeHtml";
import {
  ABORDS_DE_L_EDIFICE_SECTION,
  ARCHEOLOGIE_SECTION,
  BIODIVERSITE_SECTION,
  EDIFICE_EN_PERIL_SECTION,
  OBJETS_MOBILIERS_SECTION,
  SECURITE_SECTION,
  SITE_CLASSE_OU_INSCRIT_SECTION,
} from "@patrinotes/pdf/utils";
import { AuthUser } from "../../routes/authMiddleware";
import { buildAlertPhotos } from "./alertPhotos";

export const getProblemDescription = ({ alert, user }: { alert: MinimalAlert; user: AuthUser }) => {
  if (alert.alert === EDIFICE_EN_PERIL_SECTION) {
    return `des potentiels désordres susceptibles de relever de votre pouvoir de police ont été repérés par`;
  }

  if (alert.alert === ARCHEOLOGIE_SECTION) {
    return `une potentielle atteinte à un enjeu archéologique a été relevée par`;
  }

  const natureDescription = alertNatureMap[alert.alert as keyof typeof alertNatureMap] || "relatif à " + escapeHtml(alert.alert);
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
  to,
}: {
  stateReport: Selectable<Database["state_report"]>;
  alert: MinimalAlert;
  user: AuthUser;
  /** recipients, recorded on the photo links when the photos are too heavy to be attached */
  to: string;
}) => {
  const alertAttachments = alert.attachments.filter((att) => !att.is_deprecated);
  const photos = await buildAlertPhotos({
    photos: alertAttachments.map((att) => ({ id: att.id, attachment_id: att.attachment_id!, label: att.label })),
    createdBy: user.id,
    sentTo: to,
  });

  const innerHtml = `
    <p>Madame, Monsieur,</p>
    <p>Dans le cadre d’un constat d’état réalisé sur le monument historique <b>${getStateReportTitle(stateReport) ? escapeHtml(uppercaseFirstLetter(getStateReportTitle(stateReport))) : ""}</b>${stateReport.commune ? `, situé à ${escapeHtml(stateReport.commune)}` : ``},
  ${getProblemDescription({ alert, user })} l’agent ${escapeHtml(getServicePronom(user.service.name!))}, en charge du contrôle scientifique et technique, ${escapeHtml(user.name)} :</p>

  ${alert.commentaires ? `<p>${escapeMultiline(alert.commentaires)}</p>` : ""}
    ${photos.html}

  <p>Pour toute information complémentaire, ou pour communiquer l’éventuelle suite donnée à cette alerte, merci de contacter : <br/>
  <b>${escapeHtml(user.name)} - ${escapeHtml(user.service.name)}</b><br/>
  <b>${escapeHtml(user.email)}</b>
  </p>
  <p>Merci,</p>
  `;

  const { html, attachments: dsfrAttachments } = wrapWithDsfrMail({
    title: `Alerte ${alert.alert}${getStateReportTitle(stateReport) ? ` — ${getStateReportTitle(stateReport)}` : ""}`,
    content: innerHtml,
  });

  return { html, attachments: [...dsfrAttachments, ...photos.attachments] };
};

export const getServicePronom = (serviceName: string) => {
  if (serviceName.includes("UDAP")) return `de l’${serviceName}`;
  if (serviceName.includes("SRA")) return `du ${serviceName}`;
  if (serviceName.includes("CRMH")) return `de la ${serviceName}`;
  return `du ${serviceName}`;
};

export const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getAlertMailSubject = (alertType: string, monumentName: string): string => {
  return `Alerte ${alertType} - ${monumentName}`;
};
