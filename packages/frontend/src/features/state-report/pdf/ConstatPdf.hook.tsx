import { useForm, useWatch } from "react-hook-form";
import { SendConstatForm, useSendConstatFormContext } from "./ConstatPdfContext";

const useFormContextField = <TFieldName extends keyof SendConstatForm>(fieldName: TFieldName) => {
  const form = useSendConstatFormContext();
  return useWatch({ control: form.control, name: fieldName }) as SendConstatForm[TFieldName];
};

export const useHtmlString = () => useFormContextField("htmlString");
export const useRecipients = () => useFormContextField("recipients");
export const useAlerts = () => useFormContextField("alerts");
export const useSections = () => useFormContextField("sections");
export const useStateReport = () => useFormContextField("stateReport");
