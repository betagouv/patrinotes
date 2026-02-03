import { alertSectionStaticData } from "@cr-vif/pdf/constat";
import { Service, StateReportAlert } from "../../../db/AppSchema";

export const OBJETS_MOBILIERS_SECTION = "Objets et mobiliers";

export const getEmailsForSection = (sectionTitle: string, service: Service) => {
  const sectionStaticData = alertSectionStaticData.find((s) => s.title === sectionTitle);
  console.log(sectionStaticData, service);
  if (!sectionStaticData || !service) return [];

  const mandatoryEmails = sectionStaticData.services.map((svc) => {
    const key = "courriel_" + svc.toLowerCase().replace(/\s+/g, "_");
    const email = (service[key as keyof typeof service] as string) ?? "";

    return { service: svc, email };
  });

  return mandatoryEmails;
};

export const serializeMandatoryEmails = (emails: { service: string; email: string }[]): string => {
  return emails.map((e) => `${e.service}:${e.email}`).join(";");
};

export const deserializeMandatoryEmails = (data: string): { service: string; email: string }[] => {
  if (!data) return [];
  return data.split(";").map((entry) => {
    const [service, email] = entry.split(":");
    return { service, email };
  });
};

export const checkAlertErrors = (alert: StateReportAlert): AlertErrors => {
  const mandatoryEmails = deserializeMandatoryEmails(alert.mandatory_emails || "");
  const missingEmails = mandatoryEmails
    .filter((e) => !e.email)
    .map((e) => ({ service: e.service, error: MISSING_EMAIL_ERROR }));
  const invalidEmails = mandatoryEmails
    .filter((e) => e.email && !checkEmailValid(e.email))
    .map((e) => ({ service: e.service, error: INVALID_EMAIL_ERROR }));
  return {
    email: [...missingEmails, ...invalidEmails],
  };
};

export const checkEmailValid = (email: string): boolean => {
  const input = document.createElement("input");
  input.type = "email";
  input.value = email;
  return input.checkValidity();
};

export type AlertErrors = {
  email: { service: string; error: string }[];
};

const MISSING_EMAIL_ERROR = "Veuillez renseigner un courriel pour ce service.";
const INVALID_EMAIL_ERROR = "Veuillez renseigner un courriel valide.";
