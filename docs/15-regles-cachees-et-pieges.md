# 15 — Règles implicites et pièges

Ce document rassemble les **règles qu'on ne voit pas en lisant les noms des fichiers** : conventions, constantes, cas particuliers, dépendances d'ordre et comportements surprenants. Elles ont été relevées en lisant le code ; chacune renvoie au document qui la détaille. Les défauts qui en découlent sont évalués dans [16 — Risques et dette technique](16-risques-et-dette-technique.md).

> Avant de modifier une partie du code, lisez la section qui la concerne. La plupart de ces règles ne sont protégées par aucun test.

## 1. Identité et authentification

| # | Règle | Conséquence | Détail |
| --- | --- | --- | --- |
| A1 | **L'utilisateur est identifié par son e-mail**, pas par l'identifiant Keycloak (`sub`), qui n'est pas stocké. Le backend et les règles PowerSync font correspondre le claim `email` avec `user.email`. | La comparaison tient compte de la casse : une inscription avec des majuscules peut casser la connexion (à confirmer). Changer un e-mail dans Keycloak coupe le lien avec les données. | [05](05-authentification-securite.md), [08](08-synchronisation-hors-ligne.md) |
| A2 | **Le navigateur ne parle jamais à Keycloak.** La connexion passe par `POST /api/login-user`, que le backend transforme en *password grant* avec `scope=offline_access`. Le *refresh token* est donc un jeton **hors ligne** de longue durée. | La page de connexion Keycloak (thème DSFR) n'est presque jamais affichée. Passer à ProConnect demande du développement. | [05](05-authentification-securite.md), [14](14-migration-vers-infra-ministere.md) |
| A3 | Le backend **ne signe aucun jeton**. `JWT_SECRET`, `JWT_REFRESH_SECRET`, `TOKEN_LIFETIME`, `DATAGOUV_API` et `PS_JWT_SECRET` ne servent à rien, mais les quatre premières sont **exigées** par la validation Zod au démarrage. | Le backend et les migrations refusent de démarrer si l'une manque. | [11](11-configuration.md) |
| A4 | Le même *access token* Keycloak sert pour le backend et pour PowerSync (JWKS, audience `account`). | L'émetteur et l'URL JWKS doivent être cohérents partout. La config PowerSync du dépôt pointe sur `http://keycloak:8080/realms/master`. | [08](08-synchronisation-hors-ligne.md) |
| A5 | La route `/api/authenticate` (flux *authorization code*) existe mais **n'est pas utilisée** : il n'y a pas de route de retour côté frontend. Elle crée des comptes **sans vérifier la liste blanche**. | Code mort qui contourne une protection. | [05](05-authentification-securite.md) |
| A6 | **Liste blanche** : vérifiée seulement à l'inscription, comparaison exacte (casse comprise). Retirer une adresse ne désactive pas le compte. | Ce n'est pas un contrôle d'accès continu. | [05](05-authentification-securite.md), [12](12-exploitation-et-supervision.md) |
| A7 | La liste blanche est désactivée seulement si `NODE_ENV=development` est **défini explicitement**. Sans `NODE_ENV`, l'application se comporte comme en production (liste blanche et Sentry actifs). | Le README dit « inactive en développement » ; c'est vrai seulement avec la bonne variable. | [11](11-configuration.md) |
| A8 | **Administrateur** = `internal_user.role = 'admin'`, positionné à la main en SQL. Aucune route ni écran ne permet de nommer un administrateur. Les rôles Keycloak sont ignorés. | Procédure manuelle à documenter pour l'exploitant. | [12](12-exploitation-et-supervision.md) |
| A9 | Le compte Keycloak est créé avec `username` = nom affiché (« Prénom Nom »). | Surprenant dans la console Keycloak. | [05](05-authentification-securite.md) |
| A10 | Jeton absent ou invalide : réponse **403**, jamais 401, sauf sur `/refresh-token`. Côté client, seul un 401 au rafraîchissement déconnecte : hors ligne, la session est conservée. | Voulu pour le mode hors ligne. | [03](03-frontend-pwa.md) |
| A11 | La **déconnexion** ne vide ni la base locale, ni la file d'écritures, ni les fichiers, et ne révoque pas le jeton hors ligne. | Sur un poste partagé, les écritures en attente de A partent avec le jeton de B. | [08](08-synchronisation-hors-ligne.md) |
| A12 | La réinitialisation de mot de passe passe par `internal_user` (jeton UUID haché en MD5, 24 h, usage unique). | Un utilisateur sans ligne `internal_user` ne peut pas réinitialiser son mot de passe. | [05](05-authentification-securite.md) |

