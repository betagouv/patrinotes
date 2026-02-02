import { Schema, Table, column } from "@powersync/web";

const report = new Table({
  title: column.text,
  projectDescription: column.text,
  redactedBy: column.text,
  meetDate: column.text,
  applicantName: column.text,
  applicantAddress: column.text,
  projectCadastralRef: column.text,
  projectSpaceType: column.text,
  decision: column.text,
  precisions: column.text,
  contacts: column.text,
  furtherInformation: column.text,
  createdBy: column.text,
  createdAt: column.text,
  serviceInstructeur: column.text,
  pdf: column.text,
  attachment_id: column.text,
  disabled: column.integer,
  service_id: column.text,
  redactedById: column.text,
  applicantEmail: column.text,
  city: column.text,
  zipCode: column.text,
});

const service = new Table({
  department: column.text,
  dept_numbers: column.text,
  completeCoords: column.text,
  visible: column.integer,
  name: column.text,
  address: column.text,
  zipCode: column.text,
  city: column.text,
  phone: column.text,
  email: column.text,
  marianne_text: column.text,
  drac_text: column.text,
  service_text: column.text,

  courriel_crmh: column.text,
  courriel_caoa: column.text,
  courriel_dreal: column.text,
  courriel_sra: column.text,
  courriel_udap: column.text,
  courriel_ofb: column.text,
});

const user = new Table({
  name: column.text,
  service_id: column.text,
});

const delegation = new Table({
  createdBy: column.text,
  delegatedTo: column.text,
});

const pdf_snapshot = new Table({
  report_id: column.text,
  html: column.text,
  report: column.text,
  user_id: column.text,
});

const service_instructeurs = new Table({
  full_name: column.text,
  short_name: column.text,
  email: column.text,
  tel: column.text,
  service_id: column.text,
});

const clause_v2 = new Table({
  key: column.text,
  value: column.text,
  position: column.integer,
  service_id: column.text,
  text: column.text,
});

const pictures = new Table({
  reportId: column.text,
  url: column.text,
  createdAt: column.text,
  finalUrl: column.text,
});

const picture_lines = new Table({
  attachmentId: column.text,
  lines: column.text,
  createdAt: column.text,
  table: column.text,
  service_id: column.text,
});

const transactions = new Table({
  id: column.text,
  entity_id: column.text,
  type: column.text,
  op_id: column.text,
  tx_id: column.text,
  data: column.text,
  op: column.text,
  user_id: column.text,
});

const sent_email = new Table({
  id: column.text,
  report_id: column.text,
  sent_to: column.text,
  sent_at: column.text,
});

const state_report_sent_email = new Table({
  id: column.text,
  state_report_id: column.text,
  sent_to: column.text,
  sent_at: column.text,
});

const suggested_email = new Table({
  email: column.text,
  service_id: column.text,
});

const user_settings = new Table({
  user_id: column.text,
  default_emails: column.text,
  service_id: column.text,
});

