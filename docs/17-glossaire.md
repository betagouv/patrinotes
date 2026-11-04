# 17 — Glossaire

Termes métier, administratifs et techniques employés dans le code et dans ce dossier. Le nom de la table ou de la colonne correspondante est indiqué entre parenthèses quand il existe.

## 1. Métier et organisation

| Terme | Définition |
| --- | --- |
| **ABF** | Architecte des bâtiments de France. Agent d'UDAP qui donne des avis sur les travaux en espaces protégés et rédige des comptes-rendus et des constats. |
| **Agrégée** | Application ministérielle de suivi sanitaire des monuments historiques, citée dans l'application. |
| **Alerte** (`state_report_alert`) | Signalement issu d'un constat d'état, adressé au service compétent : édifice en péril, abords, objets mobiliers, archéologie, site classé ou inscrit, biodiversité, sécurité. |
| **Bilan quinquennal** | Bilan sanitaire d'un monument historique, prévu tous les cinq ans. |
| **Bordereau** | Corps du courriel d'envoi d'un constat, avec le texte réglementaire. |
| **CAOA** | Conservateur des antiquités et objets d'art. Suit les objets mobiliers protégés. |
| **Clause** (`clause_v2`) | Texte type réutilisable dans les comptes-rendus (décision, contacts utiles, bonnes pratiques, type d'espace). `ALL` = clause nationale, sinon propre au service. |
| **Compte-rendu, CR** (`report`) | Document remis à un demandeur après un rendez-vous ou un conseil de l'UDAP : projet, décision, suites à donner. |
| **Compte-rendu VIF, CR VIF** | Ancien nom du produit, avant Patrinotes. Il survit dans les clés `crvif` et dans [crvif-redirection](../crvif-redirection). « Compte-rendu VIF » était simplement le nom du produit ; ce n'est pas un sigle à développer. |
| **Constat d'état, CE** (`state_report`) | Rapport de visite sur l'état de conservation d'un monument historique, partie par partie, dans le cadre du contrôle scientifique et technique. |
| **Courriels obligatoires / additionnels** | Destinataires imposés d'une alerte (services compétents) et destinataires ajoutés librement. |
| **CRMH** | Conservation régionale des monuments historiques, service de la DRAC. |
| **CST** | Contrôle scientifique et technique de l'État sur les monuments historiques. |
| **Délégation** (`delegation`) | Droit donné par un agent à un collègue de créer, modifier et supprimer ses comptes-rendus. |
| **Demandeur, pétitionnaire** (`applicant*`) | Personne reçue pour un projet de travaux, destinataire du compte-rendu. |
| **DGPA** | Direction générale des patrimoines et de l'architecture. Éditrice de l'application et responsable de traitement. |
| **DRAC** | Direction régionale des affaires culturelles. |
| **DREAL** | Direction régionale de l'environnement, de l'aménagement et du logement. Compétente pour les sites classés et inscrits. |
| **Envoi sous-couvert, validation** (`constat_validation`) | Envoi d'un constat soumis à l'accord préalable d'une personne désignée (le **validateur**), qui n'a pas besoin de compte. |
| **Liste blanche** (`whitelist`) | Adresses e-mail autorisées à créer un compte. |
| **Mérimée** (`pop_immeubles`) | Base nationale des immeubles protégés au titre des monuments historiques. |
| **MH classé / inscrit** | Les deux niveaux de protection au titre des monuments historiques. |
| **OFB** | Office français de la biodiversité. |
| **Palissy** (`pop_objets`) | Base nationale des objets mobiliers protégés. |
| **Partie visitée, section visitée** (`visited_section`) | Partie de l'édifice décrite dans le constat (fondations, couverture…). Huit parties par défaut. |
| **Plan de situation** | Image aérienne IGN au 1:5000 centrée sur le monument, générée automatiquement pour le PDF du constat. |
| **Plan de l'édifice, vue générale** | Visuels typés insérés en tête du constat. |
| **POP** | Plateforme ouverte du patrimoine du ministère de la Culture, qui publie Mérimée et Palissy. |
| **Préconisation** | Intervention recommandée dans un constat : études, entretien, réparation, restauration, mesures d'urgence. |
| **Référence POP** | Identifiant d'une notice (PA… pour Mérimée, PM… pour Palissy). |
| **Service** (`service`) | Unité de rattachement d'un agent (UDAP, CRMH, etc.), avec ses départements (`dept_numbers`), ses adresses d'alerte et ses en-têtes PDF. |
| **Service instructeur** (`service_instructeurs`) | Mairie ou intercommunalité qui instruit les autorisations d'urbanisme mentionnées dans un compte-rendu. |
| **SRA** | Service régional de l'archéologie. |
| **UDAP** | Unité départementale de l'architecture et du patrimoine. Service déconcentré où travaillent les ABF. |

## 2. Technique

| Terme | Définition |
| --- | --- |
| **AttachmentQueue** | File du SDK PowerSync qui synchronise les fichiers (photos, PDF) avec le stockage objet. |
| **Bascule** (*cutover*) | Moment du passage de l'ancien au nouvel hébergement. |
| **BAN, API Adresse** | Base adresse nationale et son API de géocodage (`api-adresse.data.gouv.fr`). |
| **Bucket (PowerSync)** | Lot de lignes pré-calculé par PowerSync pour un jeu de paramètres. À ne pas confondre avec le bucket S3. |
| **Bucket (S3)** | Conteneur de fichiers du stockage objet. |
| **Checkpoint** | Point de cohérence que le client PowerSync applique d'un seul bloc. |
| **Coolify** | PaaS auto-hébergé qui pilote les conteneurs du VPS actuel. |
| **CORS** | Règles qui autorisent un site web à appeler un autre domaine (ici le navigateur vers S3 et vers l'API). |
| **DSFR** | Système de design de l'État. Police **Marianne**. |
| **Drizzle** | Outil de définition du schéma et de génération des migrations SQL. |
| **Émetteur** (`iss`) | Champ d'un jeton qui identifie le fournisseur d'identité qui l'a signé. |
| **File CRUD** (`ps_crud`) | Écritures locales en attente d'envoi au backend. |
| **GHCR** | Registre d'images de conteneurs de GitHub (`ghcr.io`). |
| **Géoplateforme IGN** | Service cartographique national (`data.geopf.fr`) qui fournit l'imagerie aérienne. |
| **JWKS** | Jeu de clés publiques publié par le fournisseur d'identité pour vérifier les jetons. |
| **JWT** | Jeton signé contenant l'identité de l'utilisateur (ici émis par Keycloak). |
| **Keycloak** | Fournisseur d'identité open source (OIDC) qui gère les comptes. |
| **Keycloakify** | Outil de création de thèmes Keycloak (ici le thème DSFR, `keycloak-theme.jar`). |
| **Kysely** | Constructeur de requêtes SQL typé, utilisé côté backend et côté navigateur. |
| **Last-write-wins** | Résolution de conflit où la dernière écriture reçue par le serveur l'emporte. |
| **Lien court** (`attachment_redirection`) | URL publique `/attachment/:id` insérée dans les e-mails, valable 90 jours. |
| **Mailpit** | Faux serveur SMTP de développement qui capture les e-mails. |
| **MEP** | Mise en production. |
| **Mode unified** | Mode de PowerSync où réplication et API tournent dans un même processus. |
| **Offline-first** | L'application fonctionne d'abord sur sa base locale ; la synchronisation est asynchrone. |
| **OPFS** | Système de fichiers privé du navigateur, stockage rapide. |
| **PowerSync** | Service qui réplique PostgreSQL vers des bases SQLite dans les navigateurs. |
| **ProConnect** | Fédération d'identité des agents publics (anciennement AgentConnect). |
| **Publication** | Liste des tables PostgreSQL dont les changements sont diffusés par réplication logique (ici `powersync`). |
| **PWA** | Application web progressive : installable, utilisable hors ligne grâce au *service worker*. |
| **Réplication logique** | Lecture du journal PostgreSQL (WAL) sous forme de changements ligne à ligne. |
| **ROPC, password grant** | Échange direct identifiant et mot de passe contre des jetons OAuth. C'est ce que fait le backend auprès de Keycloak. |
| **RPO / RTO** | Perte de données maximale admise / durée maximale de rétablissement. |
| **Service worker** | Script du navigateur qui met l'application en cache et intercepte les requêtes. |
| **Slot de réplication** | Curseur côté PostgreSQL qui retient le WAL tant que PowerSync ne l'a pas lu. |
| **Soft delete** | Suppression logique par un drapeau (`disabled`, `is_deprecated`) ; la ligne reste en base. |
| **Sync stream** | Règle PowerSync qui déclare quelles lignes un client reçoit ([sync-config.yaml](../powersync/sync-config.yaml)). |
| **TypeBox** | Bibliothèque de schémas qui valide les requêtes de l'API et produit l'OpenAPI. |
| **URL pré-signée** | URL S3 temporaire et signée qui autorise une lecture ou une écriture sans identifiants. |
| **WAL** | *Write-Ahead Log*, journal des écritures de PostgreSQL. |
| **wa-sqlite** | SQLite compilé en WebAssembly pour le navigateur. |
| **Web Speech API** | API de reconnaissance vocale du navigateur, utilisée pour la dictée. |
| **WMTS, tuile vectorielle** | Formats de diffusion des fonds de carte. |
