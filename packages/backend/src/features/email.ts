/**
 * Emails are stored lowercase and trimmed (whitelist, user, internal_user).
 * Normalize every email coming from a user or an admin before comparing or storing it,
 * so "Prenom.Nom@culture.gouv.fr " matches "prenom.nom@culture.gouv.fr".
 */
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
