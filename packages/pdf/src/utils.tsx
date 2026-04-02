import { Font } from "@react-pdf/renderer";
import {
  StateReport,
  StateReportAlert,
  StateReportAlertAttachment,
  StateReportAttachment,
  VisitedSection,
  VisitedSectionAttachment,
} from "../../frontend/src/db/AppSchema";
import linkifyHtml from "linkify-html";
import { MinimalAlert } from "./stateReport";

export const initFonts = (folder: string = "") => {
  Font.register({
    family: "Marianne",
    fonts: [
      {
        src: `${folder}/fonts/Marianne-Regular.ttf`,
        fontStyle: "normal",
        fontWeight: "normal",
      },
      { src: `${folder}/fonts/Marianne-Bold.ttf`, fontStyle: "normal", fontWeight: "bold" },
      {
        src: `${folder}/fonts/Marianne-RegularItalic.ttf`,
        fontStyle: "italic",
        fontWeight: "normal",
      },
      {
        src: `${folder}/fonts/Marianne-BoldItalic.ttf`,
        fontStyle: "italic",
        fontWeight: "bold",
      },
    ],
  });
};

const minifyHtml = (htmlString: string) => {
  return htmlString.split("\n").join("").split("  ").join("");
};
const breakUrl = (url: string) => url.replace(/([/\-._])/g, "$1\u200B");

export const addSIfPlural = (count: number) => (count > 1 ? "s" : "");

export const processHtml = (htmlString: string) => {
  return minifyHtml(
    linkifyHtml(htmlString, {
      target: "_blank",
      format: (value) => breakUrl(value),
    }),
  );
};

export const serializeMandatoryEmails = (emails: { service: string; email: string }[]): string => {
  return emails.map((e) => `${e.service}:${e.email}`).join(";");
};

export const deserializeMandatoryEmails = (data: string): { service: string; email: string }[] => {
  if (!data) return [];
  return data.split(";").map((entry) => {
    const [service, email] = entry.split(":");
    return { service: service!, email: email ?? "" };
  });
};

export const getIsAlertVisited = (alert: MinimalAlert): boolean => {
  // OBJETS_MOBILIERS_SECTION
  const isObjetsMobiliers = alert.alert === OBJETS_MOBILIERS_SECTION;

  const hasAttachments = !!alert.attachments && alert.attachments.length > 0;
  const hasDescription = !!alert.commentaires && alert.commentaires.trim() !== "";

  if (isObjetsMobiliers) {
    const hasProblem = !!alert.probleme;
    const hasObjet = !!alert.objet_ou_mobilier_name;

    return hasProblem || hasObjet || hasAttachments || hasDescription;
  }

  return Boolean(hasAttachments || hasDescription);
};

export const getIsSectionVisited = (section: any) => {
  return (section?.etat_general && section?.proportion_dans_cet_etat) || section?.attachments?.length;
};

export const OBJETS_MOBILIERS_SECTION = "Objets et mobiliers";
export const EDIFICE_EN_PERIL_SECTION = "Édifice en péril";
export const ABORDS_DE_L_EDIFICE_SECTION = "Abords de l'édifice";
export const ARCHEOLOGIE_SECTION = "Archéologie";
export const SITE_CLASSE_OU_INSCRIT_SECTION = "Site classé ou inscrit";
export const BIODIVERSITE_SECTION = "Biodiversité";
export const SECURITE_SECTION = "Sécurité";

export type AlertWithAttachments = Omit<StateReportAlert, "should_send"> & {
  attachments: (StateReportAlertAttachment & { file: string })[];
  should_send: Booleanish;
};

export type Booleanish = boolean | number | null | undefined;

export type StateReportWithUserAndAttachments = StateReport & {
  attachments: (StateReportAttachment & { file: string })[];
  createdByName: string | null;
};

export type SectionWithAttachments = VisitedSection & {
  attachments: (VisitedSectionAttachment & { file: string })[];
};
