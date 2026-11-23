/** Escapes a value for insertion into the HTML of an email (text or attribute). */
export const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Escapes a multi-line text and keeps its line breaks. */
export const escapeMultiline = (value: unknown) => escapeHtml(value).replace(/\r?\n/g, "<br/>");
