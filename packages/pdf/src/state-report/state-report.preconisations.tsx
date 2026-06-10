import { deserializePreconisations } from "../stateReport";
import type { StateReportWithUserAndAttachments } from "../utils";
import { Multiline } from "./state-report.details";
import React from "react";

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
