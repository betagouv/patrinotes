import { Font } from "@react-pdf/renderer";
import { StateReportAlert } from "../../frontend/src/db/AppSchema";
import linkifyHtml from "linkify-html";
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

export const getIsAlertVisited = (alertSection: any) => {
  return !!alertSection.commentaires || !!alertSection.objet_ou_mobilier;
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