## 2. Services, départements et partage

| # | Règle | Conséquence | Détail |
| --- | --- | --- | --- |
| S1 | Au démarrage, le backend crée le service **`no-service`** (`visible=false`) s'il n'existe pas. Les nouveaux comptes y sont rattachés ; le frontend affiche alors une fenêtre bloquante de choix du service. | Ne pas supprimer ce service. | [04](04-backend-api.md) |
| S2 | Le partage se fait **par service** : tous les agents d'un service voient tous ses comptes-rendus et constats. Les droits d'édition (créateur, rédacteur, délégation) ne sont vérifiés **que dans l'interface**. | Le service n'est pas une frontière de sécurité côté serveur. | [08](08-synchronisation-hors-ligne.md) |
| S3 | `/api/change-service` permet à n'importe quel agent de rejoindre n'importe quel service. `user_dept` est recalculé depuis `service.dept_numbers` (liste séparée par des virgules). Si la liste est vide, **les anciens départements sont conservés**. Les deux écritures ne sont pas dans une transaction. | Les départements décident des monuments POP reçus. | [06](06-modele-de-donnees.md) |
| S4 | `user_settings` est indexé par (utilisateur, service) : changer de service fait « disparaître » les réglages, dont la validation. | — | [04](04-backend-api.md) |
| S5 | Clauses : `service_id = 'ALL'` = clause nationale. Une clause du service **remplace** la clause nationale de même `key` + `value`. Clés : `decision`, `contacts-utiles`, `bonnes-pratiques`, `type-espace`. Aucun script ne crée les clauses nationales. | Elles doivent être reprises depuis la production. | [06](06-modele-de-donnees.md) |
| S6 | Le type de service est **deviné depuis une sous-chaîne** : `id ilike '%udap%'` ou `'%crmh%'` côté statistiques, nom contenant `crmh`, `drac` ou `udap` côté interface. | Un identifiant de service mal nommé fausse les statistiques et l'affichage. | [04](04-backend-api.md), [03](03-frontend-pwa.md) |
| S7 | `suggested_email.email` est **unique au niveau global** : une adresse n'est suggérée qu'au premier service qui l'a utilisée. Les erreurs d'insertion sont ignorées. | — | [06](06-modele-de-donnees.md) |
| S8 | Tout membre d'un service peut modifier les paramètres du service (en-têtes PDF, adresses d'alerte, clauses, services instructeurs). | Aucun rôle « responsable ». | [03](03-frontend-pwa.md) |

## 3. Données et identifiants

