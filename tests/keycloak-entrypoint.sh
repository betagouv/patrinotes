#!/bin/sh
envsubst < /opt/keycloak/data/import/realm-template.json > /opt/keycloak/data/import/realm-export.json
exec /opt/keycloak/bin/kc.sh "$@"