################################
# BASE IMAGE FOR EVERY SERVICE #
################################
FROM node:20.11-alpine AS with-pnpm
RUN npm i -g pnpm@10.12.4

################################
#      DEPS INSTALLATION       #
################################
FROM with-pnpm AS with-deps
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY packages/backend/package.json ./packages/backend/
COPY packages/pdf/package.json ./packages/pdf/

COPY packages/frontend/package.json ./packages/frontend/
COPY packages/frontend/public ./packages/frontend/public
COPY packages/frontend/scripts ./packages/frontend/scripts
COPY packages/frontend/vite.config.ts ./packages/frontend/

RUN pnpm install --frozen-lockfile


################################
#       BACKEND SERVICE        #
################################
FROM with-deps AS backend


WORKDIR /usr/src/app
COPY packages/backend/ ./packages/backend/
COPY packages/pdf/ ./packages/pdf/

COPY db/ ./db/
COPY --from=with-deps /usr/src/app/packages/backend/node_modules ./packages/backend/node_modules

RUN pnpm backend build
# Migration puis serveur ; le conteneur s'arrête si la migration échoue (voir docker-start.sh)
CMD ["sh", "/usr/src/app/packages/backend/docker-start.sh"]


################################
#      FRONTEND SERVICE        #
################################
FROM with-deps AS frontend
COPY packages/frontend/ ./packages/frontend/
COPY packages/pdf/ ./packages/pdf/
COPY --from=with-deps /usr/src/app/packages/frontend/node_modules ./packages/frontend/node_modules

RUN pnpm frontend build
CMD ["pnpm", "frontend", "preview"]