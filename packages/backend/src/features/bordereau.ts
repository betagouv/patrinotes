import { Selectable } from "kysely";
import { Database } from "../db/db";
import { deserializePreconisations } from "@patrinotes/pdf/constat";
import { wrapWithDsfrMail } from "./mail/dsfrMailWrapper";

export const createBordereauMailContent = ({
  stateReport,
  user,
}: {
  stateReport: Selectable<Database["state_report"]>;
  user: Selectable<Database["user"]>;
}) => {
  const preconisations = deserializePreconisations(stateReport.preconisations || "");
  const title = stateReport.titre_edifice ? `Constat d'état : ${stateReport.titre_edifice}` : "Constat d'état";
  const inner = `<p>Madame, Monsieur,</p>
<p>Veuillez trouver ci-joint le rapport établi à la suite de la visite de votre monument historique réalisée le ${
    stateReport.date_visite
      ? new Date(stateReport.date_visite).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : ""
  }.
</p>

<p>Le constat réalisé lors de cette visite, accompagné de la couverture photographique établie à cette occasion, n'est que visuel. Il rend compte de l'état apparent du bien protégé, sans mise en œuvre d'aucune technologie. Cette visite s’inscrit dans le cadre de la vérification périodique de l’état des monuments historiques et des conditions de leur conservation de façon que leur pérennité soit assurée, en application du contrôle scientifique et technique des services chargés des monuments historiques.
Outre l’établissement de l’état de conservation, cette visite permet d’identifier et de prévenir les risques. Les données sont enregistrées dans les applications du ministère de la Culture afin de réaliser les synthèses territoriales et la comparaison dans le temps et de mettre à jour les données existantes et, le cas échéant, la protection juridique.</p>

${
  preconisations?.length
    ? `<p>Le constat joint permet de préconiser les interventions suivantes :</p>

<p>
${preconisations.map(({ preconisation, commentaire }) => {
  return `- ${preconisation}${commentaire ? ` : ${commentaire}` : ""}<br />`;
})}
</p>`
    : ""
}

<p>
Le contrôle scientifique et technique des services exercé par l'État sur les monuments historiques s'exerce tout au long des travaux autorisés
jusqu'à leur achèvement (MH classés <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024241971/">R.621-20</a>  et MH inscrits : <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029694949/">R. 621-65</a> du code du patrimoine).
</p>

<p>
Par ailleurs, il est rappelé que tous les travaux qui affecteraient l’aspect extérieur des immeubles bâtis ou non bâtis
dans les abords de votre monument historique sont soumis à autorisation préalable au titre de l’article L621-32 du code du patrimoine.
</p>
<p>Vous remerciant pour votre accueil, et me tenant à votre disposition pour tout complément,</p>
<b>${user.name}, ${user.email}</b>

<br/><br/>
<p>Pour aller plus loin, consultez le site du ministère de la Culture :</p>
<p>
  - <a href="https://www.culture.gouv.fr/thematiques/monuments-sites/interventions-demarches/travaux-sur-un-objet-un-immeuble-un-espace">Informations sur les procédures de travaux</a>
<br/>
  - <a href="https://www.culture.gouv.fr/thematiques/monuments-sites/acteurs-metiers-formations/les-partenaires/les-maitres-d-aeuvre">Information sur la maîtrise d’œuvre</a>
<br/>
  - <a href="https://www.culture.gouv.fr/catalogue-des-demarches-et-subventions/subvention/etudes-et-travaux-sur-monuments-historiques">Demande de subvention pour études et travaux sur monuments historiques</a>
<br/>
  - <a href="https://www.culture.gouv.fr/thematiques/monuments-sites/interventions-demarches/le-controle-scientifique-et-technique-sur-les-monuments-historiques">Information sur le contrôle scientifique et technique sur les monuments historiques</a>
</p>

<p>
Références réglementaires et ressources :  <br />
- Code du patrimoine, livre VI, R621-18 (MH classés) et R621-63 (MH inscrits)  <br />
- <a href="https://www.legifrance.gouv.fr/download/pdf/circ?id=30077">Circulaire n° 2009-024 du 1er décembre 2009 relative au contrôle scientifique et technique des services de l'État sur la conservation des monuments historiques classés et inscrits</a>  <br />
- <a href="https://www.culture.gouv.fr/thematiques/monuments-sites/ressources/les-essentiels/glossaire-des-termes-relatifs-aux-interventions-sur-les-monuments-historiques">Glossaire des termes relatifs aux interventions sur les monuments historiques</a>  <br />
</p>`;
  return wrapWithDsfrMail({ title, content: inner });
};
