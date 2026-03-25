import { useFormContext, useWatch } from "react-hook-form";
import { StateReport } from "../../db/AppSchema";
import z from "zod";

export type StateReportFormType = Pretty<StateReport>;
export const useStateReportFormContext = () => useFormContext<StateReportFormType>();

type Pretty<T> = {
  [K in keyof T]: T[K];
} & {};

export const stateReportStepSchema = z.enum([
  "informations",
  "documents",
  "contexte-visite",
  "constat-general",
  "constat-detaille",
]);

export type StateReportStep = z.infer<typeof stateReportStepSchema>;

export const useIsStateReportDisabled = () => {
  const form = useStateReportFormContext();
  const [hasAttachment, validationStatus] = useWatch({
    control: form.control,
    name: ["attachment_id", "validation_status"],
  });
  return getIsStateReportDisabled({ attachment_id: hasAttachment, validation_status: validationStatus });
};

export const getIsStateReportDisabled = (stateReport: {
  attachment_id: string | null;
  validation_status: string | null;
}) => {
  return !!stateReport.attachment_id && stateReport.validation_status !== "declined";
};