| # | Règle | Détail |
| --- | --- | --- |
| D1 | **Tous les identifiants sont du texte généré côté client** : compte-rendu = `report-` + UUID v4, constat et partie visitée = UUID v4, pièces jointes = UUID v7, utilisateur = UUID v7 (backend). La ligne d'un PDF a pour identifiant le **chemin du fichier**. `sent_email` et `suggested_email` réutilisent le même UUID. Les `pop_*` ont pour identifiant la référence POP. | [06](06-modele-de-donnees.md) |
| D2 | Seulement 15 clés étrangères ; la plupart des liens sont **logiques**. Presque aucun index secondaire. | [06](06-modele-de-donnees.md) |
| D3 | Dates en `timestamp` **sans fuseau** (UTC « naïf »). Certaines dates sont du **texte** (`constat_validation.created_at`, `token_expires_at`). Aucune colonne `updated_at`. | [06](06-modele-de-donnees.md) |
| D4 | **« Envoyé » = `attachment_id IS NOT NULL`**. Il n'y a pas de colonne de statut. Un constat en attente de validation ou refusé compte donc comme envoyé dans les statistiques. | [06](06-modele-de-donnees.md), [04](04-backend-api.md) |
| D5 | Suppression **logique** : `disabled = 1` pour les CR et constats (l'interface parle pourtant de suppression « irréversible »), `is_deprecated` ou `is_ignored` pour les pièces jointes. | [06](06-modele-de-donnees.md) |
| D6 | Un nouveau constat est créé `disabled=1`, `version=2`. Il n'apparaît qu'une fois un monument choisi. Les brouillons abandonnés restent cachés. | [03](03-frontend-pwa.md) |
| D7 | Formats sérialisés **sans échappement** : `preconisations` = `opt:commentaire/opt` encodé URI, `mandatory_emails` = `SERVICE:email;…`, listes d'e-mails séparées par `,` ou `;`, `personnes_presentes` séparées par `\n`, `coordonnees` = `"lat,lng"`, `reference_cadastrale` = `"SEC NUM;…"`, ancien `attachment_id` avec plusieurs identifiants séparés par `;`. | [06](06-modele-de-donnees.md) |
| D8 | Coordonnées stockées en `lat,lng`, alors que MapLibre et l'API Adresse utilisent `[lng, lat]` : l'inversion est faite à la main à chaque endroit. | [09](09-documents-pdf-cartes-emails.md) |
| D9 | Les clés de stockage ont un sens : `<parent>/images/<uuidv7>.jpg` pour les photos, `<partie>/localisation/<uuid>.jpg` pour les extraits de carte. **Le segment `/localisation/` sert à reconnaître ces images.** En base, les clés sont stockées **sans** le préfixe `attachment/`, sauf dans `attachment_redirection.s3_key`. | [07](07-donnees-externes-et-stockage.md) |
| D10 | Rien n'est jamais supprimé du stockage objet (`deleteFile` n'est pas implémenté). Chaque envoi crée un nouveau PDF. | [07](07-donnees-externes-et-stockage.md) |
| D11 | Les clés de stockage local du navigateur gardent le préfixe `crvif` (ancien nom). **Ne pas les renommer** sous peine de déconnecter tout le monde. | [03](03-frontend-pwa.md) |

## 4. Synchronisation

