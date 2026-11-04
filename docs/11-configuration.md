# 11 — Référence de configuration

Ce document recense **toutes** les variables d'environnement lues par Patrinotes et ses dépendances, composant par composant, ainsi que les paramètres codés en dur qui devraient être configurables. Il a été établi en parcourant `process.env`, `import.meta.env`, `window.ENV`, les schémas de validation, les fichiers Compose, la configuration PowerSync, le gabarit de realm Keycloak et les scripts.

> [!CAUTION]
> Aucune valeur secrète ne figure ici. Les exemples sont fictifs ou issus de [.env.test](../.env.test) (valeurs de test publiques). Les valeurs de production sont dans Coolify (non accessible depuis le dépôt).

Légende : **Obl.** = obligatoire (le composant refuse de démarrer sans) ; **Secret** = à stocker dans un coffre (Vault, secrets Kubernetes…), jamais dans le dépôt.

## 1. Mécanismes de chargement

| Composant | Mécanisme | Fichier |
| --- | --- | --- |
| Backend | `dotenv` + `dotenv-expand` chargent `../../.env` (ou `../../.env.test` si `NODE_ENV=test`), **chemin relatif au répertoire courant** (`packages/backend` avec `pnpm --filter`). Puis validation **Zod** stricte de `process.env` : une variable obligatoire absente fait planter le processus au démarrage. Les variables déjà présentes dans l'environnement ont priorité sur le fichier. | [envVars.ts](../packages/backend/src/envVars.ts) |
| Migrations | `drizzle-kit` charge [drizzle.config.ts](../packages/backend/drizzle.config.ts), qui importe `envVars.ts` : **même validation complète que le backend**. | |
| Frontend (développement) | Vite lit les variables `VITE_*` depuis la racine du monorepo (`envDir: "../.."`). | [vite.config.ts#L72](../packages/frontend/vite.config.ts#L72) |
| Frontend (production) | Au démarrage du conteneur, [createEnvFile.ts](../packages/frontend/scripts/createEnvFile.ts) écrit dans `dist/env.js` **toutes** les variables `VITE_*` de l'environnement (`window.ENV = {…}`). Le code lit `window.ENV` quand `import.meta.env.PROD` est vrai. Validation Zod **non bloquante** : en cas d'erreur, un message `Error parsing env vars` est écrit dans la console et `ENV` vaut `{}` (l'application démarre mais tous les appels échouent). | [envVars.ts](../packages/frontend/src/envVars.ts) |
| PowerSync | Fichier YAML avec la balise `!env NOM`. | [powersync-config.yaml](../powersync/powersync-config.yaml) |
| Keycloak (dev/test) | Variables `KC_*` natives + `envsubst` sur le gabarit de realm au démarrage. | [keycloak-entrypoint.sh](../tests/keycloak-entrypoint.sh), [realm-template.json](../tests/realm-template.json) |
| Docker Compose | Interpolation `${VAR}` depuis le `.env` racine (ou `--env-file ./.env.test`). | [docker-compose.yaml](../docker-compose.yaml) |
| Tests E2E | [playwright.config.ts](../playwright.config.ts) charge `.env.test` et force `NODE_ENV=test`. | |

> [!WARNING]
> **Préfixe `VITE_` = public.** Toute variable `VITE_*` présente dans l'environnement du conteneur frontend est publiée dans `env.js`. Le backend utilise aussi des variables nommées `VITE_AUTH_*` : c'est sans danger tant qu'elles ne contiennent pas de secret. **Ne jamais nommer un secret `VITE_…`.** Les valeurs sont écrites entre guillemets sans échappement : pas de `"` ni de retour à la ligne dans une valeur.

## 2. Backend (`packages/backend`)

Schéma de référence : [envVars.ts#L24-L61](../packages/backend/src/envVars.ts#L24-L61).

### 2.1 Base de données

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `DATABASE_URL` | Oui | — | Chaîne de connexion utilisée **à l'exécution** (pool `pg`). Le code force `ssl: false` ([db.ts#L6-L9](../packages/backend/src/db/db.ts#L6-L9)) ; l'effet d'un `?sslmode=require` dans l'URL est à vérifier. | `postgresql://patrinotes:***@pg:5432/patrinotes` | **Oui** (mot de passe) |
| `POSTGRES_HOST` | Oui | — | Hôte utilisé **uniquement par les migrations** `drizzle-kit` (TLS désactivé en dur). | `pg` | Non |
| `POSTGRES_PORT` | Non | `5432` | Port pour les migrations (et port publié du conteneur `pg` en dev). | `5432` | Non |
| `POSTGRES_USER` | Oui | — | Utilisateur pour les migrations ; en Compose, aussi superutilisateur de l'instance **et** utilisateur Keycloak. | `postgres` | Non |
| `POSTGRES_PASSWORD` | Oui | — | Mot de passe associé. | — | **Oui** |
| `POSTGRES_DB` | Oui | — | Nom de la base applicative. | `patrinotes` | Non |

> [!IMPORTANT]
> `DATABASE_URL` et `POSTGRES_*` décrivent la **même base** par deux moyens différents. Toute divergence (par exemple après une migration d'infrastructure) fait migrer une base et servir une autre.

### 2.2 URL publiques et serveur HTTP

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `PORT` | Non | `3001` | Port d'écoute de Fastify (sur `0.0.0.0`). | `3001` | Non |
| `FRONTEND_URL` | Oui | — | URL publique du frontend, utilisée dans les liens envoyés par courriel (réinitialisation de mot de passe, validation de constat, lien vers un constat) et dans le `redirect_uri` du flux *authorization code* (non utilisé par le frontend actuel). | `https://app.patrinotes.beta.gouv.fr` | Non |
| `BACKEND_URL` | Oui | — | URL publique du backend, utilisée pour fabriquer les liens de pièces jointes des courriels : `${BACKEND_URL}/attachment/<id>/<nom>` ([pdfRoutes.tsx#L41](../packages/backend/src/routes/pdfRoutes.tsx#L41)). Ces liens restent valables **90 jours** : changer cette URL casse les liens déjà envoyés. | `https://api.patrinotes.example` (à confirmer) | Non |
| `NODE_ENV` | Non | `development` (dans `ENV`) | `development` désactive la liste blanche d'inscription et Sentry ; `test` charge `.env.test`. Toute autre valeur, **ou l'absence de valeur**, est traitée comme la production par `isProd`. `pnpm backend start` force `production`. | `production` | Non |
| `DEBUG` | Non | `cr-vif:*` | Filtre des journaux du module `debug` (espace de noms `cr-vif`, ancien nom du produit). | `cr-vif:*` | Non |

### 2.3 Authentification (Keycloak)

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `VITE_AUTH_URL` | Oui | — | URL de base de Keycloak **telle que le backend l'appelle**. Sert à construire : l'URL de jeton, l'URL JWKS, l'**émetteur attendu** (`iss` = `${VITE_AUTH_URL}/realms/${VITE_AUTH_REALM}`), l'audience de l'assertion client et l'URL de l'API d'administration. | `http://keycloak:8080` (déduit, à confirmer) | Non |
| `VITE_AUTH_REALM` | Oui | — | Realm Keycloak. Les tests utilisent **`master`** ; la configuration PowerSync du dépôt aussi. | `master` | Non |
| `VITE_AUTH_CLIENT_ID` | Oui | — | Client OIDC de l'application (connexion par mot de passe, rafraîchissement). | `patrinotes` | Non |
| `AUTH_CLIENT_SECRET` | Oui | — | Secret du client applicatif. Sert à **signer en HS256** l'assertion client (`client-secret-jwt`) et est aussi envoyé en clair dans la requête `grant_type=password`. | — | **Oui** |
| `AUTH_ADMIN_CLIENT_ID` | Oui | — | Client de service (*client credentials*) disposant des rôles `manage-users`, `view-users`, `query-users` : création de comptes, réinitialisation de mot de passe, suppression (tests). | `patrinotes-admin` | Non |
| `AUTH_ADMIN_CLIENT_SECRET` | Oui | — | Secret du client d'administration. **Donne le droit de gérer tous les utilisateurs du realm.** | — | **Oui** |

### 2.4 Courriel (SMTP)

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `EMAIL_HOST` | Oui | — | Serveur SMTP (Scaleway TEM en production). | `smtp.tem.scaleway.com` (exemple) | Non |
| `EMAIL_PORT` | Non | `465` | Port SMTP. L'option `secure` de Nodemailer n'est **pas** renseignée ([mail.ts#L14-L21](../packages/backend/src/features/mail.ts#L14-L21)) : le comportement TLS sur le port 465 est à valider sur le relais du ministère (587 + STARTTLS est le cas le plus sûr). | `587` | Non |
| `EMAIL_USER` | Oui | — | Identifiant SMTP (authentification toujours envoyée). | — | Non |
| `EMAIL_PASSWORD` | Oui | — | Mot de passe SMTP. | — | **Oui** |
| `EMAIL_EMITTER` | Oui | — | Adresse d'expédition (`From`) de tous les courriels. Doit être autorisée par SPF/DKIM du domaine. | `noreply@patrinotes.beta.gouv.fr` (à confirmer) | Non |

### 2.5 Stockage objet (S3 / MinIO)

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `MINIO_URL` | Oui | — | Point d'accès S3. **Doit être joignable par les navigateurs** : les URL présignées (envoi PUT et lecture GET) sont construites sur ce nom d'hôte. Adressage par chemin (`forcePathStyle`), région `us-east-1` en dur. | `https://s3.patrinotes.example` | Non |
| `MINIO_BUCKET` | Oui | — | Nom du bucket. Les clés sont préfixées `attachment/`. | `patrinotes` | Non |
| `MINIO_ACCESS_KEY_ID` | Oui | — | Clé d'accès S3 de l'application. | — | **Oui** (selon la politique) |
| `MINIO_SECRET_KEY` | Oui | — | Clé secrète S3. | — | **Oui** |

### 2.6 Données patrimoniales et divers

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `FORCE_REFETCH_POP` | Non | `false` | Si `true` (chaîne insensible à la casse), au démarrage : téléchargement de `merimee.csv` et `palissy.csv` depuis `ministere-culture.s3.sbg.io.cloud.ovh.net`, import dans `pop_immeubles` (toujours) et `pop_objets` (**seulement si la table est vide**). Bloque l'ouverture du port pendant l'import. À remettre à `false` ensuite. | `false` | Non |
| `SENTRY_DSN` | Non | — | DSN Sentry du backend. Absent → Sentry désactivé. `tracesSampleRate: 1.0` en dur. Les erreurs envoyées incluent le corps des requêtes ([router.ts#L60](../packages/backend/src/router.ts#L60)) : données personnelles possibles. | — | Sensible |
| `DATAGOUV_API` | **Oui** | — | **Obligatoire dans le schéma mais jamais utilisée** par le code. À renseigner avec n'importe quelle valeur (le test utilise `https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets`). | idem | Non |
| `JWT_SECRET` | **Oui** | — | **Obligatoire mais inutilisée par le backend** (reliquat de l'ancienne authentification maison). En Compose, sa valeur est transmise à PowerSync sous le nom `PS_JWT_SECRET`, que la configuration PowerSync n'utilise pas non plus. | — | Oui (par prudence) |
| `JWT_REFRESH_SECRET` | **Oui** | — | **Obligatoire mais inutilisée.** Reliquat. | — | Oui (par prudence) |
| `TOKEN_LIFETIME` | Non | `60m` | Inutilisée. Reliquat. | — | Non |
| `ASSETS_DIR` | Non | — | Inutilisée (les images des courriels sont lues dans `process.cwd()/public`). | — | Non |

`COLLECTIF_OBJETS_DATASETTE_URL` est commentée dans le schéma mais encore référencée par le fichier mort [_merimee.ts](../packages/backend/src/features/data/_merimee.ts) (importé nulle part).

## 3. Frontend (`packages/frontend`)

Schéma de référence : [envVars.ts#L15-L22](../packages/frontend/src/envVars.ts#L15-L22). Toutes ces variables sont **publiques** et lues **à l'exécution** en production (aucune reconstruction nécessaire pour les changer).

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `VITE_BACKEND_URL` | Oui | — | URL publique de l'API (même valeur que `BACKEND_URL`). | `https://api.patrinotes.example` | Non |
| `VITE_POWERSYNC_URL` | Oui | — | URL publique du service PowerSync (HTTP + WebSocket). | `https://sync.patrinotes.example` | Non |
| `VITE_AUTH_URL` | Oui (schéma) | — | Validée mais **non utilisée** par le frontend. | idem backend | Non |
| `VITE_AUTH_REALM` | Oui (schéma) | — | Validée mais non utilisée. | `master` | Non |
| `VITE_AUTH_CLIENT_ID` | Oui (schéma) | — | Validée mais non utilisée. | `patrinotes` | Non |
| `VITE_SENTRY_DSN` | Non | — | DSN Sentry du navigateur (public par nature). Active aussi la capture des journaux console (`log`, `info`, `warn`, `error`). | — | Non |

Variables spéciales et paramètres de build :

| Variable | Rôle |
| --- | --- |
| `import.meta.env.PROD` | Positionnée par Vite : `false` en `vite dev` (lecture de `import.meta.env`), `true` après `vite build` (lecture de `window.ENV`). |
| `window.APP_VERSION` | Non configurable : écrite dans `dist/version.js` au build ([setVersion.ts](../packages/frontend/scripts/setVersion.ts)). |
| `NODE_ENV` | Utilisée seulement par la librairie embarquée [dsfr-chart](../packages/frontend/dsfr-chart/) (remplacée au build). |

> [!WARNING]
> Bien qu'inutilisées, `VITE_AUTH_URL`, `VITE_AUTH_REALM` et `VITE_AUTH_CLIENT_ID` sont **obligatoires dans le schéma** : s'il en manque une seule, la validation échoue et **toute** la configuration est remplacée par `{}` (y compris `VITE_BACKEND_URL`).

> [!NOTE]
> Une erreur de configuration du frontend **ne bloque pas** son démarrage : vérifier après chaque déploiement le contenu de `https://<frontend>/env.js` et l'absence du message `Error parsing env vars` dans la console du navigateur.

## 4. PowerSync

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `POWERSYNC_CONFIG_PATH` | Oui | — | Chemin du fichier de configuration dans le conteneur. | `/config/config.yaml` | Non |
| `PS_DATABASE_URL` | Oui | — | Connexion de **réplication** à PostgreSQL. L'utilisateur doit avoir l'attribut `REPLICATION` et le droit `SELECT` sur les tables publiées. `sslmode: disable` est fixé dans le YAML. | `postgresql://powersync:***@pg:5432/patrinotes` | **Oui** |
| `PS_PORT` | Oui | — | Port d'écoute. | `8080` | Non |
| `PS_JWT_SECRET` | Non | — | Transmise par Compose (valeur de `JWT_SECRET`) mais **non référencée** dans [powersync-config.yaml](../powersync/powersync-config.yaml) : inutilisée. | — | Oui (par prudence) |

Paramètres **codés en dur** dans le YAML (à externaliser ou adapter pour la cible) : URI MongoDB `mongodb://mongo:27017/powersync_demo` (sans authentification), `jwks_uri` et `issuer` pointant sur `http://keycloak:8080/realms/master`, audience `account`, télémétrie active. Voir [10 § 4.4](10-infrastructure-et-deploiement.md#44-configuration-powersync-versionnée).

> [!IMPORTANT]
> **Cohérence de l'émetteur des jetons.** Le même jeton d'accès Keycloak est vérifié par le backend (émetteur attendu `${VITE_AUTH_URL}/realms/${VITE_AUTH_REALM}`) et par PowerSync (émetteur `client_auth.issuer`). Keycloak calcule l'`iss` à partir de son nom d'hôte (`KC_HOSTNAME`) ou, à défaut, de l'URL appelée. Il faut donc que **`VITE_AUTH_URL`, l'URL publique ou interne de Keycloak et `client_auth.issuer` désignent exactement la même URL**. Sinon : erreurs 403 sur l'API ou refus de connexion PowerSync. Les règles de synchronisation filtrent par `auth.parameter('email')` : le jeton doit contenir la revendication `email`.

## 5. Keycloak

Variables utilisées dans [docker-compose.yaml](../docker-compose.yaml) (mode développement `start-dev`) et dans le gabarit de realm :

| Variable | Obl. | Défaut | Description | Exemple | Secret |
| --- | --- | --- | --- | --- | --- |
| `KC_DB` | Oui | — | Type de base. | `postgres` | Non |
| `KC_DB_URL` | Oui | — | JDBC, base `${KEYCLOAK_DB}` sur la même instance que l'application. | `jdbc:postgresql://pg:5432/keycloak` | Non |
| `KC_DB_USERNAME` | Oui | — | En Compose : `${POSTGRES_USER}` (même compte que l'application). Prévoir un compte dédié en production. | `keycloak` | Non |
| `KC_DB_PASSWORD` | Oui | — | En Compose : `${POSTGRES_PASSWORD}`. | — | **Oui** |
| `KEYCLOAK_DB` | Oui (Compose) | — | Nom de la base Keycloak ; doit correspondre à [1_create_keycloak.sql](../db/init/1_create_keycloak.sql) (`keycloak`). | `keycloak` | Non |
| `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD` | Oui (1er démarrage) | — | Administrateur initial. Noms dépréciés depuis Keycloak 26 au profit de `KC_BOOTSTRAP_ADMIN_USERNAME` / `KC_BOOTSTRAP_ADMIN_PASSWORD` (à vérifier pour la version cible). | `admin` | **Oui** (mot de passe) |
| `KC_HOSTNAME` | Production : oui | — | Nom d'hôte public ; détermine l'`iss` des jetons. En dev : `localhost`. | — | Non |
| `KC_HOSTNAME_PORT` | Non | — | Port (dev). Réutilisé par `envsubst` dans l'attribut `jwks.url` du client applicatif. | `3013` | Non |
| `KC_HOSTNAME_STRICT`, `KC_HOSTNAME_STRICT_HTTPS`, `KC_HOSTNAME_STRICT_BACKCHANNEL` | Non | — | `false` en dev. À revoir en production. | `false` | Non |
| `KC_HTTP_ENABLED` | Non | — | `true` (HTTP derrière proxy). | `true` | Non |
| `KC_HEALTH_ENABLED`, `KC_METRICS_ENABLED` | Non | — | Sondes `/health/ready` et métriques sur le port de gestion **9000**. | `true` | Non |
| `KC_LOG_LEVEL` | Non | — | Niveau de journalisation. | `info` | Non |
| `AUTH_CLIENT_ID`, `AUTH_CLIENT_SECRET` | Oui (import) | — | Injectés par `envsubst` dans [realm-template.json](../tests/realm-template.json) pour créer le client applicatif (authentification `client-secret-jwt`, *direct access grants* activés). Côté backend, `AUTH_CLIENT_ID` correspond à `VITE_AUTH_CLIENT_ID`. | `patrinotes-test` | Secret : oui |
| `AUTH_ADMIN_CLIENT_ID`, `AUTH_ADMIN_CLIENT_SECRET` | Oui (import) | — | Client d'administration à compte de service, rôles `manage-users`, `view-users`, `query-users`, `manage-authorization` sur `master-realm`. | `patrinotes-admin-test` | Secret : oui |
| `DSFR_THEME_HOME_URL` | Non | vide | Lien d'accueil du thème DSFR ([keycloak-theme.jar](../keycloak-theme.jar)). | `https://app.patrinotes.beta.gouv.fr` | Non |
| `DSFR_THEME_SERVICE_TITLE` | Non | vide | Titre du service affiché par le thème. | `Patrinotes` | Non |
| `DSFR_THEME_BRAND_TOP` | Non | `République<br/>Française` | Bloc-marque du thème. | — | Non |

> [!NOTE]
> Le gabarit de realm sert **aux tests et au développement** ; rien n'indique que la production ait été créée à partir de lui. Les rôles d'administration y sont portés par le client `master-realm`, ce qui n'existe que dans le realm `master`. Si la production utilise un autre realm, les rôles équivalents sont sur le client `realm-management`.

## 6. Infrastructure de développement et de test (Compose)

| Variable | Utilisée par | Description | Dev seulement ? |
| --- | --- | --- | --- |
| `POSTGRES_PORT` | `pg` | Port publié de PostgreSQL. | Oui |
| `MINIO_USER`, `MINIO_PASSWORD` | `minio`, `minio-init` | Compte racine MinIO (`MINIO_ROOT_USER/PASSWORD`). Secret en production si MinIO est conservé. | Non si MinIO conservé |
| `MINIO_SERVER_PORT`, `MINIO_CONSOLE_PORT` | `minio` | Ports publiés (API, console). | Oui |
| `POWERSYNC_PORT` | `powersync` | Port publié. | Oui |
| `KEYCLOAK_PORT` | `keycloak` | Port publié ; injecté dans `KC_HOSTNAME_PORT`. | Oui |
| `ADMINER_PORT` | `adminer` | Port publié d'Adminer. | Oui |
| `SMTP_PORT`, `SMTP_WEB_PORT` | `mailpit` | Ports SMTP et interface web de Mailpit. | Oui |
| `HEALTHCHECK_PORT` | `healthcheck` (test) | Port du point d'attente nginx. | Oui |
| `FRONTEND_PORT`, `BACKEND_PORT`, `DB_PORT`, `MAILPIT_PORT`, `MAILPIT_WEB_PORT` | `.env.test`, specs Playwright | Ports de la pile de test (3010–3019). | Oui |
| `CI` | Playwright, [teardown.ts](../tests/teardown.ts) | Active les relances, `forbidOnly`, et la destruction de la pile en fin de test. | Oui |

## 7. Écarts entre `.env.dist` et le code

[.env.dist](../.env.dist) est le modèle censé être copié en `.env`. Il est **obsolète et incomplet**.

### 7.1 Présentes dans `.env.dist` mais inutilisées

| Variable | Origine probable |
| --- | --- |
| `ELECTRIC_PORT`, `VITE_ELECTRIC_URL` | Ancien moteur de synchronisation **ElectricSQL**, remplacé par PowerSync (voir aussi `.electric_migrations_*` dans [.gitignore](../.gitignore)). |
| `PG_PROXY_PORT`, `PG_PROXY_PASSWORD` | Proxy PostgreSQL d'ElectricSQL. |
| `KEYCLOAK_CLIENT_SECRET` | Remplacée par `AUTH_CLIENT_SECRET`. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_REGION`, `AWS_ENDPOINT` | Remplacées par `MINIO_*`. Le SDK AWS pourrait lire `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` par défaut, mais le client reçoit ses identifiants explicitement ([uploadService.ts#L11-L17](../packages/backend/src/services/uploadService.ts#L11-L17)). |
| `HTTP_PORT` | Remplacée par `PORT`. |
| `COMPOSE_PROFILES` | Aucun profil n'est défini dans les fichiers Compose. |
| `FRONTEND_PORT` | Utilisée seulement par Playwright. |
| `JWT_SECRET` | Exigée par le schéma, mais sans usage fonctionnel (voir § 2.6). |
| `DSFR_THEME_*` | Valides, mais lues par Keycloak et non par l'application ; aucun fichier Compose ne les transmet au conteneur Keycloak. |

### 7.2 Utilisées par le code mais absentes de `.env.dist`

| Variable | Conséquence si absente |
| --- | --- |
| `BACKEND_URL`, `EMAIL_EMITTER`, `AUTH_CLIENT_SECRET`, `AUTH_ADMIN_CLIENT_ID`, `AUTH_ADMIN_CLIENT_SECRET`, `JWT_REFRESH_SECRET`, `DATAGOUV_API` | **Le backend ne démarre pas** (Zod) et les migrations échouent. |
| `VITE_POWERSYNC_URL` | Le frontend démarre mais la synchronisation est impossible. |
| `PS_DATABASE_URL`, `POWERSYNC_PORT` | PowerSync ne démarre pas / port non publié en Compose. |
| `KEYCLOAK_PORT`, `KEYCLOAK_ADMIN`, `KEYCLOAK_ADMIN_PASSWORD`, `KEYCLOAK_DB`, `AUTH_CLIENT_ID` | Keycloak ne démarre pas correctement en Compose. |
| `MINIO_SERVER_PORT`, `MINIO_CONSOLE_PORT`, `SMTP_PORT`, `SMTP_WEB_PORT` | Ports non publiés en Compose. |
| `FORCE_REFETCH_POP`, `DEBUG`, `NODE_ENV` | Valeurs par défaut appliquées. |

Le fichier [.env.test](../.env.test) est de fait la **référence la plus complète** ; il contient en outre deux variables sans effet : `DATABASE_REQUIRE_SSL` et `VITE_ALERTES_MH_ENABLED` (aucune lecture dans le code). Les commentaires de `.env.test` inversent aussi les valeurs d'exemple de `MINIO_ACCESS_KEY_ID` et `MINIO_SECRET_KEY` (sans conséquence).

## 8. Paramètres codés en dur

Paramètres qui ne passent par aucune variable et dont un changement impose une modification du code et une reconstruction d'image.

| Paramètre | Valeur | Emplacement |
| --- | --- | --- |
| Hôtes autorisés par `vite preview` | `app.patrinotes.beta.gouv.fr`, `app.patrinotes.incubateur.net`, `app.compte-rendu-vif.beta.gouv.fr`, `compte-rendu-vif.incubateur.net`, `.compte-rendu-vif.incubateur.net`, `patrinotes.incubateur.net` | [vite.config.ts#L73-L82](../packages/frontend/vite.config.ts#L73-L82) |
| Matomo | `https://stats.beta.gouv.fr/`, `siteId: 123` | [main.tsx#L132-L136](../packages/frontend/src/main.tsx#L132-L136) |
| CORS de l'API | `origin: "*"` | [router.ts#L43-L45](../packages/backend/src/router.ts#L43-L45) |
| TLS PostgreSQL | `ssl: false` (backend et migrations), `sslmode: disable` (PowerSync) | [db.ts](../packages/backend/src/db/db.ts), [drizzle.config.ts](../packages/backend/drizzle.config.ts), [powersync-config.yaml](../powersync/powersync-config.yaml) |
| Client S3 | région `us-east-1`, `forcePathStyle: true`, `bucketEndpoint: true` | [uploadService.ts#L11-L17](../packages/backend/src/services/uploadService.ts#L11-L17) |
| Durée des URL présignées | 3 600 s | [uploadService.ts](../packages/backend/src/services/uploadService.ts) |
| Taille maximale d'un fichier envoyé au backend | 15 Mo (multipart) | [uploadRoutes.tsx#L19-L23](../packages/backend/src/routes/uploadRoutes.tsx#L19-L23) |
| Validité des liens de pièces jointes envoyés par courriel | 90 jours | [attachmentRedirectRoutes.ts#L27](../packages/backend/src/routes/attachmentRedirectRoutes.ts#L27) |
| Validité d'un lien de réinitialisation de mot de passe | 1 jour (stocké en MD5) | [userService.ts#L42-L45](../packages/backend/src/services/userService.ts#L42-L45) |
| Audience attendue des jetons | `account` | [authService.ts#L54](../packages/backend/src/services/authService.ts#L54) |
| Sources POP | `https://ministere-culture.s3.sbg.io.cloud.ovh.net/POP/merimee.csv`, `…/palissy.csv`, `https://pop.culture.gouv.fr/notice/…` | [pop.ts](../packages/backend/src/features/data/pop.ts) |
| Fonds de carte | `tiles.openfreemap.org`, `openmaptiles.geo.data.gouv.fr` (cadastre), `data.geopf.fr` (orthophotos IGN) | [MapLibre.tsx#L14-L26](../packages/frontend/src/features/map/MapLibre.tsx#L14-L26) |
| Géocodage | `https://api-adresse.data.gouv.fr/search/` | [address.tsx](../packages/frontend/src/features/address.tsx), [MapLibre.tsx#L115](../packages/frontend/src/features/map/MapLibre.tsx#L115) |
| Adresse de contact | `contact@patrinotes.beta.gouv.fr` | message d'erreur de liste blanche, pages légales |
| Service technique créé au démarrage | `no-service` | [index.ts#L34-L39](../packages/backend/src/index.ts#L34-L39) |
| Taux d'échantillonnage Sentry | `1.0` (100 %) | [sentry.ts](../packages/backend/src/features/sentry.ts) (backend et frontend) |

## 9. Gabarit minimal de production (noms seulement)

```dotenv
# --- backend ---
NODE_ENV=production
PORT=
DATABASE_URL=                 # secret
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=            # secret
POSTGRES_DB=
FRONTEND_URL=
BACKEND_URL=
VITE_AUTH_URL=
VITE_AUTH_REALM=
VITE_AUTH_CLIENT_ID=
AUTH_CLIENT_SECRET=           # secret
AUTH_ADMIN_CLIENT_ID=
AUTH_ADMIN_CLIENT_SECRET=     # secret
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=               # secret
EMAIL_EMITTER=
MINIO_URL=
MINIO_BUCKET=
MINIO_ACCESS_KEY_ID=          # secret
MINIO_SECRET_KEY=             # secret
SENTRY_DSN=
DATAGOUV_API=                 # obligatoire mais inutilisée
JWT_SECRET=                   # obligatoire mais inutilisée
JWT_REFRESH_SECRET=           # obligatoire mais inutilisée
FORCE_REFETCH_POP=false

# --- frontend (publiques) ---
VITE_BACKEND_URL=
VITE_POWERSYNC_URL=
VITE_AUTH_URL=
VITE_AUTH_REALM=
VITE_AUTH_CLIENT_ID=
VITE_SENTRY_DSN=

# --- powersync ---
POWERSYNC_CONFIG_PATH=/config/config.yaml
PS_DATABASE_URL=              # secret
PS_PORT=8080
```
