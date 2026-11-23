import { makeDebug } from "../debug";
import fs, { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import csv from "csv-parser";
import { KyselyBatchWriter } from "./KyselyBatchWriter";
import path from "path";
import { db } from "../../db/db";
import { ENV } from "../../envVars";
import { ofetch } from "ofetch";
import { Readable } from "stream";

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

const immeublesCsvPath = {
  origin: `https://ministere-culture.s3.sbg.io.cloud.ovh.net/POP/merimee.csv`,
  dest: "./data/merimee.csv",
};
const objetsCsvPath = {
  origin: `https://ministere-culture.s3.sbg.io.cloud.ovh.net/POP/palissy.csv`,
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
  debug("Done fetching POP data");
  process.exit(0);
};

if (process.argv.includes("--standalone")) {
  standalone();
}
