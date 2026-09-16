import { ImagesTable } from "../components/images";
import { type StateReportWithUserAndAttachments } from "../utils";
import React from "react";

export const PlanSituation = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const attachment = stateReport.attachments.find((att) => att.type === "plan_situation");

  if (!attachment) {
    if (!stateReport.planSituationOffline) return null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2 style={{ fontSize: "16pt", marginBottom: "0" }}>
          <b>Plan de situation</b>
        </h2>
        <p style={{ fontSize: "10pt", color: "gray" }}>
          Le plan de situation n'a pas pu être généré car l'appareil était hors ligne. Reconnectez-vous à internet
          puis rouvrez ce constat pour l'inclure au PDF.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16pt", marginBottom: "0" }}>
        <b>Plan de situation</b>
      </h2>
      <ImagesTable
        images={[
          {
            url: attachment.file,
            label: "Échelle 1/5000",
            attachmentId: attachment.id,
            width: attachment.width,
            height: attachment.height,
          },
        ]}
      />
    </div>
  );
};

export const PlanEdifice = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const attachment = stateReport.attachments.find((att) => att.type === "plan_edifice");

  if (!attachment) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16pt", marginBottom: "0" }}>
        <b>Plan de l'édifice</b>
      </h2>
      <ImagesTable
        images={[
          {
            url: attachment.file,
            label: attachment.label,
            attachmentId: attachment.id,
            width: attachment.width,
            height: attachment.height,
          },
        ]}
      />
    </div>
  );
};

export const VuesGenerales = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const attachments = stateReport.attachments.filter((att) => att.type === "vue_generale");

  if (attachments.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16pt", marginBottom: "0" }}>
        <b>Vues générales</b>
      </h2>
      <ImagesTable
        images={attachments.map((att) => ({
          url: att.file,
          label: att.label,
          attachmentId: att.id,
          width: att.width,
          height: att.height,
        }))}
      />
    </div>
  );
};