const pop_immeubles = new Table({
  reference: column.text,
  destination_actuelle_de_l_edifice: column.text,
  adresse_forme_index: column.text,
  etablissement_affectataire_de_l_edifice: column.text,
  autre_appellation_de_l_edifice: column.text,
  nature_de_la_protection: column.text,
  auteur_de_l_edifice: column.text,
  cadastre: column.text,
  commune_forme_index: column.text,
  copyright: column.text,
  type_de_couverture: column.text,
  datation_de_l_edifice: column.text,
  denomination_de_l_edifice: column.text,
  lieu_de_conservation_d_un_element_architectural_deplace: column.text,
  description_de_l_edifice: column.text,
  dimensions_normalisees_des_edicules_uniquement: column.text,
  date_de_label: column.text,
  date_de_la_derniere_mise_a_jour: column.text,
  date_de_creation_de_la_notice: column.text,
  domaine: column.text,
  typologie_du_dossier: column.text,
  date_et_typologie_de_la_protection: column.text,
  departement_format_numerique: column.text,
  partie_d_elevation_exterieure: column.text,
  source_de_l_energie_utilisee_par_l_edifice: column.text,
  emplacement__forme_et_structure_de_l_escalier: column.text,
  description_de_l_elevation_interieure: column.text,
  etat_de_conservation: column.text,
  cadre_de_l_etude: column.text,
  genre_du_destinataire: column.text,
  historique: column.text,
  nom_du_cours_d_eau_traversant_ou_bordant_l_edifice: column.text,
  identifiant_agregee: column.text,
  cog_insee_lors_de_la_protection: column.text,
  justification_attribution: column.text,
  justification_de_la_datation: column.text,
  liens_externes: column.text,
  lieudit: column.text,
  lien_vers_la_base_archiv_mh: column.text,
  materiaux_du_gros_oeuvre: column.text,
  observations: column.text,
  precision_affectataire: column.text,
  partie_constituante_non_etudiee: column.text,
  partie_constituante: column.text,
  precision_sur_la_denomination: column.text,
  personnes_liees_a_l_edifice: column.text,
  typologie_de_plan: column.text,
  precision_de_la_localisation: column.text,
  precision_de_la_protection: column.text,
  description_de_l_iconographie: column.text,
  typologie_de_la_protection: column.text,
  precision_sur_le_statut_de_l_edifice: column.text,
  reference_a_un_ensemble: column.text,
  lien_vers_la_base_joconde: column.text,
  lien_vers_la_base_palissy: column.text,
  references_des_parties_constituantes_etudiees: column.text,
  région: column.text,
  département: column.text,
  elements_remarquables_dans_l_edifice: column.text,
  remploi: column.text,
  renvoi_vers_une_notice_de_la_base_merimee_ou_palissy: column.text,
  indexation_iconographique_normalisee: column.text,
  siecle_de_campagne_secondaire_de_construction: column.text,
  siecle_de_la_campagne_principale_de_construction: column.text,
  format_abrege_du_siecle_de_construction: column.text,
  typologie_de_la_zone_de_protection: column.text,
  statut_juridique_de_l_edifice: column.text,
  technique_du_decor_porte_de_l_edifice: column.text,
  titre_editorial_de_la_notice: column.text,
  materiaux_de_la_couverture: column.text,
  couverts_ou_decouverts_du_jardin_de_l_edifice: column.text,
  vocable___pour_les_edifices_cultuels: column.text,
  typologie_du_couvrement: column.text,
  adresse_forme_editoriale: column.text,
  commune_forme_editoriale: column.text,
  coordonnees_au_format_wgs84: column.text,
});

const state_report = new Table({
  id: column.text,
  nature_edifice: column.text,
  reference_pop: column.text,
  adresse: column.text,
  commune: column.text,
  code_postal: column.text,
  commune_historique: column.text,
  reference_cadastrale: column.text,
  periode_construction: column.text,
  nature_protection: column.text,
  parties_protegees: column.text,
  description: column.text,
  observations: column.text,
  titre_edifice: column.text,

  nature_visite: column.text,
  visite_partielle_details: column.text,
  date_visite: column.text,
  personnes_presentes: column.text,
  redacted_by: column.text,
  proprietaire: column.text,
  proprietaire_email: column.text,
  proprietaire_representant: column.text,
  proprietaire_representant_email: column.text,
  etat_general: column.text,
  proportion_dans_cet_etat: column.text,
  etat_commentaires: column.text,
  plan_situation: column.text,
  plan_edifice: column.text,
  vue_generale: column.text,
  preconisations: column.text,
  preconisations_commentaires: column.text,

  notes: column.text,

  attachment_id: column.text,

  bilan_quinquennal: column.text,
  service_id: column.text,
  created_by: column.text,
  created_at: column.text,
  disabled: column.integer,
});

