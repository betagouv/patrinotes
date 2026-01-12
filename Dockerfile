################################
# BASE IMAGE FOR EVERY SERVICE #
################################
FROM node:20.11-alpine AS with-pnpm
RUN apk add --no-cache \
build-base \
g++ \
cairo-dev \
jpeg-dev \
pango-dev \
giflib-dev \
pixman-dev \
pangomm-dev \
libjpeg-turbo-dev \
freetype-dev 
RUN npm i -g pnpm@10.12.4

################################
#      DEPS INSTALLATION       #
################################
FROM with-pnpm AS with-deps
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches/

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
CMD pnpm migration:up;pnpm backend start


################################
#      FRONTEND SERVICE        #
################################
FROM with-deps AS frontend
COPY packages/frontend/ ./packages/frontend/
COPY packages/pdf/ ./packages/pdf/
COPY --from=with-deps /usr/src/app/packages/frontend/node_modules ./packages/frontend/node_modules

RUN pnpm frontend build
CMD ["pnpm", "frontend", "preview"]