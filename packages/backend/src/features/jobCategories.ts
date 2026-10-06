export const EMPTY_JOB_CATEGORY = "Non renseigné";
export const OTHER_JOB_CATEGORY = "Autre";

// Order matters: the first matching rule wins
const rules: { category: string; pattern: RegExp }[] = [
  { category: "Numérique / Innovation", pattern: /numeri|developpeu|designer|eligis/ },
  { category: "Administration centrale", pattern: /sdmhsp|bureau de l'expertise|partenariat/ },
  { category: "Inspection des patrimoines", pattern: /inspect/ },
  { category: "Direction régionale (DRAC)", pattern: /\bdrac\b/ },
  { category: "Suivi financier / administratif des travaux", pattern: /suivi financier/ },
  { category: "Ingénieur des services culturels et du patrimoine", pattern: /\biscp\b|ingenieu/ },
  { category: "Architecte des Bâtiments de France", pattern: /\babf\b|\barchitecte\b|^adjointe? udap/ },
  { category: "Technicien des services culturels et des BdF", pattern: /tscbf|\btbf\b|technicien/ },
  { category: "Assistant urbanisme / ADS", pattern: /assistant.*(instruct|\bads\b|urbanisme)/ },
  { category: "Instructeur", pattern: /instruct/ },
  { category: "CRMH", pattern: /conservat(eur|rice)/ },
  { category: "CRMH", pattern: /\bcrmh\b/ },
  { category: "Protection des monuments historiques", pattern: /protection/ },
  { category: "Conservation-restauration / travaux MH", pattern: /restauration|\bcst\b/ },
  { category: "Chargé de mission patrimoine", pattern: /mission/ },
  { category: "Secrétaire", pattern: /secreta(ire|riat)|^sa$/ },
  { category: "Assistant administratif", pattern: /administrati|assistant|gestionnaire/ },
];

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`]/g, "'").toLowerCase().trim();

export const getJobCategory = (job: string | null | undefined) => {
  const normalized = normalize(job ?? "");
  if (!normalized || normalized === "non renseigne") return EMPTY_JOB_CATEGORY;
  return rules.find((rule) => rule.pattern.test(normalized))?.category ?? OTHER_JOB_CATEGORY;
};