const pop_objets = new Table({
  reference: column.text,
  contexte_d_acquisition: column.text,
  adresse_forme_index: column.text,
  auteur_du_projet: column.text,
  appellation_d_usage: column.text,
  personne_morale_creatrice_de_l_objet: column.text,
  auteur_de_l_oeuvre_ou_createur_de_l_objet: column.text,
  references_de_publications: column.text,
  categorie_technique: column.text,
  commune_forme_index: column.text,
  copyright: column.text,
  annee_de_creation: column.text,
  denomination: column.text,
  date_du_recolement: column.text,
  lieu_de_deplacement_de_l_objet: column.text,
  description: column.text,
  dimensions: column.text,
  date_de_la_derniere_mise_a_jour: column.text,
  date_de_creation_de_la_notice: column.text,
  domaine: column.text,
  date_et_typologie_de_la_protection: column.text,
  departement_format_numerique: column.text,
  region: column.text,
  departement_en_lettres: column.text,
  nom_de_l_edifice: column.text,
  emplacement_de_l_oeuvre_dans_l_edifice: column.text,
  etat: column.text,
  cadre_de_l_etude: column.text,
  lieu_de_creation: column.text,
  references_d_expositions: column.text,
  historique: column.text,
  identifiant_agregee: column.text,
  inscription: column.text,
  cog_insee: column.text,
  justification_de_la_datation: column.text,
  lien_vers_la_base_arcade: column.text,
  liens_externes: column.text,
  lieudit: column.text,
  lien_vers_la_base_inha: column.text,
  lien_vers_la_base_archiv_mh: column.text,
  statut_juridique_de_l_objet: column.text,
  materiaux: column.text,
  numero_artificiel_de_differenciation_de_l_objet: column.text,
  numero_d_inventaire_affecte_a_l_objet: column.text,
  nom_du_redacteur: column.text,
  numero_de_l_arrete_de_protection: column.text,
  observations: column.text,
  lieu_de_provenance: column.text,
  intitule_de_l_ensemble: column.text,
  partie_constituante_non_etudiee: column.text,
  partie_constituante: column.text,
  precision_sur_la_denomination: column.text,
  precision_sur_les_dimensions: column.text,
  personnes_liees_a_l_objet: column.text,
  precision_sur_l_etat: column.text,
  precision_sur_l_inscription: column.text,
  precision_sur_la_localisation: column.text,
  precision_sur_la_protection: column.text,
  precision_sur_la_representation: column.text,
  typologie_de_la_protection: column.text,
  reference_a_une_notice_merimee_mh: column.text,
  reference_a_un_ensemble: column.text,
  lien_vers_la_base_joconde: column.text,
  lien_vers_la_base_museofile: column.text,
  reference_a_une_partie_constituante: column.text,
  renvoi_vers_une_notice_palissy_mh_ou_merimee_mh: column.text,
  indexation_iconographique_normalisee: column.text,
  siecle_de_creation: column.text,
  format_abrege_du_siecle_de_creation: column.text,
  sources_d_archives_et_bases_de_donnees_de_reference: column.text,
  etape_de_creation: column.text,
  statut_juridique_du_proprietaire: column.text,
  structure_et_typologie: column.text,
  theme_de_l_etude: column.text,
  titre_editorial: column.text,
  titre_iconographique: column.text,
  informations_relatives_aux_vols: column.text,
  adresse_forme_editoriale: column.text,
  commune_forme_editoriale: column.text,
  typologie_du_dossier: column.text,
  code_insee_commune_actuelle: column.text,
  edifice_actuel: column.text,
});

const visited_section = new Table({
  state_report_id: column.text,
  section: column.text,
  etat_general: column.text,
  proportion_dans_cet_etat: column.text,
  commentaires: column.text,
  service_id: column.text,
});

const visited_section_attachment = new Table({
  visited_section_id: column.text,
  attachment_id: column.text,
  is_deprecated: column.integer,
  label: column.text,
  created_at: column.text,
  service_id: column.text,
});

const report_attachment = new Table({
  report_id: column.text,
  attachment_id: column.text,
  is_deprecated: column.integer,
  service_id: column.text,
  created_at: column.text,
});

