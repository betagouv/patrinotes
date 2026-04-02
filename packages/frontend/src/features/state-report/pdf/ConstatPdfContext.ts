import { useContext, createContext, MutableRefObject } from "react";
import {
  StateReport,
  StateReportAlert,
  StateReportAlertAttachment,
  StateReportAttachment,
  VisitedSection,
  VisitedSectionAttachment,
} from "../../../db/AppSchema";
import { StateReportWithUser } from "../../report/ReportList";
import { useFormContext, useWatch } from "react-hook-form";
import { AlertErrors } from "../alerts/StateReportAlert.utils";
import { AlertWithAttachments, SectionWithAttachments, StateReportWithUserAndAttachments } from "@patrinotes/pdf/utils";

export type AlertWithEmail = {
  id: string;
  alert: string | null;
  email: string;
};

export const useSendConstatFormContext = () => useFormContext<SendConstatForm>();
export const useIsSendConstatFormDisabled = () => {
  const form = useSendConstatFormContext();
  return useWatch({ control: form.control, name: "isStateReportDisabled" });
};
export type SendConstatForm = {
  stateReport: StateReportWithUserAndAttachments;
  sections: SectionWithAttachments[];
  alerts: AlertWithAttachments[];
  selectedAlertIds: string[];
  recipients: string[];
  htmlString: string;
  alertErrors: AlertErrors[];
  checkErrors: () => void;
  isStateReportDisabled: boolean;
  pdfBlob: Blob | null;
};
