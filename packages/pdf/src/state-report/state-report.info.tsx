import { format } from "date-fns";
import { uppercaseFirstLetter, type StateReportWithUserAndAttachments } from "../utils";

export const MainTitle = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  return (
    <h1 style={{ marginTop: 0, lineHeight: "30pt" }}>
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

export const StateReportInfos = ({
  stateReport,
  user,
}: {
  stateReport: StateReportWithUserAndAttachments;
  user: { name: string; job: string };
}) => {
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
          {user.name} ({user.job})
        </b>{" "}
        suite à la visite {isPartielle ? " partielle " : " "}
        {stateReport.date_visite ? ` du ${format(new Date(stateReport.date_visite!), "dd/MM/yyyy")}` : ""}
        {personnesPresentes ? `, en présence de ${personnesPresentes}` : ""}.
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <b>Parties visitées</b> :{" "}
          {isPartielle ? stateReport.visite_partielle_details || "" : "Visite complète de l'édifice"}
        </div>
        <div>
          <b>Détails de la visite</b> :{" "}
          {stateReport.visite_details
            ? stateReport.visite_details.split("\n").map((line, index) => <div key={index}>{line}</div>)
            : "Non renseignés"}
        </div>
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
            ? `${stateReport.proprietaire} (${stateReport.proprietaire_email})`
            : "Non renseigné"}
        </div>
        <div>
          {stateReport.proprietaire_representant
            ? `Représentant : ${stateReport.proprietaire_representant ? `${stateReport.proprietaire_representant} (${stateReport.proprietaire_representant_email})` : "Non renseigné"}`
            : ""}
        </div>
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
