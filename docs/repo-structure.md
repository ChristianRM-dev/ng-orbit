# Repo structure (Nx + pnpm)

This repository is a pnpm workspace monorepo managed with Nx.

## Top-level layout
- `apps/`
  - `demo-core/` — host app with core/plain demos and isolated remote embeds
  - `demo-material/` — Angular Material visual demo app
  - `demo-daisy/` — DaisyUI visual demo app
- `packages/`
  - publishable libraries (`@ng-orbit/*`)
- `docs/` — specifications and architecture
- `tools/` — scripts (release, lint configs, etc.)

## Workspace config
- `pnpm-workspace.yaml` includes `apps/*` and `packages/*`.
- Root scripts use Nx targets (`serve`, `build`, `test`, `lint`).

## Dependency rules
### Core packages
- MUST NOT depend on Angular Material
- MUST NOT ship CSS/SCSS
- Should only depend on Angular + small utilities

### Render packages
- Can depend on UI frameworks (as peer deps where possible)
- Must not force-install UI frameworks for core consumers

## Docs & specs
Specs in `docs/` are the source of truth for behavior and API contracts.
