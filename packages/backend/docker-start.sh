#!/bin/sh
# Point d'entrée de l'image backend.
# - set -e : si la migration échoue, le conteneur s'arrête au lieu de servir un schéma incomplet.
# - exec : node remplace le shell (PID 1) et reçoit directement SIGTERM/SIGINT.
set -e
cd /usr/src/app
pnpm migration:up
cd packages/backend
export NODE_ENV=production
exec node ./dist/index.js
