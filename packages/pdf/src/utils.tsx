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
import { format } from "date-fns";
import { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

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

export const buildHtml = (element: ReactNode): string => {
  const str = renderToStaticMarkup(element);
  return processHtml(str);
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

const hasLocalisationPins = (raw: unknown): boolean => {
  if (!raw || typeof raw !== "string") return false;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
};

export const getIsSectionVisited = (section: any) => {
  return (
    (section?.etat_general && section?.proportion_dans_cet_etat) ||
    section?.niveau_degradation ||
    section?.attachments?.length ||
    hasLocalisationPins(section?.localisation_pins)
  );
};

export function cleanString(str: string): string {
  return str
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]/g, "") // Remove special characters (keep letters, numbers, hyphens)
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export const OBJETS_MOBILIERS_SECTION = "Objets et mobiliers";
export const EDIFICE_EN_PERIL_SECTION = "Édifice en péril";
export const ABORDS_DE_L_EDIFICE_SECTION = "Abords de l'édifice";
export const ARCHEOLOGIE_SECTION = "Archéologie";
export const SITE_CLASSE_OU_INSCRIT_SECTION = "Site classé ou inscrit";
export const BIODIVERSITE_SECTION = "Biodiversité";
export const SECURITE_SECTION = "Sécurité";

export type AlertWithAttachments = Omit<StateReportAlert, "should_send"> & {
  attachments: (StateReportAlertAttachment & { file: string; width?: number | null; height?: number | null })[];
  should_send: Booleanish;
};

export type Booleanish = boolean | number | null | undefined;

export type StateReportWithUserAndAttachments = StateReport & {
  attachments: (StateReportAttachment & { file: string; width?: number | null; height?: number | null })[];
  createdByName: string | null;
  createdByJob?: string | null;
  /** why the plan de situation could not be generated for the PDF */
  planSituationFailure?: "offline" | "unavailable" | null;
};

export type SectionWithAttachments = VisitedSection & {
  attachments: (VisitedSectionAttachment & { file: string; width?: number | null; height?: number | null })[];
};

export const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// --- Unités patrimoniales (MH complexes) ---

/** "Monument | UP" for a constat on an unité patrimoniale, the monument title otherwise. */
export const getStateReportTitle = (stateReport: { titre_edifice?: string | null; up_intitule?: string | null }) =>
  [stateReport.titre_edifice, stateReport.up_intitule].filter(Boolean).join(" | ");

const upProtectionLabels: Record<string, string> = {
  classement: "Classé",
  inscription: "Inscrit",
  "classement partiel": "Classé partiellement",
  "inscription partielle": "Inscrit partiellement",
  "classement et inscription": "Classé et inscrit",
};

/** Dataspace protection values ("classement", "inscription"…) as displayed labels ("Classé", "Inscrit"…). */
export const formatUpProtection = (protection?: string | null) => {
  if (!protection) return null;
  return upProtectionLabels[protection.toLowerCase()] ?? uppercaseFirstLetter(protection);
};

export const formatUpNiveau = (niveau?: string | null) => (niveau ? uppercaseFirstLetter(niveau) : null);

/** Problems an alert on an objet mobilier can report (stored as these labels, as in constats). */
export const OBJET_PROBLEMES = ["Objet absent", "Objet en insécurité", "Dégradation importante"] as const;

/** Annotation de visite of an objet mobilier: stored values and their labels. */
export const OBJET_ANNOTATION_OPTIONS = {
  presence: [
    { value: "oui", label: "Oui", summary: "Objet présent au sein de l’édifice" },
    { value: "non", label: "Non", summary: "Objet absent de l’édifice" },
    { value: "non_localise", label: "Non localisé", summary: "Objet non localisé" },
  ],
  etat: [
    { value: "bon", label: "Bon", summary: "Objet en bon état" },
    { value: "moyen", label: "Moyen", summary: "Objet en état moyen" },
    { value: "mauvais", label: "Mauvais", summary: "Objet en mauvais état" },
    { value: "peril", label: "Péril", summary: "Objet en péril" },
  ],
  securite: [
    { value: "oui", label: "Oui", summary: "Objet en sécurité" },
    { value: "non", label: "Non", summary: "Objet en insécurité" },
  ],
} as const;

/** "Objet présent au sein de l’édifice", "Objet en insécurité"… for the filled answers of an annotation. */
export const getObjetAnnotationSummary = (annotation: {
  presence?: string | null;
  etat?: string | null;
  securite?: string | null;
}): string[] =>
  (["presence", "securite", "etat"] as const)
    .map((key) => OBJET_ANNOTATION_OPTIONS[key].find((option) => option.value === annotation[key])?.summary)
    .filter((summary): summary is NonNullable<typeof summary> => !!summary);
