# 19 — Questions à poser au ministère

Ce document rassemble les questions dont les réponses dépendent du ministère de la Culture, et non de l'équipe Patrinotes. Il se lit sans le reste du dossier et s'adresse aux interlocuteurs concernés (hébergement, sécurité, protection des données, métier).

Les réponses conditionnent le plan de transfert décrit dans [14 — Migration](14-migration-vers-infra-ministere.md). Les questions marquées **bloquante** doivent être tranchées avant que l'équipe d'hébergement ne commence à construire l'environnement cible (phase 3).

## Rappel : ce qu'est Patrinotes, techniquement

Patrinotes est une application web installable (PWA) utilisée sur le terrain par les agents des services patrimoniaux, y compris **sans réseau**. Elle comprend :

- un **frontend** (application web) et un **backend** (API Node.js) ;
- une base **PostgreSQL** ;
- un service de synchronisation hors ligne, **PowerSync**, qui lit les changements de la base par réplication logique et les pousse aux terminaux par WebSocket (avec un stockage **MongoDB**) ;
- un **stockage objet S3** pour les photos et les PDF, que les navigateurs remplissent directement ;
- un fournisseur d'identité (**Keycloak** aujourd'hui, ProConnect et connexion par code envoyé par courriel en préparation) ;
- un relais **SMTP** pour l'envoi des comptes-rendus et des constats.

Elle est aujourd'hui hébergée sur un serveur privé géré avec Coolify. L'état détaillé de cet hébergement est dans [10 — Infrastructure](10-infrastructure-et-deploiement.md).

## 1. Hébergement (équipe d'infrastructure)

