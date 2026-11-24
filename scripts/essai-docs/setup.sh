#!/usr/bin/env bash
# Monte une instance d'essai de Docs (La Suite numérique) v6.1.0 dans ./work :
# configuration, clés, Keycloak avec un compte de test, base et serveur de collaboration.
#
#   DOCS_HOST=docs.exemple.fr KEYCLOAK_HOST=id.exemple.fr ./setup.sh
#
# Docs exige HTTPS (cookies « secure », websocket wss) : les deux noms d'hôte doivent
# pointer, en HTTPS, vers ${BIND_ADDRESS}:${DOCS_PORT} et ${BIND_ADDRESS}:${KEYCLOAK_PORT}.
set -euo pipefail
cd "$(dirname "$0")"

DOCS_HOST=${DOCS_HOST:-5470-dev.mledoux.fr}
KEYCLOAK_HOST=${KEYCLOAK_HOST:-5471-dev.mledoux.fr}
TEST_USER=${TEST_USER:-martin}
TEST_PASSWORD=${TEST_PASSWORD:-essai-docs}
DOCS_VERSION=v6.1.0

mkdir -p work/env.d work/keys work/data/keycloak work/data/minio work/data/valkey
chmod 777 work/data/keycloak
gen() { openssl rand -hex 24; }

