# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-bookworm

ENV PNPM_HOME=/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

WORKDIR /workspace

COPY --chmod=755 docker/docker-entrypoint.sh /usr/local/share/ng-orbit/docker-entrypoint.sh

RUN apt-get update \
    && apt-get install -y --no-install-recommends ripgrep tree \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@10.30.3 --activate \
    && mkdir -p /pnpm/store /workspace \
    && chown -R node:node /pnpm /workspace

USER node

RUN pnpm config set store-dir /pnpm/store \
    && pnpm config set package-import-method copy
