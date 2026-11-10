import { Selectable } from "kysely";
import { Database } from "../../db/db";
import { getObjetAnnotationSummary } from "@patrinotes/pdf/utils";
import { AuthUser } from "../../routes/authMiddleware";
import { getServices } from "../../services/services";
import { wrapWithDsfrMail } from "./dsfrMailWrapper";
import { getProblemDescription, getServicePronom, uppercaseFirstLetter } from "./alertMail";

type MonumentAlert = Selectable<Database["monument_alert"]>;
type MonumentAlertAttachment = Selectable<Database["monument_alert_attachment"]>;

const escapeHtml = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/** "Remparts… (Chemin de ronde)" : the monument, and the unité patrimoniale when the alert is about one. */
const getMonumentLabel = (alert: MonumentAlert) =>
  [alert.titre_edifice ? uppercaseFirstLetter(alert.titre_edifice) : alert.reference_pop, alert.up_intitule]
    .filter(Boolean)
    .join(" — ");

export const getMonumentAlertTitle = (alert: MonumentAlert) => {
  const subject = alert.objet_titre ? `${alert.objet_titre} — ${getMonumentLabel(alert)}` : getMonumentLabel(alert);
  if (alert.kind === "annotation") return `Annotations de visite - ${subject}`;
  return `Alerte ${alert.alert ?? ""} - ${subject}`;
};

/** Email of an alert or annotation made from a fiche (MH, UP or objet), outside any constat. */
export const createMonumentAlertEmailContent = async ({
  alert,
  attachments,
  user,
}: {
  alert: MonumentAlert;
  attachments: MonumentAlertAttachment[];
  user: AuthUser;
}) => {
  const uploadService = getServices().upload;

  const mailAttachments = await Promise.all(
    attachments.map(async (attachment) => ({
      filename: attachment.label || "Photo",
      content: await uploadService.getAttachment({ filePath: attachment.attachment_id }),
      cid: attachment.id,
      contentType: "image/png",
    })),
  );

  const monument = `<b>${escapeHtml(getMonumentLabel(alert))}</b>${
    alert.commune ? `, situé à ${escapeHtml(alert.commune)}` : ""
  }`;
  const agent = `l’agent ${getServicePronom(user.service.name!)}, en charge du contrôle scientifique et technique, ${escapeHtml(user.name ?? "")}`;
  const objet = alert.objet_titre
    ? `<p>Objet mobilier concerné : <b>${escapeHtml(alert.objet_titre)}</b>${
        alert.objet_reference ? ` (référence Palissy ${escapeHtml(alert.objet_reference)})` : ""
      }</p>`
    : "";

  const intro =
    alert.kind === "annotation"
      ? `<p>Lors d’une visite du monument historique ${monument}, ${agent} a relevé les observations suivantes :</p>
         ${objet}
         <ul>${getObjetAnnotationSummary(alert)
           .map((line) => `<li>${escapeHtml(line)}</li>`)
           .join("")}</ul>`
      : `<p>Lors d’une visite du monument historique ${monument},
         ${getProblemDescription({ alert: { alert: alert.alert } as any, user })} ${agent} :</p>
         ${objet}
         ${alert.probleme ? `<p>Problème signalé : <b>${escapeHtml(alert.probleme)}</b></p>` : ""}`;

  const innerHtml = `
    <p>Madame, Monsieur,</p>
    ${intro}
    ${alert.commentaires ? `<p>${escapeHtml(alert.commentaires).replaceAll("\n", "<br/>")}</p>` : ""}
    ${
      mailAttachments.length
        ? `<p>${mailAttachments
            .map(
              (att) =>
                `<img src="cid:${att.cid}" alt="${escapeHtml(att.filename)}" style="max-width: 600px; max-height: 400px; display: block; margin: 10px 0;" />`,
            )
            .join("")}</p>`
        : ""
    }
    <p>Pour toute information complémentaire, ou pour communiquer l’éventuelle suite donnée à ce signalement, merci de contacter : <br/>
    <b>${escapeHtml(user.name ?? "")} - ${escapeHtml(user.service.name ?? "")}</b><br/>
    <b>${escapeHtml(user.email ?? "")}</b>
    </p>
    <p>Merci,</p>
  `;

  const { html, attachments: dsfrAttachments } = wrapWithDsfrMail({
    title: getMonumentAlertTitle(alert),
    content: innerHtml,
  });

  return { html, attachments: [...dsfrAttachments, ...mailAttachments] };
};
