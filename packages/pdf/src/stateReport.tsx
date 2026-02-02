import { Document, Link, Page, Text, View } from "@react-pdf/renderer";
import {
  Clause_v2,
  Report,
  Service,
  ServiceInstructeurs,
  StateReport,
  StateReportAlert,
} from "../../frontend/src/db/AppSchema";
import { MarianneHeader, Pagination, initFonts, minifyHtml } from "./utils";
import { Html } from "react-pdf-html";
import { StateReportWithUser } from "../../frontend/src/features/report/ReportList";
import React from "react";

import { format } from "date-fns";
import type {
  SectionWithAttachments,
  StateReportWithUserAndAttachments,
} from "../../frontend/src/features/state-report/pdf/ConstatPdfContext";

export const StateReportPDFDocument = ({ service, htmlString, images }: StateReportPDFDocumentProps) => {
  return (
    <Document onRender={console.log}>
      <Page
        size="A4"
        style={{
          fontFamily: "Marianne",
          paddingBottom: 56,
          paddingTop: 72,
        }}
        wrap={true}
      >
        <MarianneHeader marianneUrl={images.marianne} />
        <Html
          stylesheet={stateReportExtraCss}
          collapse
          renderers={{
            unbreakable: ({ children, ...props }) => (
              <View {...props} wrap={true}>
                {children}
              </View>
            ),
            tr: ({ children, ...props }) => (
              <View {...props} wrap={false}>
                {children}
              </View>
            ),
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
                
              }

              .right-texts > div:first-child {
                font-weight: bold;
                margin-bottom: 8px;
              }

                
              hr {
                border: 0;
                border-top: 1px solid #EDEDED;
              }


            </style>
            <div class="header">
              <div class="marianne">

                <div class="marianne-text">
                  <strong>
                ${service.marianne_text
                  ?.split("\n")
                  .map((s) => s.trim())
                  .join("<br/>")}
                  </strong>
                </div>
                <img class="marianne-footer-img" src="${images.marianneFooter}" />

              </div>

              <div class="right-texts">
                <div>
                      ${service.drac_text
                        ?.split("\n")
                        .map((s) => s.trim())
                        .join("<br/>")}
                </div>
                <div>
                    ${service.service_text
                      ?.split("\n")
                      .map((s) => s.trim())
                      .join("<br/>")}
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

export const getStateReportHtmlString = ({
  stateReport,
  visitedSections: sections,
  alerts,
}: {
  stateReport: StateReportWithUserAndAttachments;
  visitedSections: SectionWithAttachments[];
  alerts?: (StateReportAlert & { email: string })[];
}) => {
  const isPartielle = stateReport.nature_visite?.toLocaleLowerCase().includes("partielle");

  const planSituationAttachment = stateReport.attachments.find((att) => stateReport.plan_situation === att.id);
  const planEdificeAttachment = stateReport.attachments.find((att) => stateReport.plan_edifice === att.id);
  const vuesGeneralesIds = stateReport.vue_generale ? stateReport.vue_generale.split(";") : [];
  const vuesGeneralesAttachments = stateReport.attachments.filter((att) => vuesGeneralesIds.includes(att.id));

  const preconisationsHtml = generatePreconisations(stateReport.preconisations);

  const visitedSections = sections.filter((s) => {
    return !!s.etat_general || !!s.proportion_dans_cet_etat;
  });

  // accessibilité
  // h1 pour les deux premières lignes
  // h2 pour les titres de sections
  // alt text sur les images
  // constat détaillé : le commentaire doit être juste après ce qu'il commente
  return minifyHtml(`
    <p>  
      <span style="font-size: 20pt">Constat d'état du monument historique</span><br/><br/>
      <span style="font-size: 20pt"><b>${stateReport.titre_edifice}</b></span><br/><br/>
    </p>
    <p>
      Constat dressé par <b>${stateReport.createdByName}</b> suite à la visite  ${isPartielle ? "partielle" : ""}
      ${stateReport.date_visite ? ` du ${format(new Date(stateReport.date_visite!), "dd/MM/yyyy")}` : ""}.

      <br/>
      <br/>

      <b>Parties visitées</b> : ${isPartielle ? stateReport.visite_partielle_details || "" : "Visite complète de l'édifice"}<br/>
      <b>Adresse</b> : ${stateReport.adresse || "N/A"}<br/>
      <b>Référence cadastrale</b> : ${stateReport.reference_cadastrale || "N/A"}<br/>
      <b>Propriétaire</b> : ${stateReport.proprietaire ? `${stateReport.proprietaire} (${stateReport.proprietaire_email})` : "N/A"}<br/>
      ${stateReport.proprietaire_representant ? `Représentant : ${stateReport.proprietaire_representant ? `${stateReport.proprietaire_representant} (${stateReport.proprietaire_representant_email})` : "N/A"}` : ""}
    </p>

    <p><span style="font-size: 16pt"><b>Protection de l'édifice</b></span></p>    
      ${uppercaseFirstLetter(stateReport.nature_protection || "N/A")}<br/><br/>Parties protégées : ${stateReport.parties_protegees || "N/A"}

      <hr />

      ${generateImagesTable([
        planSituationAttachment
          ? {
              title: "Plan de situation",
              url: planSituationAttachment.file!,
              attachmentId: planSituationAttachment.id,
              label: planSituationAttachment.label ?? undefined,
            }
          : undefined,
        planEdificeAttachment
          ? {
              title: "Plan de l'édifice",
              url: planEdificeAttachment.file!,
              attachmentId: planEdificeAttachment.id,
              label: planEdificeAttachment.label ?? undefined,
            }
          : undefined,
      ])}

      ${generateImagesTable(
        vuesGeneralesAttachments.map((attachment, index) => ({
          title: index === 0 ? "Vue générale de l'édifice" : "",
          url: attachment.file!,
          label: attachment.label ?? undefined,
          attachmentId: attachment.id,
        })),
      )}

        ${planSituationAttachment || planEdificeAttachment || vuesGeneralesAttachments?.length ? "<hr />" : ""}
        <p><span style="font-size: 16pt"><b>État général</b></span></p>
        <span>Le monument est évalué ${etatGeneralMap[stateReport.etat_general as keyof typeof etatGeneralMap] || "N/A"} pour ${stateReport.proportion_dans_cet_etat} des parties protégées de l'édifice</span>
        <ul>
          ${defaultSections
            ?.map((section) => {
              const sectionData = visitedSections.find((s) => s.section === section);

              return `
              <li style="margin-bottom: 0; padding: 0;">
                <b>${section}</b> : ${
                  !sectionData
                    ? "partie non visitée"
                    : ` ${sectionData.proportion_dans_cet_etat} des parties protégées sont évaluées ${etatGeneralMap[sectionData.etat_general as keyof typeof etatGeneralMap] || "N/A"}.`
                }
              </li>
            `;
            })
            .join("")}
        </ul>

      <hr />

        ${visitedSections?.length ? `<p><span style="font-size: 16pt"><b>Constat détaillé</b></span></p>` : ""}
        ${visitedSections
          ?.map(
            (section) => `
              <ul>
                <li>
                  <b>${section.section} : </b><br/> ${section.proportion_dans_cet_etat} des parties protégées sont évaluées ${etatGeneralMap[section.etat_general as keyof typeof etatGeneralMap] || "N/A"}.
                </li>
              </ul>
                <b>Commentaires : </b> ${section.commentaires ? `${section.commentaires}` : "Aucun"}

              ${generateImagesTable(
                section.attachments.map((attachment) => ({
                  title: "",
                  url: attachment.file!,
                  label: attachment.label ?? undefined,
                  attachmentId: attachment.id,
                })),
              )}
          `,
          )
          .join("")}
              <br/>


        ${visitedSections?.length ? "<hr />" : ""}

      ${
        preconisationsHtml
          ? `<div id="preconisations">
        <h2>Préconisations générales</h2>
        <b>
          Suite à la visite, il est préconisé d'entreprendre les travaux suivants sur l'édifice :
        </b>
        <br/>
        <div>
          ${preconisationsHtml}
        </div>`
          : ""
      }

      ${
        alerts?.length
          ? `<div id="alertes">
        <h2>Alertes</h2>
        <b>
          Suite à la visite, ${alerts.length} ont été signalées et transmises aux services concernés :
        </b>
        <br/>
        ${generateAlertsTable(alerts)}
        </div>`
          : ""
      }

      </div>

      <br/><br/><br/><br/><br/>

      <b id="date">
        Document créé le ${new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}.
      </b>

  `);
};

const generatePreconisations = (rawValue: string | null) => {
  if (!rawValue) return null;
  const preconisations = deserializePreconisations(rawValue);
  if (preconisations.length === 0) return null;

  return `<ul>
      ${preconisations
        .map(
          (item) =>
            `<li>
              <b>${item.preconisation}</b>${item.commentaire ? ` : ${item.commentaire}` : ""}</li>`,
        )
        .join("<br/>")}
    
    </ul>`;
};

const footerText = `Ce constat d'état est effectué dans le cadre du contrôle scientifique et technique défini au livre VI, titre II, chapitre Ier du Code du patrimoine (partie législative et réglementaire et notamment l'article R621-63), et dans la circulaire du 1er décembre 2009 relative au contrôle scientifique et technique des services de l'État sur la conservation des monuments historiques classés ou inscrits. Les termes utilisés se fondent sur le glossaire des termes relatifs aux interventions sur les monuments historiques (déduit de la norme EN 15898).
<br/><br/>
Pour toute information complémentaire, vous pouvez vous référer à :
<a href="https://www.culture.gouv.fr/Thematiques/monuments-sites/Interventions-demarches/Travaux-sur-un-objet-un-immeuble-un-espace/Intervenir-sur-un-immeuble-inscrit">https://www.culture.gouv.fr/Thematiques/monuments-sites/Interventions-demarches/Travaux-sur-un-objet-un-immeuble-un-espace/Intervenir-sur-un-immeuble-inscrit</a>`;

const etatGeneralMap = {
  Bon: "en bon état",
  Moyen: "dans un état moyen",
  Mauvais: "dans un mauvais état",
  Péril: "en péril",
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

const preconisationsMap = {
  "Étude diagnostique": "la réalisation d'une étude diagnostique approfondie",
  "Mesures d'urgence": "des mesures d'urgence",
  "Travaux d'entretien": "des travaux d'entretien",
  "Travaux de restauration": "des travaux de restauration",
  "Travaux de réparation": "des travaux de réparation",
};

const uppercaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

type Image = { url: string; label?: string; title?: string; attachmentId: string };

const generateImagesTable = (images: (Image | undefined)[]) => {
  const rows = [];
  for (let i = 0; i < images.length; i += 2) {
    const firstImage = images[i];
    const secondImage = images[i + 1];

    rows.push(`<div class="column-block">
      ${generateImageCell(firstImage)}
      ${generateImageCell(secondImage)}
    </div><div></div>
    `);
  }
  return `${rows.join("")}`;
};

const generateImageCell = (image: Image | undefined) => {
  if (!image) return '<div class="column"></div>';
  return `<div class="column" >
      ${
        image.title
          ? `<p>
          <span style="font-size: 16pt"><strong>${image.title}</strong></span>
          </p>`
          : "<p></p>"
      }
      <img src="${image.url}" data-attachment-id="${image.attachmentId}" style="width: 100%;  margin-bottom: 30px;" />
      <div style="position:relative">
        <div style="position:absolute; bottom:0; left:0; right:0; top:-30px;text-align:center; font-size:8pt; color:gray;">
        ${image.label ? `<span>${image.label}</span>` : ""}

        </div>
      </div>
  </div>`;
};

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

const generateAlertsTable = (alerts: (StateReportAlert & { email: string })[]) => {
  return `<ul>
    ${alerts
      .filter(a => !!a.alert && !!a.email)
      .map(
        (a: StateReportAlert & { email: string }) => {
          const section = alertSections.find((section) => section.title === a.alert);
          const withPronom = [(section?.pronom ?? "à"), (a.nom_service_contacte), ];

          return `
            <li>
              <b>${a.alert}</b><br/>
              <i>Alerte transmise par courriel ${alertSections.find(section => section.title === a.alert)?.pronom ?? "à"} ${a.email || "N/A"}</i>
            </li>
          `},
      )
      .join("")}
  </ul>
  `;
};

export const alertSections = [
  { title: "Edifice en péril", details: "CRMH", pronom: "au" },
  { title: "Abords de l'édifice", details: "UDAP", pronom: "à l'" },
  { title: "Objets et mobiliers", details: "CAOA", pronom: "au" },
  { title: "Archéologie", details: "SRA", pronom: "à la" },
  { title: "Site classé ou inscrit", details: "DREAL", pronom: "à la" },
  { title: "Biodiversité", details: "OFB", pronom: "à l'" },
  { title: "Sécurité", details: "Mairie", pronom: "à la" },
];

export const stateReportExtraCss = {
  ".column-block": {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "24px",
  },

  ".column": {
    width: "48%",
  },

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

export const getStateReportMailName = (stateReport: { titre_edifice?: string | null }) => {
  return `constat-d-etat-${cleanString(stateReport.titre_edifice || "")}.pdf`;
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
