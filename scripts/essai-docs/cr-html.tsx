// Essai Docs (La Suite) : génère le HTML de comptes rendus d'exemple avec la vraie
// fonction de Patrinotes (getReportHtmlString), plus la liste des photos.
// Usage : pnpm tsx scripts/essai-docs/cr-html.tsx > scripts/essai-docs/work/reports.json
import { getReportHtmlString } from "../../packages/pdf/src/report";

const service = {
  id: "udap-37",
  name: "UDAP d'Indre-et-Loire",
  email: "udap.indre-et-loire@culture.gouv.fr",
  phone: "247315500",
} as any;

const clauses = [
  { key: "type-espace", value: "abords", text: "Le projet se situe dans les abords d'un monument historique." },
  { key: "type-espace", value: "spr", text: "Le projet se situe dans le périmètre d'un site patrimonial remarquable (SPR)." },
  { key: "decision", value: "favorable", text: "Avis favorable sous réserve du respect des prescriptions ci-dessous." },
  { key: "decision", value: "defavorable", text: "Le projet, en l'état, ne pourra pas recevoir un avis favorable." },
  { key: "contacts-utiles", value: "caue", text: "CAUE d'Indre-et-Loire : conseil gratuit aux particuliers, 02 47 31 13 40, contact@caue37.fr" },
  { key: "contacts-utiles", value: "abf", text: "Permanences de l'architecte des bâtiments de France : le 1er jeudi du mois, sur rendez-vous." },
  { key: "bonnes-pratiques", value: "enduits", text: "Les enduits seront réalisés à la chaux naturelle, finition talochée fin, teinte proche des enduits anciens environnants." },
  { key: "bonnes-pratiques", value: "menuiseries", text: "Les menuiseries seront en bois peint, à petits bois rapportés à l'extérieur. Le PVC est proscrit." },
  { key: "bonnes-pratiques", value: "toiture", text: "Les couvertures seront en ardoise naturelle posée au clou, format 32 x 22 cm." },
] as any[];

const reports = [
  {
    id: "cr-1",
    title: "Remplacement des menuiseries et ravalement de façade",
    meetDate: "2026-11-18T10:00:00",
    redactedBy: "Claire Dubois, architecte des bâtiments de France",
    applicantName: "M. et Mme Martin",
    applicantAddress: "12 rue Colbert",
    city: "Tours",
    zipCode: "37000",
    projectCadastralRef: "AB 123",
    projectSpaceType: "abords",
    decision: "favorable",
    personnes_presentes: "M. Martin\nMme Martin\nM. Leroy (maître d'œuvre)",
    precisions:
      "Les fenêtres de l'étage conserveront leur partition à trois carreaux par vantail.\nLe soubassement en pierre de tuffeau sera conservé et nettoyé par micro-gommage, sans sablage.",
    projectDescription:
      "Remplacement de l'ensemble des fenêtres en façade sur rue.\nRavalement complet de la façade avec reprise des enduits.",
    contacts: "caue,abf",
    furtherInformation: "enduits,menuiseries",
    photos: [
      ["Façade sur rue, état actuel", "#b5651d"],
      ["Détail fenêtre du 1er étage", "#2e86ab"],
      ["Soubassement en tuffeau", "#e8d8a8"],
      ["Porte d'entrée", "#5b8c5a"],
    ],
  },
  {
    id: "cr-2",
    title: "Création d'une véranda en fond de parcelle",
    meetDate: "2026-11-20T14:30:00",
    redactedBy: "Claire Dubois, architecte des bâtiments de France",
    applicantName: "Mme Petit",
    applicantAddress: "4 place Plumereau",
    city: "Tours",
    zipCode: "37000",
    projectCadastralRef: "AC 45",
    projectSpaceType: "spr",
    decision: "defavorable",
    personnes_presentes: "Mme Petit",
    precisions:
      "Une extension de volume plus modeste, à ossature métallique fine et toiture en zinc, pourrait être envisagée.",
    projectDescription: "Véranda en aluminium blanc de 25 m² accolée à la façade arrière.",
    contacts: "caue",
    furtherInformation: "toiture",
    photos: [
      ["Façade arrière", "#7d5ba6"],
      ["Jardin, emplacement prévu", "#3d9970"],
      ["Vue depuis la cour voisine", "#c0392b"],
    ],
  },
  {
    id: "cr-3",
    title: "Réfection de toiture",
    meetDate: "2026-11-21T09:00:00",
    redactedBy: "Paul Bernard, technicien des bâtiments de France",
    applicantName: "SCI Les Tilleuls",
    applicantAddress: "1 allée des Tilleuls",
    city: "Amboise",
    zipCode: "37400",
    projectCadastralRef: null,
    projectSpaceType: "abords",
    decision: "favorable",
    personnes_presentes: "",
    precisions: "",
    projectDescription: "Remplacement de la couverture en ardoise et des gouttières.",
    contacts: "",
    furtherInformation: "toiture",
    photos: [
      ["Vue générale de la toiture", "#34495e"],
      ["Lucarne côté est", "#f39c12"],
      ["Gouttière à remplacer", "#95a5a6"],
      ["Charpente, vue des combles", "#8e5a2b"],
      ["Faîtage", "#16a085"],
      ["Souche de cheminée", "#d35400"],
    ],
  },
];

const out = reports.map(({ photos, ...report }) => ({
  id: report.id,
  title: `CR – ${report.title} – ${report.city}`,
  html: getReportHtmlString(report as any, clauses, service),
  photos: photos.map(([label, color]) => ({ label, color })),
}));

process.stdout.write(JSON.stringify(out, null, 2));
