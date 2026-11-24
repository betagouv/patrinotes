// Essai Docs : relit le contenu exporté de Docs (HTML + photos) et produit le PDF
// avec le générateur de Patrinotes (ReportPDFDocument), donc la même mise en page.
// Usage : pnpm tsx scripts/essai-docs/cr-pdf.tsx scripts/essai-docs/work/export.json scripts/essai-docs/work/pdf
import React from "react";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { renderToFile } from "../../packages/pdf/node_modules/@react-pdf/renderer";
import { ReportPDFDocument } from "../../packages/pdf/src/report";
import { initFonts } from "../../packages/pdf/src/utils";

(globalThis as any).React = React;
const [exportPath, outDir] = process.argv.slice(2);
const pub = path.resolve(process.cwd(), "packages/frontend/public");
initFonts(pub);

const service = {
  id: "udap-37",
  name: "UDAP d'Indre-et-Loire",
  email: "udap.indre-et-loire@culture.gouv.fr",
  phone: "247315500",
  marianne_text: "Préfet de la région Centre-Val de Loire",
  drac_text: "Direction régionale des affaires culturelles Centre-Val de Loire",
  service_text: "Unité départementale de l'architecture et du patrimoine d'Indre-et-Loire",
} as any;

const docs = JSON.parse(readFileSync(exportPath!, "utf8")) as {
  id: string;
  title: string;
  html: string;
  photos: { label: string; data: string }[];
}[];

const main = async () => {
mkdirSync(outDir!, { recursive: true });
for (const doc of docs) {
  // Les photos sont passées à part (grille de photos de Patrinotes) : on retire leur section du HTML.
  const html = doc.html.split(/<h2[^>]*>Photos<\/h2>/)[0]!;
  const file = path.join(outDir!, doc.title.replace(/[^\p{L}\p{N} –-]/gu, "").slice(0, 80) + ".pdf");
  await renderToFile(
    <ReportPDFDocument
      service={service}
      htmlString={html}
      images={{ marianne: pub + "/marianne.png", marianneFooter: pub + "/marianne_footer.png" }}
      pictures={doc.photos.map((p) => ({ url: p.data, label: p.label, width: 1200, height: 800 }))}
    />,
    file,
  );
  console.log(file);
}
};

main();
