# 18 — Questions ouvertes

Points que la lecture du code ne permet pas de trancher. Les questions sur la production actuelle ont été reprises lors du **relevé de production du 17/11/2026** (lecture seule du serveur, de Coolify, des bases et de Keycloak) : la plupart ont maintenant une réponse, reportée ci-dessous et dans les chapitres concernés. Les questions qui dépendent du ministère sont regroupées dans [19 — Questions à poser au ministère](19-questions-pour-le-ministere.md), un document fait pour lui être envoyé.

Colonne « Bloquant » : nécessaire au transfert. Une ligne barrée est résolue ; ce qui reste à faire est écrit à la suite.

## 1. Production actuelle

| # | Question | Réponse (relevé du 17/11/2026) | Reste à faire | Bloquant |
| --- | --- | --- | --- | --- |
| P1 | ~~Configuration Coolify exacte~~ | Projet Coolify `patrimoine-embarque`, environnements `production` et `preprod`. Prod : `app.`, `api.`, `sync.` et `auth.patrinotes.beta.gouv.fr`, images `ghcr.io/betagouv/patrinotes-main:frontend\|backend`. Déploiement **manuel** depuis l'interface Coolify (ni webhook ni API), tags d'image fixes, version déployée non tracée. Détail dans [10](10-infrastructure-et-deploiement.md). | Archiver un export de la configuration (variables, volumes, fichiers montés) au début de la phase 1. | Non |
| P2 | ~~Le fichier PowerSync du dépôt est-il celui de la production ?~~ | Non. Les fichiers sont déposés à la main sur le serveur. `powersync-config.yaml` pointe sur `https://auth.patrinotes.beta.gouv.fr/realms/patrinotes`. `sync-config.yaml` est celui de `main`, versionné dans le dépôt : il a reçu le 17/11/2026 le contrôle d'appartenance au service sur les flux de pièces jointes, et PowerSync a été redémarré (toujours 1.20.5, nouveau slot). Il reste **déposé à la main** dans Coolify. | Déployer les fichiers PowerSync avec l'application plutôt qu'à la main ; livrer la configuration de `development` avec les migrations 0037–0039. | Oui |
| P3 | ~~Realm et réglages Keycloak~~ | Realm **`patrinotes`** (216 comptes), thème DSFR, courriel comme identifiant, console « compte » active. Réglages de sécurité relevés dans le relevé transmis au ministère (hors dépôt). | Décider des durcissements (voir [05](05-authentification-securite.md)). Sans objet si ProConnect remplace Keycloak. | Oui |
| P4 | ~~Montage du thème Keycloak~~ | Fichier `/home/ubuntu/keycloak-theme.jar` monté dans `/opt/keycloak/providers/`. Identique à celui du dépôt. Hors des sauvegardes. | — | Non |
| P5 | ~~Version PostgreSQL et réglages~~ | **PostgreSQL 17.8**, `wal_level=logical`, 10 slots et 10 émetteurs WAL au plus, **`max_slot_wal_keep_size=-1` (sans plafond)**. Un seul slot, actif. | Plafonner le WAL retenu et créer un rôle de réplication dédié. | Oui |
| P6 | ~~Contenu de la publication~~ | 22 tables. `constat_validation` n'y est pas, alors que la configuration de synchronisation la lit (sans effet : le frontend ne l'utilise pas). `transactions` y est sans être lue. Les tables `monument_*` de `development` n'existent pas encore en prod. | Corriger l'une ou l'autre (voir [14 § 3.2](14-migration-vers-infra-ministere.md#32-adaptations-de-configuration-et-de-code)). | Oui |
| P7 | Initialisation des migrations 0000 et 0001 | 37 migrations appliquées (0000 à 0036, comme `main`). Le hash enregistré pour 0000 correspond au fichier du 07/11/2025, reformaté depuis (commit `52842b2`). Sans effet en prod (drizzle ne revérifie pas les hashes). La façon dont la base a été créée à l'origine (application réelle ou ligne de base) ne se lit pas. | Ne pas rejouer les migrations sur une base vide pendant le transfert : restaurer le dump (voir [14 § 5.1](14-migration-vers-infra-ministere.md#51-postgresql)). | Non |
| P8 | Stockage objet | **Scaleway**, bucket `patrinotes-prod`, région `fr-par`. Bucket non listable anonymement. CORS : l'origine de prod est autorisée (`GET, HEAD, POST, PUT, DELETE`), les autres origines testées sont refusées. | Relever dans la console Scaleway la liste exacte des origines CORS, la taille du bucket et la présence d'un versionnage. | Oui |
| P9 | SMTP et domaine d'envoi | `smtp.tem.scw.cloud:465`, expéditeur `noreply@patrinotes.beta.gouv.fr`. SPF correct, **DMARC en `p=none`**, sélecteur DKIM non trouvé. | Relever le DKIM dans la console Scaleway ; passer DMARC en `quarantine`. Corriger la politique de confidentialité (elle cite Brevo et OVH). | Non |
| P10 | Sentry | Instance `sentry.incubateur.net` (beta.gouv), **frontend seulement** : le backend n'a pas de DSN. Jusqu'au 17/11/2026, le frontend de production y envoyait les jetons et le contenu des écritures ; le correctif (PR #83) est en production depuis le 17/11/2026. | Purger le projet Sentry (fait par l'équipe). Vérifier la rétention ; décider si le backend doit être branché. | Non |
| P11 | ~~`NODE_ENV` en production~~ | `production`, posé par le script de démarrage du backend (`cross-env`). | — | Non |
| P12 | Sauvegardes | Base applicative de prod : quotidienne **depuis le 28/10/2026 seulement**, 7 jours en local, 90 jours sur S3 (21 exécutions, toutes réussies). Keycloak : quotidienne, sans limite de durée. Le S3 de sauvegarde (`cr-vif-prod`) est dans le même compte et la même région que les données. **Aucune sauvegarde des photos et PDF, de MongoDB ni des fichiers de configuration. Aucune restauration testée.** | Tester une restauration ; sauvegarder ou versionner le bucket ; sortir les sauvegardes du compte Scaleway des données. | Oui |
| P13 | ~~Volumétrie~~ | Base de 719 Mo : `pop_objets` 288 948 lignes, `pop_immeubles` 46 895, `transactions` 158 094, `report` 2 910, `state_report` 1 214, `user` 261, `service` 118. MongoDB de PowerSync : 3,1 Go de données. Serveur : 8 vCPU, 31 Go de RAM, disque occupé à 10 %. | Taille du bucket (console Scaleway). | Non |
| P14 | ~~Version de PowerSync~~ | 1.20.5 (image du 13/04/2026), tirée par le tag `latest`. | Épingler la version (phase 2). | Non |
| P15 | ~~Branches déployées~~ | `development` sur `patrinotes.incubateur.net` (préprod, utilisée). **La préprod s'authentifie sur le Keycloak de prod**. `compte-rendu-vif` sur `compte-rendu-vif.incubateur.net` : frontend actif, backend en échec. | Donner à la préprod son propre Keycloak ou realm ; arrêter les services CR VIF. | Non |
| P16 | ~~Ancien domaine CR VIF~~ | `app.compte-rendu-vif.beta.gouv.fr` est servi par une page nginx qui redirige vers `/inscription?from=crvif` et désinscrit l'ancien service worker. Elle diffère de [crvif-redirection/](../crvif-redirection/). `?from=crvif` n'est lu par aucun code (simple marqueur). D'autres résidus CR VIF tournent encore (inventaire hors dépôt). | Versionner la page réelle ; arrêter les résidus. | Non |
| P17 | ~~Import POP planifié~~ | Aucune tâche planifiée : l'import est manuel. Dernière date de notice : 06/05/2026 pour les immeubles, 31/07/2025 pour les objets. 4 541 objets ont une date de mise à jour illisible (colonnes décalées ou encodage). La vérification des images n'a jamais tourné. | Planifier l'import et corriger le décalage de colonnes. | Non |

## 2. Choix pour la cible

Ces questions relèvent du ministère. Elles sont reformulées pour lui dans [19](19-questions-pour-le-ministere.md) (numéros M1 à M24).

| # | Question | Voir | Bloquant |
| --- | --- | --- | --- |
| C1 | Réplication logique autorisée sur le PostgreSQL du ministère ? | M1, M2 | Oui |
| C2 | MongoDB ou stockage PostgreSQL pour PowerSync ? | M6 | Oui |
| C3 | Keycloak transféré, ProConnect ou annuaire ministériel ? | M14, M15 | Oui |
| C4 | S3 du ministère joignable depuis les navigateurs et par des destinataires externes ? | M4 | Oui |
| C5 | Domaines conservés ? | M5 | Oui |
| C6 | Forge et registre d'images ? | M7 | Oui |
| C7 | Supervision, journaux, Matomo ? | M11 | Non |
| C8 | RPO et RTO ? | M12 | Non |
| C9 | Corrections de sécurité exigées avant homologation ? | M16, M17 | Oui |
| C10 | Dictée vocale (Google) et fond de carte OpenFreeMap acceptables ? | M20, M21 | Non |

## 3. Fonctionnel

| # | Question | Réponse |
| --- | --- | --- |
| F2 | ~~Le changement de service libre est-il voulu ?~~ | Oui (décision du 4/11/2026). Il est désormais journalisé dans `transactions`. À faire valider par le ministère (M23). |
| F3 | ~~La modification des paramètres d'un service par n'importe quel membre est-elle voulue ?~~ | Oui (décision du 4/11/2026), limitée au service de l'agent ; les départements ne sont pas modifiables. |
| F4 | Les différences de calcul « abandonné » entre CR (colonne `pdf`) et constats (`attachment_id`) sont-elles voulues ? | Ouverte. |
| F5 | Les immeubles sans `last_image_check_at` sont-ils volontairement exclus de la récupération des photos ? | Ouverte. En prod, la colonne est vide partout : la récupération n'a jamais tourné. |
| F6 | Les tables `pictures` et `merimee` peuvent-elles être supprimées ? | Probablement : elles sont vides en prod. `pictures` est encore synchronisée à tous les agents. |
| F7 | La réinitialisation de mot de passe par `internal_user` (avant Keycloak) est-elle encore utilisée ? | Ouverte. |
| F8 | Comment la liste des abonnés à la lettre d'information est-elle transmise à Brevo ? | Ouverte. |
| F9 | L'échelle imprimée du plan de situation est-elle bien 1:5000 ? | Ouverte. |
| F10 | L'équipe POP accepte-t-elle le *scraping* des pages et l'affichage direct des photos ? | Ouverte. |
| F11 | « Lien valable 1 mois » ou durée réelle de 90 jours : laquelle est la bonne ? | Ouverte. |

## 4. Techniques, à vérifier en exécutant le code

| # | Question | Réponse |
| --- | --- | --- |
| T1 | ~~Les routes de validation renvoient-elles 500, ou 404 et 410 ?~~ | 404 et 410 depuis la PR #84 (`AppError`). |
| T2 | ~~Une inscription avec des majuscules casse-t-elle la connexion ?~~ | Oui avant le correctif. Les courriels sont normalisés (minuscules, espaces retirés) sur `main` (commit `248904b`), pas encore dans `development`. |
| T3 | `react-pdf-html` 2.1.5 fonctionne-t-il sans le correctif orphelin ? | Ouverte. |
| T4 | Les écrans PDF restent-ils bloqués hors ligne ? La génération hors ligne fonctionne-t-elle sur un appareil neuf ? | Ouverte. |
| T5 | `public/dsfr` est-il rempli par `update-icons` ou par `pnpm dsfr` ? | Ouverte. |
| T6 | ~~Le workflow e2e fonctionne-t-il sans `packageManager` ?~~ | Sans objet : `packageManager` vaut `pnpm@10.12.4` et la CI le lit (PR #84). |
| T7 | Comment le SDK réessaie-t-il un téléchargement de photo en 404, quand la ligne arrive avant le fichier ? | Ouverte. |
