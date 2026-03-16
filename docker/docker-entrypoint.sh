#!/usr/bin/env bash
set -euo pipefail

NODE_USER="${DEVCONTAINER_USER:-node}"
NODE_UID="$(id -u "${NODE_USER}")"
NODE_GID="$(id -g "${NODE_USER}")"

mkdir -p /workspace/node_modules /workspace/.angular /workspace/.nx /pnpm/store
chown "${NODE_UID}:${NODE_GID}" /workspace/node_modules /workspace/.angular /workspace/.nx /pnpm/store

if [ "$#" -eq 0 ]; then
  exec runuser -u "${NODE_USER}" -- /bin/bash
fi

exec runuser -u "${NODE_USER}" -- "$@"
