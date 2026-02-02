import { alertSectionStaticData } from "@cr-vif/pdf/constat";
import { Service } from "../../../db/AppSchema";

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
