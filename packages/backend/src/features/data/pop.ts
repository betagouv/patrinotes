import { makeDebug } from "../debug";
import fs, { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import csv from "csv-parser";
import { KyselyBatchWriter } from "./KyselyBatchWriter";
import path from "path/win32";
import { db } from "../../db/db";
import { ENV } from "../../envVars";
import { FetchError, ofetch } from "ofetch";
import { Readable } from "stream";
import { v7 } from "uuid";
import { parseHTML, Element } from "linkedom";

const debug = makeDebug("sync-pop");

export const initPopImmeubles = async () => {
  await fetchPopCSV(immeublesCsvPath);

  debug("Importing POP immeubles from CSV");

  await pipeline(
    fs.createReadStream(immeublesCsvPath.dest),
    csv({
      separator: "|",
      mapHeaders: ({ header }) => header.trim().toLowerCase(),
    }),
    new KyselyBatchWriter<ImmeubleResult>("pop_immeubles", 500, "reference"),
  );

  await fs.promises.unlink(path.resolve(immeublesCsvPath.dest));
};

// export const initPopDatasette = async () => {
//   const isTableEmpty = (await db.selectFrom("merimee_to_memoire").selectAll().limit(1).execute()).length === 0;
//   if (!isTableEmpty) {
//     debug("POP datasette table is not empty, skipping import");
//     return;
//   }

//   const datasetteCsvPath = {
//     origin: `${ENV.COLLECTIF_OBJETS_DATASETTE_URL}/data/merimee_to_memoire.csv?_dl=on&_stream=on&_size=max`,
//     dest: "./data/merimee_to_memoire.csv",
//   };

//   // await fetchPopDatasetteCSV(datasetteCsvPath);

//   debug("Importing POP datasette from CSV");

//   await pipeline(
//     fs.createReadStream(datasetteCsvPath.dest),
//     csv({
//       mapHeaders: ({ header }) => header.trim().toLowerCase(),
//     }),
//     new KyselyBatchWriter("merimee_to_memoire", 500, "rowid"),
//   );
// };

export const initPopObjets = async () => {
  const isTableEmpty = (await db.selectFrom("pop_objets").selectAll().limit(1).execute()).length === 0;
  if (!isTableEmpty) {
    debug("POP objets table is not empty, skipping import");
    return;
  }

  await fetchPopCSV(objetsCsvPath);

  debug("Importing POP objets from CSV");

  await pipeline(
    fs.createReadStream(objetsCsvPath.dest),
    csv({
      separator: "|",
      mapHeaders: ({ header }) => header.trim().toLowerCase(),
    }),
    new KyselyBatchWriter<ImmeubleResult>("pop_objets", 500, "reference"),
  );

  await fs.promises.unlink(path.resolve(objetsCsvPath.dest));
};

export const initPopImages = async () => {
  let missingCount = 0;
  // immeubles
  do {
    const currentMissingCount = await missingImmeubleCountQuery.executeTakeFirstOrThrow();
    missingCount = parseInt(currentMissingCount.count);
    debug(`${missingCount} POP images remaining, fetching next ${batchSize}`);

    const batch = await firstMissingImmeubleBatchQuery.execute();
    const imagesToFetch = batch.map((immeuble) => ({
      reference: immeuble.reference,
      db: "merimee" as const,
      dept_number: immeuble.departement_format_numerique!,
    }));
    await fetchBatchPopImages({ images: imagesToFetch });

    await db.transaction().execute(async (trx) => {
      const now = new Date().toISOString();
      for (const immeuble of batch) {
        await trx
          .updateTable("pop_immeubles")
          .set({ last_image_check_at: now })
          .where("id", "=", immeuble.id)
          .execute();
      }
    });

    debug(`Fetched batch of ${imagesToFetch.length} POP images`);
  } while (missingCount > 0);

  // objets
  missingCount = 0;
  do {
    const currentMissingCount = await missingObjetCountQuery.executeTakeFirstOrThrow();
    missingCount = parseInt(currentMissingCount.count);
    debug(`${missingCount} POP objet images remaining, fetching next ${batchSize}`);

    const batch = await firstMissingObjetBatchQuery.execute();
    const imagesToFetch = batch.map((objet) => ({
      reference: objet.reference,
      db: "palissy" as const,
      dept_number: objet.departement_format_numerique!,
    }));
    await fetchBatchPopImages({ images: imagesToFetch });

    await db.transaction().execute(async (trx) => {
      const now = new Date().toISOString();
      for (const objet of batch) {
        await trx.updateTable("pop_objets").set({ last_image_check_at: now }).where("id", "=", objet.id).execute();
      }
    });

    debug(`Fetched batch of ${imagesToFetch.length} POP objet images`);
  } while (missingCount > 0);
};

const delay = 100;
const batchSize = 50;

const today = new Date();
const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 1, 0, 0, 0, 0));

