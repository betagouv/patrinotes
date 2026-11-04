# Dossier d'Architecture Technique — Patrinotes

**Patrinotes** (anciennement « Compte-rendu VIF ») est un service numérique incubé par beta.gouv.fr pour le ministère de la Culture (DGPA). Il permet aux agents des services patrimoniaux (UDAP, CRMH…) de rédiger, **y compris hors ligne**, des comptes-rendus de rendez-vous et des constats d'état de monuments historiques, puis de les envoyer en PDF.

Ce dossier décrit l'architecture technique du service tel qu'il est dans le dépôt. Il a trois usages :

1. **Préparer le transfert** de l'hébergement actuel (VPS privé géré avec Coolify, hors infrastructure ministérielle pendant la phase beta) vers l'**infrastructure du ministère** ;
2. **Servir de base à l'homologation** de sécurité (analyse de risques, flux, données personnelles) ;
3. **Accueillir de nouveaux développeurs** et donner aux interlocuteurs non techniques une vue d'ensemble.

> **État du document.** Il a été rédigé à partir d'une lecture complète du code. La configuration de production (Coolify, realm Keycloak, publication PostgreSQL, stockage objet) n'est pas dans le dépôt et n'a pas été vérifiée. Ce qui en dépend est marqué « à confirmer » et repris dans [18 — Questions ouvertes](18-questions-ouvertes.md).

## Sommaire

| N° | Document | Contenu | Pour qui |
| --- | --- | --- | --- |
| 01 | [Contexte et périmètre](01-contexte-et-perimetre.md) | Le produit, ses utilisateurs, les documents produits, les parcours, les pages légales, le périmètre du DAT | Tous |
| 02 | [Architecture générale](02-architecture-generale.md) | Principes, composants, flux principaux, organisation du dépôt, choix techniques | Tous |
| 03 | [Frontend et PWA](03-frontend-pwa.md) | Application React, routes, base locale, *service worker*, mises à jour, fonctionnalités | Développeurs |
| 04 | [Backend et API](04-backend-api.md) | Fastify, toutes les routes, services, erreurs, journaux, génération du client typé | Développeurs |
| 05 | [Authentification et sécurité](05-authentification-securite.md) | Keycloak, jetons, liste blanche, rôles, cloisonnement, données personnelles, synthèse pour l'homologation | Sécurité, développeurs |
| 06 | [Modèle de données](06-modele-de-donnees.md) | Toutes les tables, diagrammes entité-relation, conventions, migrations | Développeurs, exploitation |
| 07 | [Données externes et stockage](07-donnees-externes-et-stockage.md) | Imports POP, photos, API Adresse, stockage S3, liens courts, redirection de l'ancien domaine | Développeurs, exploitation |
| 08 | [Synchronisation et hors ligne](08-synchronisation-hors-ligne.md) | PowerSync, règles de synchronisation, écriture, pièces jointes, changements de schéma | Développeurs, exploitation |
| 09 | [Documents PDF, cartes et e-mails](09-documents-pdf-cartes-emails.md) | Gabarits PDF, plan de situation, cartes, e-mails, alertes, validation, dictée, flux sortants | Développeurs |
| 10 | [Infrastructure et déploiement](10-infrastructure-et-deploiement.md) | Images Docker, CI, Compose, topologie de production, environnements, livraison | Exploitation |
| 11 | [Configuration](11-configuration.md) | Référence exhaustive des variables d'environnement | Exploitation, développeurs |
| 12 | [Exploitation et supervision](12-exploitation-et-supervision.md) | Journaux, Sentry, supervision, sauvegardes, tâches d'administration, procédures d'incident | Exploitation |
| 13 | [Tests et qualité](13-tests-et-qualite.md) | Tests e2e, outillage, conventions, installation du poste de développement | Développeurs |
| 14 | [Migration vers l'infrastructure du ministère](14-migration-vers-infra-ministere.md) | Exigences, dimensionnement, flux réseau, procédure de migration, bascule, retour arrière | **Ministère, exploitation** |
| 15 | [Règles implicites et pièges](15-regles-cachees-et-pieges.md) | Tout ce qu'il faut savoir avant de toucher au code | **Développeurs** |
| 16 | [Risques et dette technique](16-risques-et-dette-technique.md) | Risques classés, recommandations, plan d'action | **Sécurité, direction de produit** |
| 17 | [Glossaire](17-glossaire.md) | Termes métier et techniques | Tous |
| 18 | [Questions ouvertes](18-questions-ouvertes.md) | Points à confirmer avant la bascule | **Équipe, ministère** |

## Parcours de lecture conseillés

- **Équipe du ministère qui reprend l'hébergement** : 01 → 02 → 14 → 10 → 11 → 12 → 18.
- **Homologation** : 02 → 05 → 16 → 14 (§6, flux réseau) → 09 (flux sortants) → 06 (données personnelles).
- **Nouveau développeur** : 01 → 02 → 15 → 13 (installation) → 03, 04, 08 selon le sujet.
- **Interlocuteur métier** : 01 → 02 (§1 à 3) → 16 (§1 et §7).

## L'essentiel en dix points

1. **Hors ligne d'abord.** Chaque navigateur a sa propre base SQLite, synchronisée par **PowerSync** depuis PostgreSQL. Les lectures passent par PowerSync, les écritures par l'API du backend.
2. **PostgreSQL doit permettre la réplication logique** (`wal_level=logical`, publication `powersync`, slot de réplication). C'est l'exigence la plus contraignante pour une base gérée.
3. **Les PDF sont produits dans le navigateur** et déposés directement sur le stockage S3 par URL pré-signée : **le stockage objet doit être joignable depuis les postes des agents**, avec CORS.
4. **Les e-mails envoient un lien public** vers le backend (`/attachment/:id`), valable 90 jours : le domaine du backend doit être conservé, ou redirigé, après la bascule.
5. **Le domaine du frontend porte les données locales** des agents : en changer fait perdre les écritures non synchronisées.
6. **Keycloak** gère les comptes, mais le navigateur ne lui parle jamais : le backend fait l'intermédiaire. Keycloak peut donc rester sur un réseau interne.
7. **Le frontend tourne avec `vite preview`**, avec une liste de domaines autorisés codée en dur : un nouveau domaine impose une modification du code.
8. **Le contrôle d'accès côté serveur est très insuffisant** (écriture libre via `/api/upload-data`, fichiers non cloisonnés) et **des jetons et mots de passe partent dans Sentry**. À corriger avant homologation : voir [16](16-risques-et-dette-technique.md).
9. **Des écritures peuvent se perdre sans message** (erreur SQL renvoyée en HTTP 200). Voir [08](08-synchronisation-hors-ligne.md).
10. **Aucune tâche planifiée, aucune purge, aucune sauvegarde décrite dans le dépôt** : ce sont des chantiers d'exploitation à ouvrir avec le ministère.

## Conventions du dossier

- Les liens vers le code sont relatifs au dépôt, avec numéros de ligne lorsque c'est utile.
- Les diagrammes sont en Mermaid (rendus par GitHub, GitLab et la plupart des éditeurs).
- Aucune valeur secrète n'est écrite : seuls les **noms** des variables apparaissent.
- « À confirmer » signale une déduction ou un point qui dépend de la production.
- Ce dossier décrit le code ; il doit être mis à jour avec lui. Les règles de [15](15-regles-cachees-et-pieges.md) et les risques de [16](16-risques-et-dette-technique.md) sont les sections qui vieillissent le plus vite.
