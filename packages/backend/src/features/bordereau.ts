import { Selectable } from "kysely";
import { Database } from "../db/db";

export const createBordereauMailContent = ({ stateReport }: { stateReport: Selectable<Database["state_report"]> }) => {
  return `
  **Madame, Monsieur,**

*Veuillez trouver ci-joint le rapport établi à la suite de la visite de votre monument historique réalisée, en date du ##etat_dresse_le1##.*

*Le constat réalisé lors de cette visite, accompagné de la couverture photographique établie à cette occasion, n'est que visuel. Il rend compte de l'état apparent du bien protégé, sans mise en œuvre d'aucune technologie. Cette visite s’inscrit dans le cadre de la vérification périodique de l’état des monuments historiques et des conditions de leur conservation de façon que leur pérennité soit assurée, en application du contrôle scientifique et technique des services chargés des monuments historiques.*

*Outre l’établissement de l’état de conservation, cette visite permet d’identifier et de prévenir les risques. Les données sont enregistrées dans les applications du ministère de la Culture afin de réaliser les synthèses territoriales et la comparaison dans le temps et de mettre à jour les données existantes et, le cas échéant, la protection juridique.*

*Le constat joint permet de préconiser des interventions suivantes :*

*[conditionnalité selon cases cochées]*

*Travaux d’entretien : les travaux à prévoir ne nécessitent pas de disposer d’une maîtrise d’œuvre spécifique et sont dispensés des autorisations prévues par le code de l’urbanisme ou par le code du patrimoine.*

*Travaux de réparation ou de restauration : les travaux à prévoir nécessitent de disposer d’une maîtrise d’œuvre appropriée et de solliciter les autorisations indispensables.*

*Par ailleurs, je vous rappelle qu’en cas de travaux de réparation ou de restauration, le contrôle scientifique et technique des services de l'Etat chargés des monuments historiques s'exerce tout au long des travaux autorisés jusqu'à leur achèvement (MH classés [R.621-20](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024241971/) et MH inscrits : [R. 621-65](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029694949) du code du patrimoine).*

*Vous remerciant pour votre accueil, et me tenant à votre disposition pour tout complément,*

*##par## »*

**Pour aller plus loin, consultez le site du ministère de la Culture :**

- Informations sur les procédures de travaux

https://www.culture.gouv.fr/thematiques/monuments-sites/interventions-demarches/travaux-sur-un-objet-un-immeuble-un-espace

- Information sur la maîtrise d’œuvre

https://www.culture.gouv.fr/thematiques/monuments-sites/acteurs-metiers-formations/les-partenaires/les-maitres-d-aeuvre

- Demande de subvention pour études et travaux sur monuments historiques

https://www.culture.gouv.fr/catalogue-des-demarches-et-subventions/subvention/etudes-et-travaux-sur-monuments-historiques

- Demandes d’autorisations et déclarations préalables pour les travaux sur monuments historiques

(lien à venir)

- Information sur le contrôle scientifique et technique sur les monuments historiques

https://www.culture.gouv.fr/thematiques/monuments-sites/interventions-demarches/le-controle-scientifique-et-technique-sur-les-monuments-historiques

**Références réglementaires et ressources :**

- Code du patrimoine, livre VI, R621-18 (MH classés) et R621-63 (MH inscrits)
- [Circulaire n° 2009-024 du 1er décembre 2009 relative au contrôle scientifique et technique des services de l'État sur la conservation des monuments historiques classés et inscrits](https://www.legifrance.gouv.fr/download/pdf/circ?id=30077)
- [Glossaire des termes relatifs aux interventions sur les monuments historiques](https://www.culture.gouv.fr/thematiques/monuments-sites/ressources/les-essentiels/glossaire-des-termes-relatifs-aux-interventions-sur-les-monuments-historiques)
  
  `;
};