const missingImmeubleCountQuery = db
  .selectFrom("pop_immeubles")
  .select(db.fn.count<string>("pop_immeubles.id").as("count"))
  .leftJoin("pop_images", "pop_images.reference", "pop_immeubles.reference")
  .where("pop_immeubles.last_image_check_at", "<", todayUTC.toISOString())
  .where("pop_images.reference", "is", null);

const missingObjetCountQuery = db
  .selectFrom("pop_objets")
  .select(db.fn.count<string>("pop_objets.reference").as("count"))
  .leftJoin("pop_images", "pop_images.reference", "pop_objets.reference")
  .where((eb) =>
    eb.or([
      eb("pop_objets.last_image_check_at", "<", todayUTC.toISOString()),
      eb("pop_objets.last_image_check_at", "is", null),
    ]),
  )
  .where("pop_images.reference", "is", null);

const firstMissingImmeubleBatchQuery = db
  .selectFrom("pop_immeubles")
  .selectAll("pop_immeubles")
  .leftJoin("pop_images", "pop_images.reference", "pop_immeubles.reference")
  .orderBy("pop_immeubles.last_image_check_at", "asc")
  .orderBy("pop_immeubles.reference", "asc")
  .where("pop_images.reference", "is", null)
  .where("pop_immeubles.last_image_check_at", "<", todayUTC.toISOString())
  .limit(batchSize);

const firstMissingObjetBatchQuery = db
  .selectFrom("pop_objets")
  .selectAll("pop_objets")
  .leftJoin("pop_images", "pop_images.reference", "pop_objets.reference")
  .orderBy("pop_objets.last_image_check_at", "asc")
  .orderBy("pop_objets.reference", "asc")
  .where("pop_images.reference", "is", null)
  .where((eb) =>
    eb.or([
      eb("pop_objets.last_image_check_at", "<", todayUTC.toISOString()),
      eb("pop_objets.last_image_check_at", "is", null),
    ]),
  )
  .limit(batchSize);

