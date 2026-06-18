import { deserializePreconisations } from "../stateReport";
import type { SectionWithAttachments, StateReportWithUserAndAttachments } from "../utils";
import { etatGeneralMap, sectionNiveauDegradationMapV2 } from "./state-report.general";
import { ImagesTable } from "../components/images";
import React from "react";

export const Multiline = ({ text }: { text: string }) => (
  <>
    {text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {line}
      </React.Fragment>
    ))}
  </>
);

export const ConstatDetaille = ({
  stateReport,
  sections,
  version,
}: {
  stateReport: StateReportWithUserAndAttachments;
  sections: SectionWithAttachments[];
  version: number;
}) => {
  if (!sections || sections.length === 0) {
    return null;
  }

  if (version === 1) {
    return (
      <div>
        <h2>Constat détaillé</h2>
        <ul>
          {sections.map((section) => {
            return (
              <li style={{ marginBottom: 0, padding: 0 }}>
                <b>{section.section} : </b>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    {section.proportion_dans_cet_etat} des parties protégées sont évaluées{" "}
                    {etatGeneralMap[section.etat_general as keyof typeof etatGeneralMap] || "Non renseigné"}.
                  </div>

                  {section.attachments?.length ? (
                    <div>
                      <ImagesTable
                        images={section.attachments.map((attachment) => ({
                          url: attachment.file!,
                          label: attachment.label ?? undefined,
                          attachmentId: attachment.id,
                        }))}
                      />
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (version === 2) {
    return (
      <div>
        <h2>Constat détaillé</h2>
        <ul>
          {sections.map((section) => {
            return (
              <li style={{ marginBottom: 0, padding: 0 }}>
                <b>{section.section} : </b>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div>
                    {sectionNiveauDegradationMapV2[
                      section.niveau_degradation as keyof typeof sectionNiveauDegradationMapV2
                    ] || "Non renseigné"}
                  </div>

                  <div>
                    <u>Commentaires</u> :{" "}
                    <div>{section.commentaires ? <Multiline text={section.commentaires} /> : "Aucun"}</div>
                  </div>

                  {section.preconisations ? (
                    <div>
                      <u>Préconisations de travaux</u> :{" "}
                      {deserializePreconisations(section.preconisations)?.map((p) => (
                        <div>
                          - {p.preconisation} :{" "}
                          {p.commentaire ? <Multiline text={p.commentaire} /> : "Aucun commentaire"}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {section.attachments?.length ? (
                    <div>
                      <ImagesTable
                        images={section.attachments.map((attachment) => ({
                          url: attachment.file!,
                          label: attachment.label ?? undefined,
                          attachmentId: attachment.id,
                        }))}
                      />
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};

/**
 * 
 * 
        ${visitedSections?.length ? `<p><span style="font-size: 16pt"><b>Constat détaillé</b></span></p>` : ""}
        ${visitedSections?.map((section) => generateSection(section, stateReportVersion)).join("")}
        <br/>


const generateSection = (section: SectionWithAttachments, version: number) => {
  if (version === 1) {
    return `
      <ul>
        <li>
          <b>${section.section} : </b><br/> ${section.proportion_dans_cet_etat} des parties protégées sont évaluées ${etatGeneralMap[section.etat_general as keyof typeof etatGeneralMap] || "Non renseigné"}.
        </li>
      </ul>
        <b>Commentaires : </b> ${section.commentaires ? `${section.commentaires.replaceAll("\n", "<br />")}` : "Aucun"}

      ${generateImagesTable(
        section.attachments.map((attachment) => ({
          title: "",
          url: attachment.file!,
          label: attachment.label ?? undefined,
          attachmentId: attachment.id,
        })),
      )}
    `;
  }

  if (version === 2) {
    const preconisations = deserializePreconisations(section.preconisations);

    return `
      <ul>
        <li>
          <b>${section.section} : </b><br/> ${sectionNiveauDegradationMapV2[section.niveau_degradation as keyof typeof sectionNiveauDegradationMapV2] || "Non renseigné"}
          <br/>
          <br/>
          <u>Commentaires</u> : ${section.commentaires ? `${section.commentaires.replaceAll("\n", "<br />")}` : "Aucun"}
          
          ${
            preconisations
              ? `<br/>
          <br/><u>Préconisations de travaux</u> : <br/>`
              : ""
          }
          ${
            preconisations
              ? preconisations
                  .map(
                    (p) => `
            - ${p.preconisation} : ${p.commentaire ? p.commentaire.replaceAll("\n", "<br />") : "Aucun commentaire"} 
          `,
                  )
                  .join("<br/>")
              : null
          }
        </li>
      </ul>


      ${generateImagesTable(
        section.attachments.map((attachment) => ({
          title: "",
          url: attachment.file!,
          label: attachment.label ?? undefined,
          attachmentId: attachment.id,
        })),
      )}
    `;
  }
};
 */