if [ ! -f work/keys/private.pem ]; then
  openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out work/keys/private.pem 2>/dev/null
  openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out work/keys/yhub-private.pem 2>/dev/null
  chmod 600 work/keys/*.pem
fi
# Royaume Keycloak de développement de Docs (client « impress »)
[ -f work/realm.json ] || curl -fsSL -o work/realm.json \
  "https://raw.githubusercontent.com/suitenumerique/docs/$DOCS_VERSION/docker/auth/realm.json"

if [ ! -f work/env.d/backend ]; then
  DBPW=$(gen); YPK=$(gen); MINIOPW=$(gen); KCPW=$(gen)
  KC=http://keycloak:8080/realms/impress/protocol/openid-connect
  KCPUB=https://$KEYCLOAK_HOST/realms/impress/protocol/openid-connect
  cat > work/env.d/common <<EOF
DOCS_HOST=$DOCS_HOST
KEYCLOAK_HOST=$KEYCLOAK_HOST
BACKEND_HOST=backend
FRONTEND_HOST=frontend
YPROVIDER_HOST=y-provider
YHUB_HOST=yhub
BUCKET_NAME=docs-media-storage
REALM_NAME=impress
COLLABORATION_WS_URL=wss://$DOCS_HOST/collaboration/ws/v1/docs
EOF
  cat > work/env.d/postgresql <<EOF
DB_HOST=postgresql
DB_NAME=docs
DB_USER=docs
DB_PASSWORD=$DBPW
DB_PORT=5432
POSTGRES_DB=docs
POSTGRES_USER=docs
POSTGRES_PASSWORD=$DBPW
EOF
  # Les appels internes (yhub, y-provider) passent par le nginx du frontend (frontend:8083),
  # pas par le nom public, qui peut être derrière un proxy d'authentification.
  cat > work/env.d/backend <<EOF
DJANGO_ALLOWED_HOSTS=$DOCS_HOST,backend,frontend,localhost
DJANGO_SECRET_KEY=$(gen)$(gen)
DJANGO_SETTINGS_MODULE=impress.settings
DJANGO_CONFIGURATION=Production
LOGGING_LEVEL_HANDLERS_CONSOLE=INFO
PYTHONPATH=/app
JWT_PRIVATE_KEY_FILE=/keys/private.pem
YHUB_API_BASE_URL=http://yhub:3002
DJANGO_EMAIL_HOST=mailcatcher
DJANGO_EMAIL_PORT=1025
DJANGO_EMAIL_FROM=docs@essai.local
DJANGO_EMAIL_URL_APP=https://$DOCS_HOST
AWS_S3_ENDPOINT_URL=http://minio:9000
AWS_S3_ACCESS_KEY_ID=docs
AWS_S3_SECRET_ACCESS_KEY=$MINIOPW
AWS_STORAGE_BUCKET_NAME=docs-media-storage
MEDIA_BASE_URL=https://$DOCS_HOST
OIDC_OP_JWKS_ENDPOINT=$KC/certs
OIDC_OP_AUTHORIZATION_ENDPOINT=$KCPUB/auth
OIDC_OP_TOKEN_ENDPOINT=$KC/token
OIDC_OP_USER_ENDPOINT=$KC/userinfo
OIDC_OP_LOGOUT_ENDPOINT=$KCPUB/logout
OIDC_RP_CLIENT_ID=impress
OIDC_RP_CLIENT_SECRET=ThisIsAnExampleKeyForDevPurposeOnly
OIDC_RP_SIGN_ALGO=RS256
OIDC_RP_SCOPES="openid email"
LOGIN_REDIRECT_URL=https://$DOCS_HOST
LOGIN_REDIRECT_URL_FAILURE=https://$DOCS_HOST
LOGOUT_REDIRECT_URL=https://$DOCS_HOST
OIDC_REDIRECT_ALLOWED_HOSTS=["https://$DOCS_HOST"]
SERVER_TO_SERVER_API_TOKENS=$(gen)
CONVERSION_UPLOAD_ENABLED=true
EOF
  cat > work/env.d/yprovider <<EOF
Y_PROVIDER_API_BASE_URL=http://y-provider:4444/api/
Y_PROVIDER_API_KEY=$YPK
COLLABORATION_SERVER_ORIGIN=https://$DOCS_HOST
COLLABORATION_BACKEND_BASE_URL=http://frontend:8083
COLLABORATION_LOGGING=true
EOF
  cat > work/env.d/yhub <<EOF
PORT=3002
REDIS=redis://yhub-valkey:6379
REDIS_PREFIX=yhub
POSTGRES=postgres://docs:$DBPW@postgresql:5432/yhub
COLLABORATION_BACKEND_BASE_URL=http://frontend:8083
COLLABORATION_SERVER_ORIGIN=https://$DOCS_HOST
Y_PROVIDER_API_KEY=$YPK
YHUB_JWT_PRIVATE_KEY_FILE=/keys/yhub-private.pem
EOF
  printf 'MINIO_ROOT_USER=docs\nMINIO_ROOT_PASSWORD=%s\n' "$MINIOPW" > work/env.d/minio
  cat > work/env.d/keycloak <<EOF
KC_BOOTSTRAP_ADMIN_USERNAME=admin
KC_BOOTSTRAP_ADMIN_PASSWORD=$KCPW
KC_HOSTNAME=https://$KEYCLOAK_HOST
KC_HOSTNAME_BACKCHANNEL_DYNAMIC=true
KC_PROXY_HEADERS=xforwarded
KC_HTTP_ENABLED=true
EOF
fi

docker compose up -d postgresql yhub-valkey redis
sleep 5
docker compose run --rm yhub node dist/init-db.js --attempts=1
docker compose run --rm backend python manage.py migrate
docker compose up -d

# Compte de test : utilisateur Keycloak + utilisateur Docs de même « sub »,
# pour que les documents importés lui appartiennent avant sa première connexion.
. work/env.d/keycloak
KCURL=http://127.0.0.1:${KEYCLOAK_PORT:-5471}
[ "${BIND_ADDRESS:-127.0.0.1}" = 127.0.0.1 ] || KCURL=http://$BIND_ADDRESS:${KEYCLOAK_PORT:-5471}
until curl -fs "$KCURL/realms/impress" >/dev/null; do sleep 3; done
TOK=$(curl -s -d "client_id=admin-cli&username=admin&password=$KC_BOOTSTRAP_ADMIN_PASSWORD&grant_type=password" \
  "$KCURL/realms/master/protocol/openid-connect/token" | python3 -c 'import sys,json;print(json.load(sys.stdin)["access_token"])')
curl -s -o /dev/null -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' "$KCURL/admin/realms/impress/users" \
  -d "{\"username\":\"$TEST_USER\",\"email\":\"$TEST_USER@essai.local\",\"firstName\":\"$TEST_USER\",\"enabled\":true,\"emailVerified\":true,\"credentials\":[{\"type\":\"password\",\"value\":\"$TEST_PASSWORD\",\"temporary\":false}]}"
SUB=$(curl -s -H "Authorization: Bearer $TOK" "$KCURL/admin/realms/impress/users?username=$TEST_USER&exact=true" \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')
docker compose exec -T backend python manage.py shell -c "
from core.models import User
if not User.objects.filter(sub='$SUB').exists():
    u = User(sub='$SUB', email='$TEST_USER@essai.local', full_name='$TEST_USER', language='fr-fr')
    u.set_unusable_password(); u.save()
"
echo "Docs : https://$DOCS_HOST (compte $TEST_USER / $TEST_PASSWORD)"
