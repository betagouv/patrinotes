import { deserializePreconisations } from "../stateReport";
import type { StateReportWithUserAndAttachments } from "../utils";
import { Multiline } from "./state-report.details";

export const PreconisationsGenerales = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const preconisations = deserializePreconisations(stateReport.preconisations);

  if (preconisations.length === 0) return null;

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Préconisations générales</h2>
      <ul>
        {preconisations.map((item, index) => (
          <li key={index}>
            <b>{item.preconisation}</b> : {item.commentaire ? <Multiline text={item.commentaire} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * 
 const generatePreconisations = (rawValue: string | null) => {
   if (!rawValue) return null;
   const preconisations = deserializePreconisations(rawValue);
   if (preconisations.length === 0) return null;
 
   return `<ul>
       ${preconisations
         .map(
           (item) =>
             `<li>
               <b>${item.preconisation}</b>${item.commentaire ? ` : ${item.commentaire.replaceAll("\n", "<br />")}` : ""}</li>`,
         )
         .join("<br/>")}
     
     </ul>`;
 };
 

 
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
        </div>
        </div>`
          : ""
      }
 */