| # | Règle | Détail |
| --- | --- | --- |
| Y1 | La publication `powersync` est créée **vide** par `db/init`, qui ne s'exécute que sur un volume Docker neuf. Les tables y sont ajoutées par des `ALTER PUBLICATION` écrits **à la main** dans les migrations. Sur une base gérée, il faut la créer avant la première migration. | [08](08-synchronisation-hors-ligne.md), [14](14-migration-vers-infra-ministere.md) |
| Y2 | Toute nouvelle table ou colonne visible du frontend demande **trois** changements : migration avec `ALTER PUBLICATION`, [sync-config.yaml](../powersync/sync-config.yaml), [AppSchema.ts](../packages/frontend/src/db/AppSchema.ts). Les modifications doivent rester **compatibles** avec les anciennes versions de l'application en cache, qui continuent d'envoyer des écritures. | [08](08-synchronisation-hors-ligne.md) |
| Y3 | `constat_validation` est lue par les règles de synchro mais **n'est pas dans la publication**, ni en migration ni en production (confirmé). Sans effet : le frontend ne l'utilise pas. `pop_images` et `state_report_sent_email` sont dans le schéma local mais jamais synchronisées. `user.job` est déclaré localement mais pas sélectionné. | [08](08-synchronisation-hors-ligne.md) |
| Y4 | Les pièces jointes ne se synchronisent que si `is_deprecated = 0`. Une valeur **NULL** n'est jamais synchronisée (pas de valeur par défaut en base ; c'est le cas des lignes recopiées par la migration 0026). | [06](06-modele-de-donnees.md) |
| Y5 | Les métadonnées des pièces jointes passent par des flux **à la demande**, à l'ouverture d'un document en ligne. Les photos d'un document jamais ouvert en ligne sont indisponibles hors ligne. | [08](08-synchronisation-hors-ligne.md) |
| Y6 | Le client envoie **une requête HTTP par opération**, dans l'ordre. En cas d'erreur HTTP, tout le lot est rejoué plus tard ; un `PUT` est appliqué comme un simple `INSERT`, donc un rejeu échoue. En cas d'erreur SQL, le backend répond **HTTP 200** avec `success:false` et le client **abandonne** l'opération. | [08](08-synchronisation-hors-ligne.md) |
| Y7 | Toute opération est d'abord copiée **en entier** dans la table `transactions` (jamais purgée, colonne `error` jamais remplie). | [04](04-backend-api.md) |
| Y8 | Conflits : **la dernière écriture reçue par le serveur gagne**, colonne par colonne. Les formulaires envoient les champs modifiés après 500 ms sans frappe. Les changements distants sont fusionnés dans le formulaire, sauf dans le champ en cours de saisie. | [03](03-frontend-pwa.md) |
| Y9 | Ordre d'envoi d'une photo : compression, puis écriture du fichier en local, **puis** insertion de la ligne. Le dépôt S3 ne vérifie pas le code HTTP : un échec est marqué « synchronisé ». | [08](08-synchronisation-hors-ligne.md) |
| Y10 | `FORCE_REFETCH_POP=true` réécrit toutes les lignes POP : **tous les clients re-téléchargent** le référentiel. | [08](08-synchronisation-hors-ligne.md) |
| Y11 | « Réinitialiser les données locales » efface toute la base IndexedDB et le `localStorage`, **écritures non envoyées comprises**, sans confirmation. | [03](03-frontend-pwa.md) |
| Y12 | Pas de mode multi-onglets sur iOS (pas de `SharedWorker`). | [03](03-frontend-pwa.md) |

## 5. Constats d'état, alertes et validation

| # | Règle | Détail |
| --- | --- | --- |
| C1 | Champs obligatoires pour finaliser (version 2) : nature de la visite, date, rédacteur, propriétaire, état général ; la version 1 exige aussi la proportion. Les alertes renseignées et à envoyer doivent avoir leurs adresses obligatoires. Un téléversement en cours ou en échec non écarté bloque la finalisation. | [03](03-frontend-pwa.md) |
| C2 | Un constat devient **en lecture seule** dès que `attachment_id` est renseigné, sauf si `validation_status = 'declined'`. Seul son créateur peut le modifier. Un CR est modifiable par son créateur, son rédacteur, ou un délégataire du créateur. | [09](09-documents-pdf-cartes-emails.md) |
| C3 | Une partie est « visitée » si : (`etat_general` **et** proportion) **ou** niveau de dégradation **ou** photos **ou** repères de localisation. Les 8 parties par défaut sont reconnues par leur **libellé exact**. | [09](09-documents-pdf-cartes-emails.md) |
| C4 | Correspondance alerte → service destinataire **codée en dur** : Péril → CRMH, Abords → UDAP, Objets → CAOA + CRMH, Archéologie → SRA, Site → DREAL, Biodiversité → OFB, Sécurité → Mairie. Les adresses sont recopiées depuis `service.courriel_*` à la création de l'alerte. **La colonne `courriel_mairie` n'existe pas** : l'alerte Sécurité demande toujours une saisie manuelle. | [09](09-documents-pdf-cartes-emails.md) |
| C5 | Le type d'alerte est stocké sous forme de **libellé français**. Renommer un libellé casse les données existantes. | [09](09-documents-pdf-cartes-emails.md) |
| C6 | « Afficher dans le PDF » (`show_in_report`) et « Envoyer par courriel » (`should_send`) sont **indépendants**. La phrase « Alerte transmise par courriel » du PDF dépend seulement de `should_send` de la première alerte du groupe. | [09](09-documents-pdf-cartes-emails.md) |
| C7 | Les alertes partent **au moment de la soumission**, **avant** la décision du validateur, **une seule fois** (`alerts_sent`), même si l'envoi a échoué. Les photos sont intégrées au courriel sans limite de taille totale. | [09](09-documents-pdf-cartes-emails.md) |
| C8 | Validation (« envoi sous-couvert ») : active seulement si `user_settings.validation_enabled` **et** `validation_email` sont renseignés pour le couple (utilisateur, service courant). Jeton UUID valable 7 jours, vérifié **seulement tant que la demande est en attente** : après décision, le lien reste lisible indéfiniment. Un refus rend le constat de nouveau modifiable. | [04](04-backend-api.md), [09](09-documents-pdf-cartes-emails.md) |
| C9 | La question « bilan quinquennal » ne s'affiche **jamais** : la nature de visite est stockée en minuscules et comparée à une valeur avec majuscule. En base c'est un booléen, dans l'interface « Oui »/« Non ». | [06](06-modele-de-donnees.md) |
| C10 | Ouvrir l'aperçu PDF d'un constat **génère et enregistre** le plan de situation (effet de bord). Image IGN 640 × 480, zoom calculé pour 1:5000 à 96 DPI, délai maximal 15 s. Hors ligne, un bandeau prévient et le constat peut partir sans plan. Affiché à une hauteur fixe dans le PDF, l'échelle imprimée est probablement proche de 1:10 000 (à vérifier). | [09](09-documents-pdf-cartes-emails.md) |