| # | Question | Pourquoi on la pose | Ce qu'il nous faut | Bloquante |
| --- | --- | --- | --- | --- |
| M1 | Le PostgreSQL fourni autorise-t-il la **réplication logique** : `wal_level=logical`, un rôle avec l'attribut `REPLICATION`, le droit de créer une publication et un slot de réplication ? | PowerSync ne fonctionne pas sans. Beaucoup d'offres mutualisées le refusent. | Oui écrit, ou une instance PostgreSQL dédiée (VM ou conteneur) que nous administrons. | **Oui** |
| M2 | Quelle version de PostgreSQL ? Peut-on régler `max_slot_wal_keep_size` et superviser la taille du WAL retenu par le slot ? | La production est en PostgreSQL 17 ; on ne peut pas restaurer sur une version inférieure. Un slot bloqué peut remplir le disque. | Version ≥ 17, et une alerte sur le WAL retenu. | **Oui** |
| M3 | Les **WebSocket** et les connexions longues passent-ils de bout en bout (proxy, WAF, pare-feu), avec un délai d'inactivité d'au moins 5 minutes ? | La synchronisation en temps réel en dépend. | Oui écrit, et le nom du composant qui termine TLS. | **Oui** |
| M4 | Le **stockage S3** proposé est-il joignable depuis les navigateurs des agents en HTTPS, avec des URL présignées (signature V4), l'adressage par chemin et un CORS configurable ? Ces URL peuvent-elles être lues depuis Internet par des destinataires extérieurs (propriétaires, mairies) ? | Les photos et les PDF partent directement du navigateur vers S3. Les liens envoyés par courriel sont ouverts par des personnes hors du ministère. | Oui écrit, ou un MinIO que nous hébergeons. Préciser le versionnage et la sauvegarde du bucket. | **Oui** |
| M5 | Peut-on garder les noms de domaine actuels (`app.patrinotes.beta.gouv.fr` et ceux du backend, de PowerSync et du stockage) ? Qui gère la délégation DNS de `beta.gouv.fr` ? | Changer le domaine du frontend fait **perdre les saisies hors ligne** non encore synchronisées. Changer celui du backend casse les liens envoyés depuis moins de 90 jours. | Accord pour conserver les domaines, ou date de changement acceptée par le métier. | **Oui** |
| M6 | MongoDB est-il proposé (≥ 6, en *replica set*) ? Sinon, accepte-t-on que nous l'hébergions en conteneur ? | Stockage de PowerSync. Il est reconstructible, il n'a pas besoin de sauvegarde. | Une des deux options. | **Oui** |
| M7 | Comment déploie-t-on ? D'où viennent les images : peut-on tirer depuis `ghcr.io` (GitHub), ou faut-il publier dans un registre du ministère ? Quelle forge pour le code ? | La chaîne de livraison actuelle publie sur `ghcr.io`. | Registre et mécanisme de déploiement (manuel, webhook, GitOps). | **Oui** |
| M8 | Quels environnements : une recette et une production isolées ? | Nous testons aujourd'hui sur une préproduction alimentée par la branche `development`. | Nombre d'environnements et leurs noms de domaine. | Non |
| M9 | Quel relais **SMTP**, avec quelle adresse d'expédition autorisée ? Qui configure SPF, DKIM et DMARC ? | Aujourd'hui : Scaleway Transactional Email. Un changement de relais impose de reconfigurer le domaine d'envoi. | Hôte, port, mode TLS, expéditeur. | Non |
| M10 | Quelles sorties HTTPS sont autorisées depuis les serveurs et depuis le réseau des agents ? | Cartes (OpenFreeMap, IGN, cadastre), géocodage (API Adresse), données POP, supervision. La liste est au [§ 4.8 du chapitre 14](14-migration-vers-infra-ministere.md#48-matrice-des-flux-réseau). | Validation de la matrice des flux, ou liste des refus. | Non |
| M11 | Quelle **supervision** et quelle collecte des journaux ? Garde-t-on Sentry ? | Nous utilisons Sentry pour les erreurs du frontend (le backend est prêt, son DSN reste à définir). | Outil retenu et rétention. | Non |
| M12 | Quelle politique de **sauvegarde** et quels objectifs de reprise (RPO, RTO) ? Qui teste les restaurations ? | Aujourd'hui : sauvegarde quotidienne de la base, 7 jours en local, 90 jours sur S3, sans test de restauration. Aucune sauvegarde des photos et PDF n'est visible côté serveur. | RPO, RTO, et qui porte la sauvegarde de la base et du stockage. | Non |
| M13 | Quel coffre de **secrets** pour les variables de production ? | Une quinzaine de secrets (base, S3, SMTP, identité, Sentry). | Outil et procédure de saisie. | Non |
| M25 | Les serveurs de l'hébergement cible pourront-ils appeler l'**API Dataspace** des unités patrimoniales (`api-ext.stg.cloud.culture.fr`) ? | Cette API n'accepte aujourd'hui que l'adresse IP du serveur de production ; sans elle, les constats de monuments complexes ne peuvent pas choisir leurs unités patrimoniales. | Ajout de l'adresse de sortie des serveurs cibles à la liste autorisée par l'équipe Dataspace. | **Oui** |

## 2. Identité (équipe d'infrastructure et RSSI)

| # | Question | Pourquoi on la pose | Bloquante |
| --- | --- | --- | --- |
| M14 | **ProConnect** est-il accepté comme mode de connexion des agents ? Tous les utilisateurs actuels sont-ils des agents publics ? | Une PR prête à être relue remplace Keycloak par ProConnect et un code de connexion envoyé par courriel. Si elle passe avant le transfert, Keycloak n'a plus à être déménagé. | **Oui** |
| M15 | Sinon, le ministère fournit-il un Keycloak, ou accepte-t-il que nous transférions le nôtre ? Faut-il plutôt utiliser un annuaire du ministère (Cerbère ou autre) ? | Le code actuel dépend de fonctions propres à Keycloak (création de comptes par API, connexion par identifiant et mot de passe côté serveur). Un autre annuaire demande du développement. | **Oui** |

## 3. Sécurité et homologation (RSSI)

| # | Question | Pourquoi on la pose | Bloquante |
| --- | --- | --- | --- |
| M16 | Quel est le **calendrier d'homologation** et qui la prononce ? Quel référentiel (RGS, MonServiceSécurisé) ? | L'homologation doit être acquise avant la bascule. | **Oui** |
| M17 | Quelles corrections de la liste des risques ([16](16-risques-et-dette-technique.md)) sont exigées **avant** homologation ? | Le chapitre 16 décrit les contrôles en place (droits vérifiés par le serveur, limitation de débit, filtrage des données envoyées à Sentry) et les risques restants, classés par niveau. | **Oui** |
| M18 | TLS est-il exigé entre l'application et la base de données à l'intérieur du réseau du ministère ? Si oui, avec quelle autorité de certification ? | TLS est désactivé par défaut. Il s'active par configuration : `DATABASE_SSL=true` pour le backend et les migrations, `sslmode` pour PowerSync. | Non |
| M19 | Une politique de mot de passe et une protection contre la force brute sont-elles exigées (scénario Keycloak) ? | À définir pour la cible. Sans objet si ProConnect est retenu. | Non |

## 4. Protection des données (DPD) et métier

| # | Question | Pourquoi on la pose | Bloquante |
| --- | --- | --- | --- |
| M20 | La **dictée vocale** (sous Chrome, l'audio est traité par un service de Google) est-elle acceptable ? | Fonction utilisée sur le terrain ; elle transmet la voix à un tiers. | Non |
| M21 | Le fond de carte **OpenFreeMap** (service non étatique) est-il acceptable, ou faut-il passer sur les fonds IGN ? | Les terminaux des agents appellent ce service à chaque affichage de carte. | Non |
| M22 | Qui met à jour les **mentions légales et la politique de confidentialité** ? | Elles citent OVH et Brevo, alors que l'application utilise Scaleway (stockage et courriel), Sentry et Matomo. | Non |
| M23 | Un agent peut-il librement **changer de service** dans l'application ? Tout membre d'un service peut-il en modifier les paramètres ? | C'est le cas aujourd'hui (choix fonctionnel). Le changement de service donne accès aux données du nouveau service ; il est tracé dans un journal. Un agent ne modifie que les paramètres de son propre service (en-têtes PDF, adresses d'alerte, clauses, services instructeurs), pas ses départements. | Non |
| M24 | Quelle **fenêtre de bascule** convient (période creuse de visites) ? Qui prévient les agents ? | La bascule interrompt l'application quelques heures. Les agents doivent synchroniser avant. | Non |

## 5. Réponses attendues

Pour chaque question, merci d'indiquer : la réponse, le nom de la personne ou de l'équipe qui la porte, et la date. Les réponses seront reportées dans [18 — Questions ouvertes](18-questions-ouvertes.md) et dans [14 — Migration](14-migration-vers-infra-ministere.md).
