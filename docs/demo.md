# Demo apps

## Playground strategy
Demos are split by visual environment to prevent style bleed between design systems.

Apps:
- `apps/demo-core` — host app with:
  - local routes: `/table/core`, `/table/plain`
  - isolated remote routes via iframe: `/table/material`, `/table/daisy`
  - wizard placeholders (`/wizard/*`)
- `apps/demo-material` — Material visual environment (`/table/material`, `/wizard/material`)
- `apps/demo-daisy` — Daisy visual environment (`/table/daisy`, `/wizard/daisy`)

## Runtime composition
Current approach (stability-first):
- iframe embedding in `demo-core` for hard visual isolation.
- host manifest for iframe URLs (`apps/demo-core/src/assets/federation.manifest.json`).

Native Federation config files remain in the repo for a future phase, but runtime startup is iframe-only.

## Local ports
- demo-core: `4200`
- demo-material: `4201`
- demo-daisy: `4202`

## Commands
- `pnpm demo` — runs all three apps in parallel
- `pnpm demo:core`
- `pnpm demo:material`
- `pnpm demo:daisy`
