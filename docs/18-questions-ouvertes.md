# 18 — Questions ouvertes

Points encore à trancher ou à relever avant le transfert. Les faits établis (relevé de production du 17/11/2026, réponses de l'équipe) sont intégrés dans les chapitres concernés ; ce document ne garde que ce qui reste à faire. Les questions qui dépendent du ministère sont regroupées dans [19 — Questions à poser au ministère](19-questions-pour-le-ministere.md), un document fait pour lui être envoyé.

Colonne « Bloquant » : nécessaire au transfert.

## 1. Production actuelle

| # | Sujet | État connu | Reste à faire | Bloquant |
| --- | --- | --- | --- | --- |
| P1 | Configuration Coolify | Projet `patrimoine-embarque` (environnements `production` et `preprod`), déploiement manuel depuis l'interface, tags d'image fixes, version déployée non tracée. Détail dans [10](10-infrastructure-et-deploiement.md) § 6.0. | Archiver un export de la configuration (variables, volumes, fichiers montés) au début de la phase 1. | Non |
| P2 | Fichiers PowerSync | Déposés manuellement dans Coolify. `powersync-config.yaml` pointe sur `https://auth.patrinotes.beta.gouv.fr/realms/patrinotes` ; `sync-config.yaml` est celui de `main`. | Déployer les fichiers PowerSync avec l'application ; livrer la configuration de `development` avec les migrations 0037 à 0039. | Oui |
| P3 | Réglages Keycloak | Realm `patrinotes` (216 comptes), thème DSFR, courriel comme identifiant. Réglages de sécurité dans le relevé transmis au ministère (hors dépôt). | Décider des durcissements (voir [05](05-authentification-securite.md)). Sans objet si ProConnect remplace Keycloak. | Oui |
| P5 | Réglages PostgreSQL | PostgreSQL 17.8, `wal_level=logical`, `max_slot_wal_keep_size=-1` (sans plafond), un seul slot actif. | Plafonner le WAL retenu ; créer un rôle de réplication dédié. | Oui |
| P6 | Publication `powersync` | 22 tables. `constat_validation` n'y est pas, alors que la configuration de synchronisation la lit (sans effet : le frontend ne l'utilise pas). `transactions` y est sans être lue. Les tables `monument_*` de `development` n'existent pas encore en production. | Aligner publication et configuration (voir [14 § 3.2](14-migration-vers-infra-ministere.md#32-adaptations-de-configuration-et-de-code)). | Oui |
| P7 | Migrations 0000 et 0001 | 37 migrations appliquées (0000 à 0036, comme `main`). L'empreinte enregistrée pour 0000 ne correspond plus au fichier du dépôt, reformaté depuis ; sans effet (drizzle ne revérifie pas les empreintes). | Ne pas rejouer les migrations sur une base vide pendant le transfert : restaurer le dump (voir [14 § 5.1](14-migration-vers-infra-ministere.md#51-postgresql)). | Non |
| P8 | Stockage objet | Scaleway, bucket `patrinotes-prod`, région `fr-par`, non listable anonymement. L'origine de production est autorisée en CORS (`GET, HEAD, POST, PUT, DELETE`), les autres origines testées sont refusées. | Relever dans la console Scaleway la liste exacte des origines CORS, la taille du bucket et la présence d'un versionnage. | Oui |
| P9 | Domaine d'envoi | `smtp.tem.scw.cloud:465`, expéditeur `noreply@patrinotes.beta.gouv.fr`. SPF correct, DMARC en `p=none`, sélecteur DKIM non trouvé publiquement. | Relever le DKIM dans la console Scaleway ; passer DMARC en `quarantine`. Mettre à jour la politique de confidentialité (elle cite Brevo et OVH). | Non |
| P10 | Sentry | Instance `sentry.incubateur.net` (beta.gouv), frontend seulement : le backend n'a pas de DSN. | Vérifier la rétention ; décider si le backend doit être branché ; choisir l'outil cible avec le ministère (M11). | Non |
| P12 | Sauvegardes | Base applicative : quotidienne, 7 jours en local, 90 jours sur S3. Keycloak : quotidienne, sans limite de durée. Le S3 de sauvegarde est dans le même compte et la même région que les données. Pas de sauvegarde des photos et PDF, de MongoDB (reconstructible) ni des fichiers de configuration. | Tester une restauration ; sauvegarder ou versionner le bucket ; sortir les sauvegardes du compte Scaleway des données. | Oui |
| P14 | Version de PowerSync | 1.20.5, tirée par le tag `latest`. | Épingler la version (phase 2). | Non |
| P15 | Préproduction et ancienne application | La préproduction (`development`, `patrinotes.incubateur.net`) s'authentifie sur le Keycloak de production. Des services de l'ancienne application CR VIF tournent encore sur le serveur ; seule la redirection de `app.compte-rendu-vif.beta.gouv.fr` est utile. | Donner à la préproduction son propre Keycloak ou realm ; arrêter les services CR VIF après une dernière sauvegarde ; versionner la page de redirection réelle (elle diffère de [crvif-redirection/](../crvif-redirection/)). | Non |
| P17 | Import POP | Manuel, aucune tâche planifiée. Dernières notices : 06/05/2026 pour les immeubles, 31/07/2025 pour les objets. 4 541 objets ont une date de mise à jour illisible (colonnes décalées ou encodage). | Planifier l'import et corriger le décalage de colonnes. | Non |

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

