import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import {
  Clause_v2,
  Report,
  Service,
  ServiceInstructeurs,
  StateReport,
  StateReportAlert,
} from "../../frontend/src/db/AppSchema";
import {
  ABORDS_DE_L_EDIFICE_SECTION,
  ARCHEOLOGIE_SECTION,
  AlertWithAttachments,
  BIODIVERSITE_SECTION,
  EDIFICE_EN_PERIL_SECTION,
  OBJETS_MOBILIERS_SECTION,
  SECURITE_SECTION,
  SITE_CLASSE_OU_INSCRIT_SECTION,
  SectionWithAttachments,
  StateReportWithUserAndAttachments,
  buildHtml,
  deserializeMandatoryEmails,
  getIsAlertVisited,
  getIsSectionVisited,
  processHtml,
} from "./utils";
import { MarianneHeader } from "./components/MarianneHeader";
import { Pagination } from "./components/Pagination";
import { Html } from "react-pdf-html";
import React from "react";
import { groupBy } from "pastable";
import { format } from "date-fns";
import { PlanEdifice, PlanSituation, VuesGenerales } from "./state-report/state-report.images";
import { ConstatGeneral } from "./state-report/state-report.general";
import { ConstatDetaille } from "./state-report/state-report.details";
import { PreconisationsGenerales } from "./state-report/state-report.preconisations";
import { Alerts } from "./state-report/state-report.alerts";