## 6. Comptes-rendus et documents

| # | Règle | Détail |
| --- | --- | --- |
| R1 | La mise en page retouchée d'un CR (`pdf_snapshot`) n'est réutilisée que si le CR n'a pas changé depuis. **Toute modification du formulaire réinitialise la mise en page.** | [09](09-documents-pdf-cartes-emails.md) |
| R2 | Dupliquer un CR envoyé recopie `attachment_id` : la copie apparaît « Envoyée ». Dupliquer un constat recopie les parties, pas les photos ni les alertes. | [03](03-frontend-pwa.md) |
| R3 | Les e-mails contiennent un **lien**, pas le PDF : `BACKEND_URL/attachment/:id/:nom`, sans authentification, **90 jours** (410 ensuite), alors que le texte de l'e-mail annonce « 1 mois ». L'identifiant est un base62 d'un entier aléatoire de 48 bits. Après validation acceptée, les destinataires reçoivent un lien S3 pré-signé direct de **7 jours**. | [07](07-donnees-externes-et-stockage.md) |
| R4 | L'expéditeur est toujours ajouté aux destinataires. | [04](04-backend-api.md) |
| R5 | `GET /api/pdf/report` renvoie le **premier** PDF trouvé, sans tri : l'export ZIP peut contenir une ancienne version. Le nom de fichier d'un constat utilise la date du téléchargement. | [09](09-documents-pdf-cartes-emails.md) |
| R6 | Lignes d'en-tête du PDF découpées **par nombre de mots** (Marianne : 1/3/reste, DRAC : 4/reste, service : 3/reste). Le téléphone d'un CR est formaté en supposant 9 chiffres sans le 0 initial. | [03](03-frontend-pwa.md), [09](09-documents-pdf-cartes-emails.md) |
| R7 | Photos compressées à 1 Mo et 1920 px, **EXIF et GPS retirés**. Un dessin est incrusté dans un nouveau JPEG ; l'original est marqué obsolète mais conservé. | [09](09-documents-pdf-cartes-emails.md) |
| R8 | Les polices Marianne ne sont pas dans le pré-cache du *service worker* : générer un PDF hors ligne sur un appareil neuf peut échouer (à confirmer). | [09](09-documents-pdf-cartes-emails.md) |

## 7. Exécution, configuration et déploiement

