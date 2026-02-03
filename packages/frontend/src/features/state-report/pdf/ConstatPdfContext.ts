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
import { useFormContext } from "react-hook-form";
import { AlertErrors } from "../alerts/StateReportAlert.utils";

export type AlertWithEmail = {
  id: string;
  alert: string | null;
  email: string;
};

export type StateReportWithUserAndAttachments = StateReportWithUser & {
  attachments: (StateReportAttachment & { file: string })[];
};

export type SectionWithAttachments = VisitedSection & {
  attachments: (VisitedSectionAttachment & { file: string })[];
};

export type AlertWithAttachments = StateReportAlert & {
  attachments: (StateReportAlertAttachment & { file: string })[];
  shouldSend: boolean;
};

export const useSendConstatFormContext = () => useFormContext<SendConstatForm>();

export type SendConstatForm = {
  stateReport: StateReportWithUserAndAttachments;
  sections: SectionWithAttachments[];
  alerts: AlertWithAttachments[];
  recipients: string[];
  htmlString: string;
  alertErrors: AlertErrors[];
};
