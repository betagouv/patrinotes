import { format } from "date-fns";
import { uppercaseFirstLetter, type StateReportWithUserAndAttachments } from "../utils";
import React from "react";
import { Multiline } from "./state-report.details";

export const MainTitle = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  return (
    <>
      <MainTitleHeading stateReport={stateReport} />
      {stateReport.titre_edifice ? (
        <div style={{ marginBottom: "24px" }}>
          <MonumentReferences stateReport={stateReport} />
          <UpSummary stateReport={stateReport} />
        </div>
      ) : null}
    </>
  );
};

const MainTitleHeading = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  return (
    <h1 style={{ marginTop: 0, lineHeight: "30pt", marginBottom: "0" }}>
      <span style={{ fontSize: "20pt", fontWeight: "normal" }}>Constat d'état du monument historique</span>
      <br />
      {stateReport.titre_edifice ? (
        <span style={{ fontSize: "20pt" }}>
          <b>{stateReport.titre_edifice}</b>
        </span>
      ) : null}
    </h1>
  );
};

/** Lines of the references block: own line height, the h1's 30pt would space them out when they wrap. */
const referenceLineStyle = { fontSize: "10pt", lineHeight: "14pt" } as const;

/** « Référence POP : … - identifiant AgrÉgée : … » of the monument, below the main title. */
export const MonumentReferences = ({
  stateReport,
}: {
  stateReport: Pick<StateReportWithUserAndAttachments, "reference_pop" | "up_monument_identifiant">;
}) => (
  <div style={{ ...referenceLineStyle, marginTop: "8px" }}>
    Référence POP : {stateReport.reference_pop || "Non renseignée"}
    {stateReport.up_monument_identifiant ? ` - identifiant AgrÉgée : ${stateReport.up_monument_identifiant}` : ""}
  </div>
);

/**
 * Unité patrimoniale of a "MH complexe" constat (nothing for a constat on the whole monument):
 * « Unité patrimoniale : Façades - identifiant AgrÉgée : … » then its path from the monument, in brackets.
 */
const UpSummary = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  if (!stateReport.up_id) return null;
  let parents: string[] = [];
  try {
    parents = JSON.parse(stateReport.up_chemin || "[]").map((c: { intitule: string }) => c.intitule);
  } catch {}
  const chemin = [stateReport.titre_edifice, ...parents].filter(Boolean);

  return (
    <div style={{ ...referenceLineStyle, marginTop: "14pt" }}>
      <div>
        <b>Unité patrimoniale : {stateReport.up_intitule}</b>
        {stateReport.up_identifiant ? ` - identifiant AgrÉgée : ${stateReport.up_identifiant}` : ""}
      </div>
      {chemin.length ? <div>({chemin.join(" > ")})</div> : null}
    </div>
  );
};

export const StateReportInfos = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const authorName = stateReport.redacted_by || stateReport.createdByName || "";
  // the creator's job only applies if they are the one credited as author
  const authorJob = authorName === stateReport.createdByName ? stateReport.createdByJob : null;

  const isPartielle = stateReport.nature_visite?.toLocaleLowerCase().includes("partielle");

  const personnesPresentes = stateReport.personnes_presentes
    ?.split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .join(", ");

  const address = [
    stateReport.adresse,
    stateReport.commune,
    stateReport.code_postal ? `(${stateReport.code_postal})` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        Constat dressé par{" "}
        <b>
          {authorName}
          {authorJob ? ` (${authorJob})` : ""}
        </b>{" "}
        suite à la visite {isPartielle ? "partielle " : ""}
        {stateReport.date_visite ? (
          <>
            du <b>{format(new Date(stateReport.date_visite!), "dd/MM/yyyy")}</b>
          </>
        ) : null}
        {personnesPresentes ? `, en présence de ${personnesPresentes}` : ""}.
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <b>Parties visitées :</b>{" "}
          {isPartielle ? stateReport.visite_partielle_details || "" : "Visite complète de l'édifice"}
        </div>
        {stateReport.visite_details ? (
          <div>
            <b>Détails de la visite</b> : <Multiline text={stateReport.visite_details} />
          </div>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <b>Adresse</b> : {address || "Non renseignée"}
        </div>
        <div>
          <b>Référence cadastrale</b> : {stateReport.reference_cadastrale || "Non renseignée"}
        </div>
        <div>
          <b>Propriétaire</b> :{" "}
          {stateReport.proprietaire
            ? `${stateReport.proprietaire} ${stateReport.proprietaire_email ? `(${stateReport.proprietaire_email})` : ""}`
            : "Non renseigné"}
        </div>
        {stateReport.proprietaire_representant ? (
          <div>
            <b>Représentant</b> :{" "}
            {stateReport.proprietaire_representant
              ? `${stateReport.proprietaire_representant} ${stateReport.proprietaire_representant_email ? `(${stateReport.proprietaire_representant_email})` : ""}`
              : "Non renseigné"}
            `
          </div>
        ) : null}
      </div>
    </section>
  );
};

export const StateReportProtection = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  return (
    <div>
      <h2>Protection de l'édifice</h2>
      <div style={{ marginBottom: "16px" }}>
        {uppercaseFirstLetter(stateReport.nature_protection || "Non renseignée")}
      </div>
      <div>Parties protégées : {stateReport.parties_protegees || "Non renseignées"}</div>
    </div>
  );
};
