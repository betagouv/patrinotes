import type { StateReportWithUserAndAttachments, SectionWithAttachments } from "../utils";
import React from "react";
import { Multiline } from "./state-report.details";

export const ConstatGeneral = ({
  stateReport,
  sections,
  version,
}: {
  stateReport: StateReportWithUserAndAttachments;
  sections: SectionWithAttachments[];
  version: number;
}) => {
  if (version === 1) {
    return (
      <div>
        <h2>État général</h2>
        <span>
          Le monument est évalué{" "}
          {etatGeneralMap[stateReport.etat_general as keyof typeof etatGeneralMap] || "Non renseigné"} pour
          {stateReport.proportion_dans_cet_etat} des parties protégées de l'édifice
        </span>
        <ul>
          {defaultSections?.map((section) => {
            const sectionData = sections.find((s) => s.section === section);

            return (
              <li style={{ marginBottom: 0, padding: 0 }}>
                <b>{section}</b> :{" "}
                {!sectionData
                  ? "sans commentaire"
                  : `${sectionData.proportion_dans_cet_etat} des parties protégées sont évaluées ${etatGeneralMap[sectionData.etat_general as keyof typeof etatGeneralMap] || "non renseigné"}.`}
              </li>
            );
          })}
        </ul>
        {stateReport.etat_commentaires ? (
          <p>
            <Multiline text={stateReport.etat_commentaires} />
          </p>
        ) : null}
      </div>
    );
  }

  if (version === 2) {
    if (!stateReport.etat_general) {
      return null;
    }

    let intro = "Le monument est " + etatGeneralMapV2[stateReport.etat_general as keyof typeof etatGeneralMapV2];
    if (stateReport.taux_degradation) {
      intro += `, avec un taux de dégradation estimé à ${stateReport.taux_degradation}% du volume global.`;
    }

    return (
      <div>
        <h2>Constat général</h2>
        <span>{intro}</span>
        {stateReport.vitesse_degradation ? (
          <>
            <br />
            <span>La vitesse de dégradation semble être {stateReport.vitesse_degradation.toLocaleLowerCase()}.</span>
          </>
        ) : null}
        <ul>
          {defaultSections?.map((section) => {
            const sectionData = sections.find((s) => s.section === section);

            return (
              <li style={{ marginBottom: 0, padding: 0 }}>
                <b>{section}</b> :{" "}
                {!sectionData
                  ? "sans commentaire"
                  : constatDetailleMapV2[sectionData.niveau_degradation as keyof typeof constatDetailleMapV2] ||
                    "non renseigné"}
              </li>
            );
          })}
        </ul>
        {stateReport.etat_commentaires ? (
          <p>
            <Multiline text={stateReport.etat_commentaires} />
          </p>
        ) : null}
      </div>
    );
  }
};

export const etatGeneralMap = {
  Bon: "en bon état",
  Moyen: "dans un état moyen",
  Mauvais: "dans un mauvais état",
  Péril: "en péril",
};

export const etatGeneralMapV2 = {
  Bon: "en bon état",
  Moyen: "en moyen état",
  Mauvais: "en mauvais état",
  Péril: "en péril",
};

export const constatDetailleMapV2 = {
  Léger: "dégradations légères",
  Moyen: "dégradations moyennes",
  Important: "dégradations importantes",
  Péril: "dégradations mettant cette partie en péril",
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

export const sectionNiveauDegradationMapV2 = {
  Léger:
    "Cet ensemble a des dégradations légères : quelques désordres mineurs sont observés, sans impact sur la structure ou l’intégrité de ces éléments.",
  Moyen: "Cet ensemble a des dégradations moyennes : des désordres modérés sont constatés et à surveiller.",
  Important:
    "Cet ensemble a des dégradations importantes : les désordres observés risquent d’affecter la durabilité ou la sécurité des éléments concernés.",
  Péril:
    "Cet ensemble est en péril : les désordres constatés menacent directement la stabilité ou la sécurité des éléments concernés.",
};