| # | Règle | Détail |
| --- | --- | --- |
| E1 | La commande du conteneur backend est `pnpm migration:up;pnpm backend start` : à cause du `;`, **une migration en échec n'empêche pas le démarrage**. Avec plusieurs réplicas, les migrations s'exécuteraient en parallèle. | [10](10-infrastructure-et-deploiement.md) |
| E2 | Les migrations utilisent les variables `POSTGRES_*` (pas `DATABASE_URL`) et chargent **tout** le schéma d'environnement du backend. | [11](11-configuration.md) |
| E3 | Le backend doit tourner avec `packages/backend` comme répertoire courant : les logos des e-mails sont lus dans `./public`, et le `.env` est chargé depuis `../../.env`. | [04](04-backend-api.md) |
| E4 | TLS vers PostgreSQL **désactivé en dur** (backend, Drizzle, PowerSync `sslmode: disable`). | [11](11-configuration.md) |
| E5 | Le frontend de production est servi par **`vite preview`**. La liste `preview.allowedHosts` de [vite.config.ts](../packages/frontend/vite.config.ts) est codée en dur : **un nouveau domaine exige une modification du code et une reconstruction**, sinon réponse 403. | [10](10-infrastructure-et-deploiement.md) |
| E6 | Les variables `VITE_*` sont lues **au démarrage du conteneur** et écrites dans `env.js` (public, non échappé, non pré-caché, servi en *NetworkFirst*). Si une seule variable obligatoire manque (y compris les trois `VITE_AUTH_*` inutilisées par le frontend), la configuration entière est ignorée **sans erreur visible**. | [03](03-frontend-pwa.md), [11](11-configuration.md) |
| E7 | Mise à jour de l'application : *skipWaiting* + *clientsClaim*, rechargement **silencieux**, même pendant une saisie. En cas de vieux *chunk* introuvable : 1er essai = rechargement, 2e = désinscription du *service worker* et vidage des caches, puis abandon (clé `chunk-reload-attempt` en `sessionStorage`). | [03](03-frontend-pwa.md), [12](12-exploitation-et-supervision.md) |
| E8 | Premier lancement sans `crvif/version` en `localStorage` : suppression de l'authentification de l'ancienne application, puis rechargement. | [03](03-frontend-pwa.md) |
| E9 | L'URL du backend est mémorisée en IndexedDB au premier lancement (`apiStore.url`). | [08](08-synchronisation-hors-ligne.md) |
| E10 | Le stockage objet doit être **joignable depuis les navigateurs** (dépôt direct par URL pré-signée, CORS) avec le même nom d'hôte que celui utilisé par le backend. Style « path », région `us-east-1` codés en dur. | [07](07-donnees-externes-et-stockage.md) |
| E11 | Les données hors ligne et l'installation PWA sont liées à l'**origine** : changer le domaine du frontend fait perdre les écritures non synchronisées des agents. C'est la raison d'être de [crvif-redirection](../crvif-redirection). | [14](14-migration-vers-infra-ministere.md) |
| E12 | Import POP : `pop_immeubles` est toujours mis à jour, `pop_objets` **seulement si la table est vide**. Les notices supprimées de POP ne le sont jamais ici. Les immeubles importés après la migration 0007 (`last_image_check_at` NULL) ne reçoivent jamais de photo. Avec `FORCE_REFETCH_POP=true`, l'import **bloque le démarrage**. Aucune tâche planifiée n'existe. | [07](07-donnees-externes-et-stockage.md) |
| E13 | Les fichiers importés sont `merimee.csv` et `palissy.csv` (séparateur `|`), et non `monuments.csv` et `mobilier.csv` comme l'indique le README. Les en-têtes, mis en minuscules, doivent correspondre **exactement** aux noms des colonnes ; les colonnes inconnues sont ignorées sans message. | [07](07-donnees-externes-et-stockage.md) |
| E14 | Le script `pnpm client:generate` (OpenAPI puis `api.gen.ts`) n'est vérifié par aucune CI : à relancer à chaque changement de route. | [04](04-backend-api.md) |
| E15 | Les scripts [clear-db.sh](../scripts/clear-db.sh) et [fill-db.sh](../scripts/fill-db.sh) supposent un projet Compose nommé `compte-rendu-vif` et une base `patrinotes-dev`. | [06](06-modele-de-donnees.md) |
| E16 | Les tests e2e **vident les tables et suppriment les comptes Keycloak** : ne jamais pointer `.env.test` vers une vraie infrastructure. | [13](13-tests-et-qualite.md) |
