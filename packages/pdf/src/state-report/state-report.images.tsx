import { ImagesTable } from "../components/images";
import { type StateReportWithUserAndAttachments } from "../utils";

export const PlanSituation = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const attachment = stateReport.attachments.find((att) => att.type === "plan_situation");

  if (!attachment) return null;

  return (
    <unbreakable style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16pt", marginBottom: "0" }}>
        <b>Plan de situation</b>
      </h2>
      <ImagesTable images={[{ url: attachment.file, label: attachment.label, attachmentId: attachment.id }]} />
    </unbreakable>
  );
};

export const PlanEdifice = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const attachment = stateReport.attachments.find((att) => att.type === "plan_edifice");

  if (!attachment) return null;

  return (
    <unbreakable style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16pt", marginBottom: "0" }}>
        <b>Plan de l'édifice</b>
      </h2>
      <ImagesTable images={[{ url: attachment.file, label: attachment.label, attachmentId: attachment.id }]} />
    </unbreakable>
  );
};

export const VuesGenerales = ({ stateReport }: { stateReport: StateReportWithUserAndAttachments }) => {
  const attachments = stateReport.attachments.filter((att) => att.type === "vue_generale");

  if (attachments.length === 0) return null;

  return (
    <unbreakable style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2 style={{ fontSize: "16pt", marginBottom: "0" }}>
        <b>Vues générales</b>
      </h2>
      <ImagesTable images={attachments.map((att) => ({ url: att.file, label: att.label, attachmentId: att.id }))} />
    </unbreakable>
  );
};