const state_report_attachment = new Table({
  state_report_id: column.text,
  attachment_id: column.text,
  is_deprecated: column.integer,
  label: column.text,
  service_id: column.text,
  created_at: column.text,
});

const pop_images = new Table({
  id: column.text,
  reference: column.text,
  url: column.text,
  label: column.text,
  copyright: column.text,
  dept_number: column.text,
});

const state_report_alert = new Table({
  state_report_id: column.text,
  alert: column.text,
  commentaires: column.text,
  show_in_report: column.integer,
  service_id: column.text,
  objet_ou_mobilier: column.text,
  objet_ou_mobilier_name: column.text,
  probleme: column.text,
  mandatory_emails: column.text,
  additional_emails: column.text,
});

const state_report_alert_attachment = new Table({
  state_report_alert_id: column.text,
  attachment_id: column.text,
  is_deprecated: column.integer,
  label: column.text,
  created_at: column.text,
  service_id: column.text,
});

export const AppSchema = new Schema({
  report,
  service,
  user,
  delegation,
  pdf_snapshot,
  service_instructeurs,
  clause_v2,
  pictures,
  picture_lines,
  transactions,
  sent_email,
  suggested_email,
  user_settings,
  pop_immeubles,
  state_report,
  visited_section,
  visited_section_attachment,
  report_attachment,
  state_report_attachment,
  state_report_sent_email,
  pop_objets,
  pop_images,
  state_report_alert,
  state_report_alert_attachment,
  attachments: new AttachmentTable({
    name: "attachments",
  }),
});

export type Database = (typeof AppSchema)["types"];
export type Report = Database["report"];
export type Service = Database["service"];
export type User = Database["user"];
export type Delegation = Database["delegation"];
export type PdfSnapshot = Database["pdf_snapshot"];
export type ServiceInstructeurs = Database["service_instructeurs"];
export type Clause_v2 = Database["clause_v2"];
export type Pictures = Database["pictures"];
export type PictureLines = Database["picture_lines"];
export type Transactions = Database["transactions"];
export type SentEmail = Database["sent_email"];
export type SuggestedEmail = Database["suggested_email"];
export type UserSettings = Database["user_settings"];
export type PopImmeuble = Database["pop_immeubles"];
export type StateReport = Database["state_report"];
export type VisitedSection = Database["visited_section"];
export type VisitedSectionAttachment = Database["visited_section_attachment"];
export type ReportAttachment = Database["report_attachment"];
export type StateReportAttachment = Database["state_report_attachment"];
export type StateReportSentEmail = Database["state_report_sent_email"];
export type PopObjet = Database["pop_objets"];
export type PopImage = Database["pop_images"];
export type StateReportAlert = Database["state_report_alert"];

import type { Database as BackendDatabase } from "../../../backend/src/db/db";
import { AttachmentTable } from "@powersync/attachments";

type SharedTables = Extract<keyof Database, keyof BackendDatabase> & Extract<keyof BackendDatabase, keyof Database>;
type CheckTables = {
  [K in SharedTables]: {
    [P in keyof Database[K]]: P extends keyof BackendDatabase[K] ? true : never;
  };
};

type EveryColumnTrue<T> = T extends Record<string, true> ? true : never;
type IsTableOk<T extends SharedTables> = EveryColumnTrue<CheckTables[T]>;

const _checkTables: { [K in SharedTables]: IsTableOk<K> } = {
  report: true,
  service: true,
  user: true,
  delegation: true,
  pdf_snapshot: true,
  service_instructeurs: true,
  clause_v2: true,
  report_attachment: true,
  state_report_attachment: true,
  picture_lines: true,
  transactions: true,
  sent_email: true,
  suggested_email: true,
  user_settings: true,
  pop_immeubles: true,
  state_report: true,
  visited_section: true,
  visited_section_attachment: true,
  state_report_sent_email: true,
  pop_objets: true,
  pop_images: true,
  state_report_alert: true,
  state_report_alert_attachment: true,
};