## 3. Fonctionnel : points tranchés par l'équipe

| # | Sujet | Réponse |
| --- | --- | --- |
| F2 | Changement de service libre | Voulu, et journalisé dans `transactions`. À faire valider par le ministère (M23). |
| F3 | Modification des paramètres d'un service par n'importe quel membre | Voulue, limitée au service de l'agent ; les départements ne sont pas modifiables. |
| F4 | Calcul « abandonné » : colonne `pdf` pour un compte-rendu, `attachment_id` pour un constat | Même notion : la pièce jointe d'un constat est le PDF envoyé, comme le PDF d'un compte-rendu. |
| F5 | Récupération des photos POP (`last_image_check_at`) | Abandonnée : elle n'a jamais tourné en production. L'affichage des images passera par le protocole IIIF. Le code correspondant est à supprimer. |
| F6 | Tables `pictures` et `merimee` | Vides en production : à supprimer (`pictures` est encore synchronisée à tous les agents). |
| F7 | Réinitialisation du mot de passe par `internal_user` | En service : c'est le parcours de réinitialisation des agents, qui se connectent pour la plupart par courriel et mot de passe. |
| F8 | Lettre d'information | La liste des abonnés est exportée et importée dans Brevo à la main par l'équipe. |
| F9 | Échelle du plan de situation | 1:5000, considérée correcte (non mesurée sur papier). |
| F10 | Lecture des pages POP et affichage direct des photos | Accepté par l'équipe POP. |
| F11 | Durée des liens envoyés par courriel | 90 jours. Le texte des courriels (« lien valable 1 mois ») est corrigé pour dire 90 jours (PR #88, en relecture). |

## 4. Techniques, à vérifier en exécutant le code

| # | Question | État |
| --- | --- | --- |
| T3 | `react-pdf-html` 2.1.5 fonctionne-t-il sans le correctif de [patches/](../patches/), qui n'est plus appliqué ? | Ouverte. |
| T4 | Les écrans PDF restent-ils bloqués hors ligne ? La génération hors ligne fonctionne-t-elle sur un appareil neuf ? | Ouverte. |
| T5 | `public/dsfr` est-il rempli par `update-icons` ou par `pnpm dsfr` ? | Ouverte. |
| T7 | Comment le SDK réessaie-t-il un téléchargement de photo en 404, quand la ligne arrive avant le fichier ? | Ouverte. |
