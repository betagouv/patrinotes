/**
 * Same limit as the server (packages/backend/src/features/recipients.ts): one email is sent to at most
 * MAX_RECIPIENTS distinct addresses, compared trimmed and lowercase. The recipient fields stop at this limit,
 * so the server's refusal is only a safeguard.
 */
export const MAX_RECIPIENTS = 20;
export const TOO_MANY_RECIPIENTS_MESSAGE = "20 destinataires au maximum par envoi.";

export const normalizeRecipient = (email: string) => email.trim().toLowerCase();

/** Distinct non-empty addresses, compared like the server does. */
export const countRecipients = (emails: readonly string[]) =>
  new Set(emails.map(normalizeRecipient).filter(Boolean)).size;

/**
 * Keeps `entries` in order while the distinct addresses (with the `fixed` ones, e.g. an alert's mandatory
 * emails) stay within MAX_RECIPIENTS; empty entries and repeats are kept since they add no recipient.
 * `refused` lists the addresses left out, `dropped` tells whether there is any.
 */
export const capRecipients = (entries: readonly string[], fixed: readonly string[] = []) => {
  const seen = new Set(fixed.map(normalizeRecipient).filter(Boolean));
  const kept: string[] = [];
  const refused: string[] = [];
  for (const entry of entries) {
    const email = normalizeRecipient(entry);
    if (!email || seen.has(email)) {
      kept.push(entry);
      continue;
    }
    if (seen.size >= MAX_RECIPIENTS) {
      refused.push(entry);
      continue;
    }
    seen.add(email);
    kept.push(entry);
  }
  return { kept, refused, dropped: refused.length > 0, count: seen.size };
};
