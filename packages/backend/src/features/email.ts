/**
 * Emails are stored lowercase and trimmed (whitelist, user, internal_user).
 * Normalize every email coming from a user or an admin before comparing or storing it,
 * so "Prenom.Nom@culture.gouv.fr " matches "prenom.nom@culture.gouv.fr".
 */
export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * For logs: "Jean.Dupont@culture.gouv.fr " -> "J*********t@culture.gouv.fr ".
 * Keeps the length, the case of the first and last letters, surrounding spaces and the domain,
 * enough to diagnose a typo without writing the address in the logs.
 */
export const maskEmail = (email: string) =>
  email.replace(/[^\s@]+(?=@)/, (local) =>
    local.length <= 2 ? "*".repeat(local.length) : local[0] + "*".repeat(local.length - 2) + local[local.length - 1],
  );