export const StateReportPDFDocument = ({ service, htmlString, images }: StateReportPDFDocumentProps) => {
  return (
    <Document onRender={console.log}>
      <Page
        size="A4"
        style={{
          fontFamily: "Marianne",
          paddingBottom: 65,
          paddingTop: 72,
        }}
        wrap={true}
      >
        <MarianneHeader marianneUrl={images.marianne} />
        <Html
          stylesheet={stateReportExtraCss}
          collapse
          renderers={{
            tr: ({ children, ...props }) => (
              <View {...props} wrap={false}>
                {children}
              </View>
            ),
            unbreakable: (props) => <View {...props} wrap={false} />,
            debug: (props) => <View {...props} debug />,
          }}
          style={{
            fontSize: "10px",
            paddingLeft: "32px",
            paddingRight: "32px",
            lineHeight: "1.5",
            whiteSpace: "pre-line",
          }}
        >{`
        <html>
          <body>
            <style>
              body {
                font-family: Marianne;
                margin-top: -20px;
              }

              strong {
                font-weight: bold;
              }

              u {
                text-underline-offset: 8px !important;
              }

              em {
                font-style: italic;
              }

              strong em span {
                font-weight: bold;
                font-style: italic;
              }

              em strong span {
                font-weight: bold;
              }

              strong em {
                font-style: italic;
                font-weight: bold;
                }

              em strong {
              font-style: italic;
                font-weight: bold;
              }

              h2 {
                font-size: 16pt;
                margin-bottom: 24px;
                margin-top: 0; 
              }

                
              .marianne-footer-img {
                width: 50px;
              }

              .header {
                display: flex;
                margin-top: -16px;
                flex-direction: row;
                width: 100%;
                align-items: flex-start;
                justify-content: space-between;
                text-align: right;
                font-size: 18px;
                margin-bottom: 32px;

              }

              .marianne {
                margin-top: 13px;
              }

              .marianne-text {
                text-align: left;
                font-weight: bold;
                font-size: 12px;
                margin-top: 4px;
                margin-bottom: 4px;
                text-transform: uppercase;
              }


              .right-texts {
                text-align: right;
                margin-top: 13px;
                display: flex;
                align-items: flex-end;
                flex-direction: column;
                justify-content: flex-start;
                font-size: 12px;
                max-width: 290px;
                
              }

              .right-texts > div:first-child {
                font-weight: bold;
                margin-bottom: 8px;
              }
              .right-texts > div:nth-child(2) {
              }

                
              hr {
                border: 0;
                border-top: 1px solid #EDEDED;
              }


            </style>
            <div class="header">
              <div class="marianne">

                <div class="marianne-text">
                  ${transformHeaderText(service.marianne_text)}
                </div>
                <img class="marianne-footer-img" src="${images.marianneFooter}" />

              </div>

              <div class="right-texts">
                <div>
                  ${transformHeaderText(service.drac_text)}
                </div>
                <div>
                  ${transformHeaderText(service.service_text)}
                </div>
              </div>
            </div>

            <div class="content">
              ${htmlString}
            </div>
            
          </body>
        </html>`}</Html>
        <Pagination />
        <View
          style={{
            marginTop: "32px",
            paddingLeft: 40,
            paddingRight: 40,
            fontSize: "8px",
          }}
          wrap={false}
        >
          <Text style={{ fontSize: "8px" }}>
            Ce constat d'état est effectué dans le cadre du contrôle scientifique et technique défini au livre VI, titre
            II, chapitre Ier du Code du patrimoine (partie législative et réglementaire et notamment l'article R621-63),
            et dans la circulaire du 1er décembre 2009 relative au contrôle scientifique et technique des services de
            l'État sur la conservation des monuments historiques classés ou inscrits. Les termes utilisés se fondent sur
            le glossaire des termes relatifs aux interventions sur les monuments historiques (déduit de la norme EN
            15898).
          </Text>

          <Link
            style={{}}
            src="https://www.culture.gouv.fr/Thematiques/monuments-sites/Interventions-demarches/Travaux-sur-un-objet-un-immeuble-un-espace/Intervenir-sur-un-immeuble-inscrit"
          >
            <Text style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", flexGrow: 1, flexBasis: 0 }}>
              {link?.match(/\w+|\W+/g)?.map((seg, i) => (
                <Text key={i}>{seg}</Text>
              ))}
            </Text>
          </Link>
        </View>
      </Page>
    </Document>
  );
};
const link =
  "https://www.culture.gouv.fr/Thematiques/monuments-sites/Interventions-demarches/Travaux-sur-un-objet-un-immeuble-un-espace/Intervenir-sur-un-immeuble-inscrit";

export type MinimalAlert = Omit<
  AlertWithAttachments,
  "service_id" | "state_report_id" | "show_in_report" | "shouldSend"
> & {
  show_in_report: any;
};

export const transformHeaderText = (text: string | null | undefined) => {
  if (!text) return "";

  const cleanString = text.normalize("NFC").replaceAll("\n", " ").replaceAll("  ", " ").trim();
  const uppercaseString = cleanString.toUpperCase();

  if (uppercaseString.startsWith("PRÉFET") || uppercaseString.startsWith("PRÉFÈTE")) {
    return addBreaksAfterWords(cleanString, ["Préfet", "Préfète", "région"]);
  }

  if (
    uppercaseString.startsWith("DIRECTION DES AFFAIRES CULTURELLES") ||
    uppercaseString.startsWith("DIRECTION RÉGIONALE DES AFFAIRES CULTURELLES")
  ) {
    return addBreaksAfterWords(cleanString, ["culturelles"]);
  }

  if (uppercaseString.startsWith("UNITÉ DÉPARTEMENTALE DE")) {
    return addBreaksAfterWords(cleanString, ["DÉPARTEMENTALE DE", "PATRIMOINE"]);
  }

  if (uppercaseString.startsWith("CONSERVATION RÉGIONALE DES MONUMENTS HISTORIQUES")) {
    return addBreaksAfterWords(cleanString, ["MONUMENTS"]);
  }

  return cleanString;
};

const addBreaksAfterWords = (str: string, words: string[]) => {
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(\\s?)`, "gi");
  const newStr = str.replace(pattern, "$1<br/>");

  return newStr.replaceAll("<br/> ", "<br/>");
};
import { MainTitle, StateReportInfos, StateReportProtection } from "./state-report/state-report.info";

export const getStateReportHtmlString = ({
  stateReport,
  visitedSections: sections,
  alerts,
  user,
}: {
  stateReport: StateReportWithUserAndAttachments;
  visitedSections: SectionWithAttachments[];
  alerts?: MinimalAlert[];
  user: { name: string; job: string };
}) => {
  const stateReportVersion = stateReport.version || 1;

  const visitedSections = sections.filter(getIsSectionVisited);

  const filteredAlerts = (alerts || []).filter((alert) => alert.show_in_report).filter(getIsAlertVisited);

  // accessibilité
  // h1 pour les deux premières lignes
  // h2 pour les titres de sections
  // alt text sur les images
  // constat détaillé : le commentaire doit être juste après ce qu'il commente

  return buildHtml(
    <div style={{ fontSize: "10px" }}>
      <MainTitle stateReport={stateReport} />
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <StateReportInfos stateReport={stateReport} user={user} />
        <hr />
        <StateReportProtection stateReport={stateReport} />
        <PlanSituation stateReport={stateReport} />
        <PlanEdifice stateReport={stateReport} />
        <VuesGenerales stateReport={stateReport} />
        <ConstatGeneral stateReport={stateReport} sections={visitedSections} version={stateReportVersion} />
        <ConstatDetaille stateReport={stateReport} sections={visitedSections} version={stateReportVersion} />
        <PreconisationsGenerales stateReport={stateReport} />
        <Alerts alerts={filteredAlerts} />
      </div>
      <div style={{ marginTop: "32px" }}>
        <b id="date">
          Document créé le{" "}
          {new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </b>
      </div>
    </div>,
  );
};

export const defaultSections = [
  "Fondations, sols, sous-sols",
  "Maçonnerie, structure",
  "Parements, enduits",
  "Couverture, charpente",
  "Menuiserie, métallerie, vitraux",
  "Cloisonnement, revêtements, décors, objets, mobiliers",
  "Équipements, sécurité, accessibilité",
  "Environnements, abords, voirie et réseaux",
];

// format: option[:commentaire]/option[:commentaire]/...
export const deserializePreconisations = (
  rawValue: string | null,
): { preconisation: string; commentaire?: string }[] => {
  if (!rawValue) return [];

  return rawValue.split("/").map((part) => {
    const [preconisation, commentaire] = part.split(":");
    return {
      preconisation: decodeURIComponent(preconisation ?? ""),
      commentaire: commentaire ? decodeURIComponent(commentaire) : undefined,
    };
  });
};

export const serializePreconisations = (value: { preconisation: string; commentaire?: string }[]): string | null => {
  if (value.length === 0) return null;
  return value
    .map((item) =>
      item.commentaire
        ? `${encodeURIComponent(item.preconisation)}:${encodeURIComponent(item.commentaire)}`
        : encodeURIComponent(item.preconisation),
    )
    .join("/");
};

export const stateReportExtraCss = {
  ".ProseMirror-focused .column": {
    border: "1px gray dashed",
    borderRadius: "8px",
  },
  "li > p": {
    margin: 0,
  },
  table: {
    borderCollapse: "collapse",
    tableLayout: "fixed",
    width: "100%",
    margin: "12px 0",
    overflow: "hidden",
  },
  "table td, table th": {
    minWidth: "1em",
    verticalAlign: "top",
    boxSizing: "border-box",
    position: "relative",
  },
  "table th": {
    fontWeight: "bold",
    textAlign: "left",
    backgroundColor: "#f1f3f5",
  },
  "table .selectedCell:after": {
    zIndex: "2",
    position: "absolute",
    content: '""',
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    background: "rgba(200, 200, 255, 0.4)",
    pointerEvents: "none",
  },
  // add margin right to columns except last one
  "tr td": {
    paddingRight: "16px",
  },
  "tr td:last-child": {
    paddingRight: "0",
  },
  "table tr": {
    marginBottom: "16px",
  },
  "table tr:last-child": {
    marginBottom: "0px",
  },
  "table img": {},
};

export type StateReportPDFDocumentProps = {
  htmlString: string;
  service: Service;
  images: Images;
  attachmentsUrlMap?: Record<string, string>;
};

export type PdfImage = {
  url: string;
  label?: string;
};

export type ReportPDFDocumentProps = {
  htmlString: string;
  service: Service;
  images: Images;
  pictures?: PdfImage[];
};

type Images = {
  marianne: string;
  marianneFooter: string;
};

export const getStateReportMailName = ({ titre_edifice }: { titre_edifice?: string | null }) => {
  return `constat-d-etat${titre_edifice ? `-${cleanString(titre_edifice || "")}` : ""}_${format(new Date(), "ddMMyyyy")}.pdf`;
};

function cleanString(str: string): string {
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

export const alertSectionStaticData = [
  { title: EDIFICE_EN_PERIL_SECTION, services: ["CRMH"] },
  { title: ABORDS_DE_L_EDIFICE_SECTION, services: ["UDAP"] },
  { title: OBJETS_MOBILIERS_SECTION, services: ["CAOA", "CRMH"] },
  { title: ARCHEOLOGIE_SECTION, services: ["SRA"] },
  { title: SITE_CLASSE_OU_INSCRIT_SECTION, services: ["DREAL"] },
  { title: BIODIVERSITE_SECTION, services: ["OFB"] },
  { title: SECURITE_SECTION, services: ["Mairie"] },
];
