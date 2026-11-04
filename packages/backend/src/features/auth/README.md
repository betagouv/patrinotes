# Authentification

Keycloak n'est plus utilisé : le backend émet lui-même les sessions. Deux façons de se connecter :

- **ProConnect** (OIDC, `proconnect.ts`) : la connexion par défaut des agents ;
- **Lien magique** (`magicLink.ts`) : un courriel contenant un lien **et** un code à 6 chiffres, pour les agents
  sans ProConnect. Sur iOS, une PWA installée ne partage pas son stockage avec Safari : un lien ouvert depuis
  l'application Mail connecterait Safari, pas l'application. L'agent saisit alors le code dans l'application.

ProConnect ou le courriel servent seulement à prouver l'identité au moment de la connexion. La session longue,
celle qui permet de travailler hors ligne, appartient à l'application (`sessions.ts`) :

| | durée | stockage |
|---|---|---|
| access token (JWT RS256, `sub` = id utilisateur, `email`, `sid`) | `ACCESS_TOKEN_TTL_SECONDS` (1 h) | IndexedDB du client |
| refresh token `<session id>.<secret>` | glissante, `AUTH_SESSION_IDLE_DAYS` (90 j) sans synchronisation | IndexedDB du client, hash sha256 dans `auth_session` |

- Le refresh token **change à chaque renouvellement**. Le token précédent reste accepté sans limite de temps :
  si la réponse d'un renouvellement se perd sur le terrain, l'appareil le garde, parfois des heures hors ligne.
  Un token de deux rotations en arrière signale une réutilisation (vol de session) : la session est révoquée.
  Pour comparaison, Keycloak en prod ne faisait pas tourner ses refresh tokens (`revoke_refresh_token = false`).
- Les onglets de l'application sérialisent le renouvellement (`navigator.locks`, `db/Connector.ts`).
- PowerSync vérifie les access tokens avec les clés publiques servies sur `GET /api/auth/jwks.json`. Le claim
  `email` est utilisé par les règles de synchronisation (`auth.parameter('email')`).
- Première connexion : `signup-required` + un `signupToken` (JWT HS256, 30 min) → `/inscription` (fonction,
  service, CGU) → `POST /api/auth/signup`. Un nouvel utilisateur doit être dans la `whitelist` (sauf en dev).
- Si ProConnect transmet une adresse qu'aucun compte n'utilise (alias, ancienne adresse), `/inscription` propose
  de **rattacher le compte existant** : un code est envoyé sur l'adresse du compte, puis l'identité ProConnect
  (`sub`) lui est liée (`POST /api/auth/link-account`). C'est possible même si l'adresse ProConnect n'est pas
  dans la whitelist ; la création d'un nouveau compte, elle, reste refusée.

## Mise en place

1. Générer la clé de signature, puis la mettre dans le gestionnaire de secrets :
   `pnpm backend auth:generate-key` → `AUTH_JWT_PRIVATE_KEY`. Elle est obligatoire en production. Changer la clé
   n'invalide que les access tokens : les clients en obtiennent un nouveau au renouvellement suivant. PowerSync
   recharge le JWKS quand il reçoit un `kid` inconnu, au plus une fois par minute.
   En dev et en test, sans cette variable, une clé est générée une fois dans `packages/backend/.auth-dev-key.pem`
   (fichier ignoré par git). Elle doit rester stable d'un redémarrage à l'autre, car PowerSync garde le JWKS en cache.
2. ProConnect : `PROCONNECT_CLIENT_ID`, `PROCONNECT_CLIENT_SECRET`, `PROCONNECT_DOMAIN`
   (intégration `fca.integ01.dev-agentconnect.fr`, production `auth.agentconnect.gouv.fr`).
   URL à déclarer chez ProConnect (exactement, sans `/` final) :
   - redirect_uri : `${FRONTEND_URL}/auth-callback`
   - post_logout_redirect_uri : `${FRONTEND_URL}/connexion`

   Les algorithmes de signature RS256, ES256 et HS256 sont tous acceptés pour l'id_token et le userinfo.
3. PowerSync : `client_auth.jwks_uri` = `${BACKEND_URL}/api/auth/jwks.json` (variable `PS_JWKS_URI`),
   `audience: ["patrinotes"]`. En dev et en test, le backend tourne sur l'hôte :
   `http://host.docker.internal:<port>/api/auth/jwks.json`.

## Migration depuis Keycloak (temporaire)

Au déploiement, des agents peuvent être hors ligne avec des constats non synchronisés : il ne faut pas les
déconnecter. Tant que `VITE_AUTH_URL`, `VITE_AUTH_REALM`, `VITE_AUTH_CLIENT_ID` et `AUTH_CLIENT_SECRET` restent
définis côté backend (`legacyKeycloak.ts`) :

- un refresh token Keycloak présenté à `/api/refresh-token` est échangé, une fois, contre une session de
  l'application (`auth_session.provider = 'keycloak'`), sans que l'agent ne voie rien ;
- un access token Keycloak encore valide (1 h en prod) est accepté par l'API ;
- si Keycloak est injoignable, le renouvellement répond 503 : le client garde ses tokens et réessaie, l'agent
  n'est pas déconnecté. Seul un refus explicite de Keycloak (session hors ligne expirée) termine la session.

### Ordre de déploiement

1. **Variables du backend** : ajouter `AUTH_JWT_PRIVATE_KEY` (`pnpm backend auth:generate-key`), sinon la
   migration et le backend refusent de démarrer en production. **Garder** `VITE_AUTH_URL`, `VITE_AUTH_REALM`,
   `VITE_AUTH_CLIENT_ID` et `AUTH_CLIENT_SECRET`. `AUTH_ADMIN_*` et `JWT_REFRESH_SECRET` ne servent plus.
2. **PowerSync** (`/data/coolify/services/a4koswck4g8ggcwc4wsw4oc8/powersync-config.yaml` en prod) : accepter
   les deux émetteurs, puis redémarrer le service. Vérifié : la version déployée accepte une liste et ne contrôle
   pas `issuer`.
   ```yaml
   client_auth:
     jwks_uri:
       - https://auth.patrinotes.beta.gouv.fr/realms/patrinotes/protocol/openid-connect/certs
       - https://api.patrinotes.beta.gouv.fr/api/auth/jwks.json
     audience: ["account", "patrinotes"]
   ```
3. **Backend** (la migration `0038_auth_sessions` s'applique au démarrage), puis **frontend**. Une ancienne
   version du frontend encore en cache reste compatible : `/api/refresh-token` garde le même contrat.

Ce parcours a été simulé de bout en bout avec un vrai Keycloak (`.scratch/transition/`) : un agent connecté avec
l'ancienne version, avec un compte-rendu créé hors ligne, rouvre l'application après le déploiement. Il reste
connecté, sa session migre et le compte-rendu remonte. Un agent qui ne revient qu'après le retrait de Keycloak
doit se reconnecter (code par courriel ou ProConnect) : ses données locales non synchronisées remontent ensuite
sur le même compte.

### Retirer Keycloak

Les sessions hors ligne Keycloak expirent après 30 jours sans usage (réglage de la prod) : passé ce délai après
le déploiement, la migration n'apporte plus rien. Supprimer alors ces variables, `legacyKeycloak.ts` et ses deux
appels dans `authService.ts`, ainsi que l'URI Keycloak et l'audience `account` de la configuration PowerSync.
Pour compter les agents actifs non encore migrés :

```sql
select count(*) from "user" u
where not exists (select 1 from auth_session s where s.user_id = u.id and s.revoked_at is null);
```
