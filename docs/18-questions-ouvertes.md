# 18 — Questions ouvertes

Points que la lecture du code ne permet pas de trancher. La plupart concernent l'environnement de production actuel (VPS géré par Coolify), dont la configuration n'est pas dans le dépôt. **Il faut y répondre avant la bascule** : plusieurs réponses changent le plan de [14 — Migration](14-migration-vers-infra-ministere.md).

Colonne « Comment répondre » : où trouver la réponse. Colonne « Bloquant » : nécessaire au transfert.

## 1. Production actuelle

| # | Question | Comment répondre | Bloquant |
| --- | --- | --- | --- |
| P1 | Quelle est la configuration Coolify exacte : images et étiquettes déployées, variables d'environnement, volumes, domaines du backend, de PowerSync et du stockage objet, déclenchement des déploiements ? | Export de la configuration Coolify | Oui |
| P2 | Le fichier [powersync-config.yaml](../powersync/powersync-config.yaml) du dépôt est-il celui monté en production ? Il pointe sur `http://keycloak:8080/realms/master`. | Coolify, conteneur PowerSync | Oui |
| P3 | Quel est le realm Keycloak de production, son émetteur (`iss`), la durée des jetons et des sessions hors ligne, la politique de mot de passe, la protection force brute, le thème actif ? La console « compte » est-elle accessible aux agents ? | Export du realm | Oui |
| P4 | Comment `keycloak-theme.jar` est-il monté ? Aucun fichier Compose ne le fait. | Coolify | Non |
| P5 | Quelle version de PostgreSQL tourne en production ? `wal_level`, `max_slot_wal_keep_size` ? | `SHOW` sur la base | Oui |
| P6 | ~~La publication contient-elle `constat_validation` ?~~ **Réponse : non.** Sans effet, car le frontend n'utilise pas cette table. Reste à vérifier que le reste de la publication correspond aux migrations. | `SELECT * FROM pg_publication_tables WHERE pubname = 'powersync'` | Oui |
| P7 | Comment la production a-t-elle été initialisée pour les migrations 0000 et 0001 ? | Table `drizzle.__drizzle_migrations` | Oui |
| P8 | ~~Quel stockage objet ?~~ **Réponse : Scaleway Object Storage.** Restent à relever : région, nom du bucket, politique d'accès et règles CORS. | Console Scaleway ou `aws s3api get-bucket-cors` | Oui |
| P9 | ~~Quel fournisseur SMTP ?~~ **Réponse : Scaleway Transactional Email.** Restent à relever : port et mode TLS, domaine d'envoi (SPF, DKIM, DMARC). La politique de confidentialité, qui cite Brevo et OVH, est à corriger. | Variables `EMAIL_*`, console Scaleway | Oui |
| P10 | Quelle instance Sentry est utilisée, avec quelle rétention ? Faut-il purger les événements contenant des jetons et mots de passe ? | Compte Sentry | Non, mais urgent |
| P11 | `NODE_ENV` est-il défini en production ? | Variables d'environnement | Non |
| P12 | ~~Des sauvegardes existent-elles ?~~ **Réponse : oui, quotidiennes, stockées sur S3.** Restent à préciser : ce qui est sauvegardé (base applicative, base Keycloak, bucket de fichiers ?), l'outil, la rétention, le lieu de stockage (le même compte Scaleway que les données ?) et si une restauration a déjà été testée. | Coolify (sauvegardes planifiées) | Oui |
| P13 | Volumétrie : taille de la base, nombre de lignes `pop_objets`, `transactions`, taille du bucket, taille du stockage MongoDB, nombre d'agents actifs ? | Requêtes SQL, MinIO | Oui (dimensionnement) |
| P14 | Quelle version de l'image PowerSync tourne ? Quelle durée d'abonnement des flux à la demande ? | Conteneur | Non |
| P15 | Les branches `development` et `compte-rendu-vif` sont-elles déployées ? Sur quels domaines ? | Coolify | Non |
| P16 | L'ancien domaine `compte-rendu-vif` est-il encore servi ? Qui ajoute le paramètre `?from=crvif` ? | DNS | Non |
| P17 | Un import POP planifié existe-t-il hors du dépôt ? Date du dernier import ? | Coolify, `pop_immeubles` | Non |

