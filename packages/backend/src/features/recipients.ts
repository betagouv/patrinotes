import { AppError } from "./errors";
import { normalizeEmail } from "./email";

/** Most recipients of one sent email: compte-rendu, constat, constat alert, fiche alert (05 § 12.2, abuse of the sender). */
export const MAX_RECIPIENTS = 20;
export const TOO_MANY_RECIPIENTS_MESSAGE = "20 destinataires au maximum par envoi.";

/** Distinct addresses of a recipients list ("a@x.fr, b@x.fr;c@x.fr" or an array), normalized, empty ones dropped. */
export const parseRecipients = (recipients: string | string[]) =>
  Array.from(
    new Set(
      (Array.isArray(recipients) ? recipients : recipients.replaceAll(";", ",").split(","))
        .map(normalizeEmail)
        .filter(Boolean),
    ),
  );

/** Refuses (400) a send to more than MAX_RECIPIENTS distinct addresses, before anything is stored or sent. */
export const assertRecipientLimit = (recipients: string | string[]) => {
  if (parseRecipients(recipients).length > MAX_RECIPIENTS) throw new AppError(400, TOO_MANY_RECIPIENTS_MESSAGE);
};
