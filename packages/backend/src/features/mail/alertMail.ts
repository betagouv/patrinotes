import { Selectable } from "kysely";
import { Database } from "../../db/db";

type AlertMailData = {
  monumentName: string;
  commune: string;
  department: string;
  alertType: string;
  comments: string | null;
  agentName: string;
  agentEmail: string;
  serviceName: string;
  photos: { url: string; label?: string | null }[];
};

type AlertVariant = "generic" | "security" | "archaeology";

const getAlertVariant = (alertType: string): AlertVariant => {
  const normalizedType = alertType.toLowerCase();
  if (normalizedType === "sécurité" || normalizedType === "securite") {
    return "security";
  }
  if (normalizedType === "archéologie" || normalizedType === "archeologie" || normalizedType === "sra") {
    return "archaeology";
  }
  return "generic";
};

const createPhotoSection = (photos: AlertMailData["photos"]): string => {
  if (!photos.length) return "";

  const photoHtml = photos
    .map(
      (photo) => `
      <div style="margin: 10px 0;">
        <img src="${photo.url}" alt="${photo.label || "Photo"}" style="max-width: 600px; max-height: 400px; display: block;" />
        ${photo.label ? `<p style="margin: 5px 0; font-style: italic;">${photo.label}</p>` : ""}
      </div>
    `,
    )
    .join("");

  return `<div style="margin: 20px 0;">${photoHtml}</div>`;
};

const createGenericContent = (data: AlertMailData): string => {
  const photoSection = createPhotoSection(data.photos);

  return `<p>Madame, Monsieur,</p>

<p>Dans le cadre d'un constat d'état réalisé sur le monument historique <strong>${data.monumentName}</strong>, situé à <strong>${data.commune} / ${data.department}</strong>, un potentiel problème <strong>relatif à ${data.alertType}</strong> qui pourrait relever de votre compétence, a été identifié par l'agent du <strong>${data.serviceName}</strong>, en charge du contrôle scientifique et technique, <strong>${data.agentName}</strong> :</p>

<div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #000091;">
${data.comments ? `<p>${data.comments}</p>` : ""}
${photoSection}
</div>

<p>Pour toute information complémentaire, ou pour communiquer l'éventuelle suite donnée à cette alerte, merci de contacter :</p>

<p><strong>${data.agentName}</strong> – <strong>${data.serviceName}</strong></p>
<p><strong>${data.agentEmail}</strong></p>

<p>Merci,</p>

<p>Ministère de la Culture</p>

<p style="font-style: italic; color: #666;">(Envoi automatique depuis le service numérique Patrimoine Embarqué)</p>`;
};

const createSecurityContent = (data: AlertMailData): string => {
  const photoSection = createPhotoSection(data.photos);

  return `<p>Madame, Monsieur,</p>

<p>Dans le cadre d'un constat d'état réalisé sur le monument historique <strong>${data.monumentName}</strong>, situé à <strong>${data.commune} / ${data.department}</strong>, des <strong>potentiels désordres susceptibles de relever de votre pouvoir de police</strong> ont été repérés par l'agent du <strong>${data.serviceName}</strong>, en charge du contrôle scientifique et technique, <strong>${data.agentName}</strong> :</p>

<div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #000091;">
${data.comments ? `<p>${data.comments}</p>` : ""}
${photoSection}
</div>

<p>Pour toute information complémentaire, ou pour communiquer l'éventuelle suite donnée à cette alerte, merci de contacter :</p>

<p><strong>${data.agentName}</strong> – <strong>${data.serviceName}</strong></p>
<p><strong>${data.agentEmail}</strong></p>

<p>Merci,</p>

<p>Ministère de la Culture</p>

<p style="font-style: italic; color: #666;">(Envoi automatique depuis le service numérique Patrimoine Embarqué)</p>`;
};

const createArchaeologyContent = (data: AlertMailData): string => {
  const photoSection = createPhotoSection(data.photos);

  return `<p>Madame, Monsieur,</p>

<p>Lors d'un constat d'état réalisé sur <strong>${data.monumentName}</strong>, situé à <strong>${data.commune} / ${data.department}</strong>, <strong>une potentielle atteinte à un enjeu archéologique</strong> a été relevée par l'agent du <strong>${data.serviceName}</strong>, en charge du contrôle scientifique et technique, <strong>${data.agentName}</strong> :</p>

<div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #000091;">
${data.comments ? `<p>${data.comments}</p>` : ""}
${photoSection}
</div>

<p>Pour toute information complémentaire, vous pouvez contacter l'agent en charge du constat d'état :</p>

<p><strong>${data.agentName}</strong> – <strong>${data.serviceName}</strong></p>
<p><strong>${data.agentEmail}</strong></p>

<p>Cordialement,</p>

<p>Ministère de la Culture</p>

<p style="font-style: italic; color: #666;">(Envoi automatique depuis le service numérique Patrimoine Embarqué)</p>`;
};

export const createAlertMailContent = (data: AlertMailData): string => {
  const variant = getAlertVariant(data.alertType);

  switch (variant) {
    case "security":
      return createSecurityContent(data);
    case "archaeology":
      return createArchaeologyContent(data);
    default:
      return createGenericContent(data);
  }
};

export const getAlertMailSubject = (alertType: string, monumentName: string): string => {
  return `Alerte Patrimoine : ${alertType} - ${monumentName}`;
};

export type { AlertMailData };