## 2. Choix pour la cible

| # | Question | Bloquant |
| --- | --- | --- |
| C1 | Le PostgreSQL du ministère autorise-t-il la **réplication logique** (création d'une publication et d'un slot) ? Sinon il faut une instance dédiée. | Oui |
| C2 | Garde-t-on MongoDB pour PowerSync ou utilise-t-on le stockage PostgreSQL de PowerSync ? | Oui |
| C3 | Garde-t-on Keycloak (transféré tel quel) ou passe-t-on à ProConnect ou à un annuaire ministériel ? Le second demande du développement. | Oui |
| C4 | Le stockage S3 du ministère accepte-t-il les dépôts directs depuis les navigateurs et des URL pré-signées lisibles depuis Internet (destinataires externes) ? | Oui |
| C5 | Les domaines `app.patrinotes.beta.gouv.fr` et celui du backend sont-ils conservés ? Changer le domaine du frontend fait perdre les données locales non synchronisées ; changer celui du backend casse les liens envoyés depuis moins de 90 jours. | Oui |
| C6 | Quelle forge et quel registre d'images : GitHub et `ghcr.io`, ou outils du ministère ? | Oui |
| C7 | Quel outil de supervision et de collecte des journaux ? Quelle instance Matomo ? | Non |
| C8 | Quels RPO et RTO sont attendus ? | Non |
| C9 | Quelles corrections de sécurité de [16](16-risques-et-dette-technique.md) sont exigées avant homologation ? | Oui |
| C10 | La dictée vocale (audio envoyé à Google sous Chrome) et le fond de carte OpenFreeMap (non étatique) sont-ils acceptables ? | Non |

## 3. Fonctionnel

| # | Question |
| --- | --- |
| F2 | Le changement de service libre (`/api/change-service`) est-il voulu ? |
| F3 | La modification des paramètres d'un service par n'importe quel membre est-elle voulue ? |
| F4 | Les différences de calcul « abandonné » entre CR (colonne `pdf`) et constats (`attachment_id`) sont-elles voulues ? |
| F5 | Les immeubles sans `last_image_check_at` sont-ils volontairement exclus de la récupération des photos ? |
| F6 | Les tables `pictures` et `merimee` peuvent-elles être supprimées ? |
| F7 | La réinitialisation de mot de passe par `internal_user` (avant Keycloak) est-elle encore utilisée ? |
| F8 | Comment la liste des abonnés à la lettre d'information est-elle transmise à Brevo ? |
| F9 | L'échelle imprimée du plan de situation est-elle bien 1:5000 ? |
| F10 | L'équipe POP accepte-t-elle le *scraping* des pages et l'affichage direct des photos ? |
| F11 | Le texte « lien valable 1 mois » ou la durée réelle de 90 jours : laquelle est la bonne ? |

## 4. Techniques, à vérifier en exécutant le code

| # | Question |
| --- | --- |
| T1 | Les routes de validation lancent des objets `{statusCode}` : renvoient-elles 500 (lecture du code) ou 404 et 410 (attendus par les tests) ? |
| T2 | Une inscription avec des majuscules dans l'e-mail casse-t-elle la connexion (Keycloak met les e-mails en minuscules) ? |
| T3 | `react-pdf-html` 2.1.5 fonctionne-t-il sans le correctif orphelin ? |
| T4 | Les écrans PDF restent-ils bloqués hors ligne ? La génération hors ligne fonctionne-t-elle sur un appareil neuf (polices non pré-cachées) ? |
| T5 | `public/dsfr` (ignoré par Git, utilisé par le manifeste) est-il rempli par `update-icons` ou par `pnpm dsfr` ? |
| T6 | Le workflow de tests e2e fonctionne-t-il sans champ `packageManager` ? |
| T7 | Comment le SDK réessaie-t-il un téléchargement de photo en 404, quand la ligne arrive avant le fichier ? |