export const fetchBatchPopImages = async ({
  images,
}: {
  images: { reference: string; db: "merimee" | "palissy"; dept_number: string }[];
}) => {
  for (const image of images) {
    const existing = await db
      .selectFrom("pop_images")
      .selectAll()
      .where("reference", "=", image.reference)
      .executeTakeFirst();
    if (existing) {
      debug(`POP image for reference ${image.reference} already exists, skipping`);
      continue;
    }

    try {
      debug(`Fetching POP images for reference ${image.reference}`);
      const popImages = await getPopImages({ reference: image.reference, db: image.db });
      for (const popImage of popImages.slice(0, 1)) {
        await db
          .insertInto("pop_images")
          .values({
            id: `pop-image-${v7()}`,
            reference: image.reference,
            url: popImage.url,
            label: popImage.label,
            copyright: popImage.copyright,
            dept_number: image.dept_number,
          })
          .execute();
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      debug(`Error fetching POP images for reference ${image.reference}:`, error);
      if (error instanceof FetchError) {
        if (error.response?.status === 400) {
          continue;
        }
      }

      throw error;
    }
  }
};

const getPopImages = async ({ reference, db }: { reference: string; db: "merimee" | "palissy" }) => {
  const htmlRaw = await fetchNoticePop({ reference, db });
  const html = parseHTML(htmlRaw);

  const slideNodes = html.document.querySelectorAll(".swiper-slide");

  const slidesArray = Array.from(slideNodes);
  return slidesArray.map((slide) => getImageFromElement(slide));
};

const getImageFromElement = (el: Element) => {
  const imgEl = el.querySelector("img");
  const textContainer = el.querySelector('div[style*="margin-top:5px"]');

  const label = textContainer?.children[0]?.textContent;
  const copyright = textContainer?.children[1]?.textContent;

  return { url: imgEl!.getAttribute("src"), label, copyright };
};

const immeublesCsvPath = {
  origin: `https://object.data.gouv.fr/ministere-culture/POP/merimee.csv`,
  dest: "./data/merimee.csv",
};
const objetsCsvPath = {
  origin: `https://object.data.gouv.fr/ministere-culture/POP/palissy.csv`,
  dest: "./data/palissy.csv",
};

export const fetchPopCSV = async ({ origin, dest }: { origin: string; dest: string }) => {
  debug("Downloading POP immeubles CSV");
  const url = origin;
  const stream = await ofetch(url, { responseType: "stream" });

  const nodeStream = Readable.fromWeb(stream as any);
  const writer = createWriteStream(dest);

  await pipeline(nodeStream, writer);
  debug("Done");
};

export const fetchPopDatasetteCSV = async ({ origin, dest }: { origin: string; dest: string }) => {
  debug("Downloading POP datasette CSV");
  const stream = await ofetch(origin, { responseType: "stream" });
  const nodeStream = Readable.fromWeb(stream as any);

  const writer = createWriteStream(dest);
  nodeStream.pipe(writer);

  await pipeline(nodeStream, writer);
  debug("Done");
};
// https://collectif-objets-datasette.fly.dev

export const fetchNoticePop = async ({ reference, db }: { reference: string; db: "merimee" | "palissy" }) => {
  const html = await ofetch("https://pop.culture.gouv.fr/notice/" + db + "/" + reference);
  return html;
};

export interface PopImmeublesResult {
  total_count: number;
  results: ImmeubleResult[];
}

export interface ImmeubleResult {
  reference: string;
  destination_actuelle_de_l_edifice?: any;
  adresse_forme_index: string;
  etablissement_affectataire_de_l_edifice?: any;
  autre_appellation_de_l_edifice?: any;
  nature_de_la_protection: string;
  auteur_de_l_edifice: string;
  cadastre: string;
  commune_forme_index: string;
  copyright: string;
  type_de_couverture?: any;
  datation_de_l_edifice: string;
  denomination_de_l_edifice: string;
  lieu_de_conservation_d_un_element_architectural_deplace?: any;
  description_de_l_edifice?: any;
  dimensions_normalisees_des_edicules_uniquement?: any;
  date_de_label?: any;
  date_de_la_derniere_mise_a_jour: string;
  date_de_creation_de_la_notice: string;
  domaine: string;
  typologie_du_dossier: string;
  date_et_typologie_de_la_protection: string;
  departement_format_numerique: string;
  partie_d_elevation_exterieure?: any;
  source_de_l_energie_utilisee_par_l_edifice?: any;
  emplacement_forme_et_structure_de_l_escalier?: any;
  description_de_l_elevation_interieure?: any;
  etat_de_conservation?: any;
  cadre_de_l_etude: string;
  genre_du_destinataire?: any;
  historique: string;
  nom_du_cours_d_eau_traversant_ou_bordant_l_edifice?: any;
  identifiant_agregee: string;
  cog_insee_lors_de_la_protection: string[];
  justification_attribution?: any;
  justification_de_la_datation?: any;
  liens_externes?: any;
  lieudit?: any;
  lien_vers_la_base_archiv_mh: string;
  materiaux_du_gros_oeuvre?: any;
  observations?: any;
  precision_affectataire?: any;
  partie_constituante_non_etudiee?: any;
  partie_constituante?: any;
  precision_sur_la_denomination?: any;
  personnes_liees_a_l_edifice?: any;
  typologie_de_plan?: any;
  precision_de_la_localisation: string;
  precision_de_la_protection: string;
  description_de_l_iconographie?: any;
  typologie_de_la_protection: string;
  precision_sur_le_statut_de_l_edifice?: any;
  reference_a_un_ensemble?: any;
  lien_vers_la_base_joconde?: any;
  lien_vers_la_base_palissy?: any;
  references_des_parties_constituantes_etudiees?: any;
  region: string[];
  departement_en_lettres: string[];
  elements_remarquables_dans_l_edifice?: any;
  remploi?: any;
  renvoi_vers_une_notice_de_la_base_merimee_ou_palissy?: any;
  indexation_iconographique_normalisee?: any;
  siecle_de_campagne_secondaire_de_construction?: any;
  siecle_de_la_campagne_principale_de_construction: string;
  format_abrege_du_siecle_de_construction: string;
  typologie_de_la_zone_de_protection?: any;
  statut_juridique_de_l_edifice: string;
  technique_du_decor_porte_de_l_edifice: string;
  titre_editorial_de_la_notice: string;
  materiaux_de_la_couverture?: any;
  couverts_ou_decouverts_du_jardin_de_l_edifice?: any;
  vocable_pour_les_edifices_cultuels?: any;
  typologie_du_couvrement?: any;
  adresse_forme_editoriale: string;
  commune_forme_editoriale: string;
  coordonnees_au_format_wgs84: Coordonnees;
}

export interface Coordonnees {
  lon: number;
  lat: number;
}

const standalone = async () => {
  await initPopImmeubles();
  await initPopObjets();
  await initPopImages();
  debug("Done fetching POP data");
  process.exit(0);
};

if (process.argv.includes("--standalone")) {
  standalone();
}
