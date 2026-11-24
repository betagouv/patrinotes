# Essai : comptes rendus dans Docs (La Suite numérique)

Essai mené le 24/11/2026, **pas d'intégration prévue pour l'instant**. Question posée : peut-on
générer nos documents (comptes rendus, puis constats d'état) dans
[Docs](https://github.com/suitenumerique/docs), l'éditeur collaboratif de La Suite numérique ?

## Ce qu'on a fait

1. Instance Docs **v6.1.0** auto-hébergée (`compose.yaml`, `setup.sh`), avec son Keycloak, MinIO,
   Postgres, le serveur de collaboration (yhub) et le service de conversion (y-provider).
2. `cr-html.tsx` : HTML de 3 comptes rendus d'exemple, produit par la vraie fonction
   `getReportHtmlString` de Patrinotes.
3. `import_docs.py` : un document Docs par compte rendu. Le HTML est converti en **JSON BlockNote**
   (le format natif de Docs : une liste de blocs `{type, props, content, children}`), les photos
   (aplats de couleur) sont téléversées comme vraies pièces jointes et ajoutées en blocs `image`.
4. `export_doc.py` + `cr-pdf.tsx` : on relit le contenu depuis Docs (HTML + photos) et on le passe
   dans `ReportPDFDocument` : le PDF est **identique** à celui de Patrinotes (en-tête Marianne,
   pagination, grille de photos).

## Constats

- **Licence** : Docs est sous MIT ; seuls les exports PDF/DOCX/ODT (paquets « XL » de BlockNote)
  sont sous GPL (build sans eux avec `PUBLISH_AS_MIT=true`). Auto-hébergement documenté
  (Compose, Kubernetes, Scalingo).
- **Créer un document par API** : `POST /api/v1.0/documents/create-for-owner/` (jeton serveur à
  serveur, `SERVER_TO_SERVER_API_TOKENS`) n'accepte que du **Markdown**. Le convertisseur de la
  v6.1.0 lit Markdown, JSON BlockNote et Yjs, **pas le HTML** (d'où notre petit convertisseur
  HTML → BlockNote dans `import_docs.py`).
- **Photos** : l'API publique fixe le contenu à la création, et les pièces jointes ne peuvent être
  téléversées qu'après. Pour l'essai, `import_docs.py` passe par l'intérieur du backend
  (possible seulement sur notre instance). En production il faudrait écrire via le serveur de
  collaboration (websocket, comme l'éditeur) ou une évolution de l'API Docs.
- **Mise en page** : l'export PDF de Docs (Typst) n'a ni en-tête ni pied de page configurables ;
  avoir la Marianne demanderait de modifier Docs. La bonne approche est de garder notre
  générateur PDF et de lire le contenu dans Docs (`formatted-content?content_format=html`).
- **Identité** : `create-for-owner` attend le `sub` de l'agent. Avec un Keycloak partagé entre
  Patrinotes et Docs, c'est le même ; avec ProConnect sur l'instance de l'État, il faut le repli
  sur l'email (`OIDC_FALLBACK_TO_EMAIL_FOR_IDENTIFICATION`).

## Conclusion

Pour un compte rendu rédigé par une seule personne puis envoyé, Docs n'apporte pas grand-chose
par rapport à l'éditeur actuel (Tiptap, de la même famille que BlockNote), et **casse le
hors-ligne**. Il ne vaudrait le coup que pour un vrai besoin de rédaction ou de relecture à
plusieurs (temps réel, commentaires, versions). Pistes plus légères si ce besoin apparaît :
collaboration Yjs directement dans Tiptap, ou un bouton « Envoyer dans Docs » une fois le compte
rendu finalisé.

## Relancer l'essai

Docs exige HTTPS : il faut deux noms d'hôte HTTPS vers les ports locaux (ici les passerelles
`*-dev.mledoux.fr`, avec `BIND_ADDRESS=10.0.0.1`).

```bash
cd scripts/essai-docs
BIND_ADDRESS=10.0.0.1 ./setup.sh                # instance + compte martin / essai-docs
pnpm tsx scripts/essai-docs/cr-html.tsx > scripts/essai-docs/work/reports.json   # depuis la racine
C=$(docker compose ps -q backend)
docker cp work/reports.json $C:/tmp/ && docker cp import_docs.py $C:/tmp/
docker compose exec -T backend sh -c 'python manage.py shell < /tmp/import_docs.py'
# … modifier les documents dans Docs, puis relire et produire les PDF Patrinotes :
docker cp export_doc.py $C:/tmp/ && docker compose exec -T backend sh -c 'python manage.py shell < /tmp/export_doc.py'
docker cp $C:/tmp/export.json work/
pnpm tsx scripts/essai-docs/cr-pdf.tsx scripts/essai-docs/work/export.json scripts/essai-docs/work/pdf   # depuis la racine
docker compose down -v && rm -rf work               # nettoyage
```
