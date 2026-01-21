import { useContext, createContext, MutableRefObject } from "react";
import { StateReport, StateReportAttachment, VisitedSection, VisitedSectionAttachment } from "../../../db/AppSchema";
import { StateReportWithUser } from "../../report/ReportList";

export type AlertWithEmail = {
  id: string;
  alert: string | null;
  email: string;
};

type ConstatPdfContextType = {
  stateReport?: StateReportWithUserAndAttachments | null;
  sections?: SectionWithAttachments[];
  isLoading: boolean;
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  localHtmlString: string | null;
  setLocalHtmlString: (htmlString: string) => void;
  scrollToAlertRef?: MutableRefObject<((alertId: string) => void) | undefined>;
  selectedAlerts: AlertWithEmail[];
  setSelectedAlerts: (alerts: AlertWithEmail[]) => void;
};

export type SectionWithAttachments = VisitedSection & {
  attachments: (VisitedSectionAttachment & { file: string })[];
};

export type StateReportWithUserAndAttachments = StateReportWithUser & {
  attachments: (StateReportAttachment & { file: string })[];
};

export const ConstatPdfContext = createContext<ConstatPdfContextType | undefined>({
  isLoading: false,
  stateReport: undefined,
  sections: undefined,
  localHtmlString: null,
  recipients: [],
  setRecipients: () => {},
  setLocalHtmlString: () => {},
  selectedAlerts: [],
  setSelectedAlerts: () => {},
});
export const useConstatPdfContext = () => useContext(ConstatPdfContext);
