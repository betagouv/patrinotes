import { deserializeMandatoryEmails } from "@patrinotes/pdf/utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Recipients of a constat alert: its mandatory services' emails and the additional ones, deduplicated. */
export const getAlertRecipients = (alert: { mandatory_emails: string | null; additional_emails: string | null }) => {
  const mandatoryEmails = deserializeMandatoryEmails(alert.mandatory_emails || "");
  const additionalEmails = alert.additional_emails
    ? alert.additional_emails.split(",").map((e) => e.trim().toLowerCase())
    : [];
  return Array.from(new Set([...mandatoryEmails.map((e) => e.email.toLowerCase()), ...additionalEmails]));
};

/** Recipients of a fiche alert: its mandatory services' emails and the additional ones, deduplicated, valid only. */
export const getMonumentAlertRecipients = (alert: {
  mandatory_emails: string | null;
  additional_emails: string | null;
}) => {
  const mandatory = deserializeMandatoryEmails(alert.mandatory_emails ?? "").map((e) => e.email);
  const additional = (alert.additional_emails ?? "").split(",");
  return Array.from(
    new Set([...mandatory, ...additional].map((email) => email.trim().toLowerCase()).filter((e) => emailPattern.test(e))),
  );
};
