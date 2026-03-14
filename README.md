# ng-orbit

**ng-orbit** is a modern **Angular headless component library** focused on orchestration and composition:
data tables, form wizards, and other reusable primitives that **do not depend on any UI framework**.

ng-orbit targets **modern Angular**:
- Standalone-first
- Signals-first APIs
- New control flow (`@if`, `@for`, `@switch`)
- Design-system agnostic (Material, DaisyUI/Tailwind, custom UI)

> Baseline: Angular **21.2.1**. First stable target: Angular **22**.

---

## Why headless?

UI frameworks and design systems differ a lot:
- Some teams want **Angular Material**.
- Others want **Tailwind/DaisyUI**.
- Some teams have a custom design system.

ng-orbit separates concerns:
- **Core (headless)**: state + logic + accessibility contracts + events (no CSS, no HTML assumptions).
- **Kits / Renderers (optional)**: UI primitives or fully composed renderers for common stacks.

This lets consumers fully control:
- Titles vs no titles
- Progress indicators vs none
- Steppers vs tabs vs sidebar navigation
- Table styling, cell templates, row actions

---

## Packages

### Core
- `@ng-orbit/table` — headless table state & contracts
- `@ng-orbit/wizard` — headless wizard state & contracts

### Optional UI kits (primitives, template-first)
- `@ng-orbit/table-kit` — composable building blocks
- `@ng-orbit/wizard-kit` — composable building blocks

### Optional renderers (quick start)
- `@ng-orbit/table-render-plain`
- `@ng-orbit/table-render-material`
- `@ng-orbit/table-render-daisy`
- `@ng-orbit/wizard-render-plain`
- `@ng-orbit/wizard-render-material`
- `@ng-orbit/wizard-render-daisy`

> Renderers are optional. The recommended path is core + kit (consumer owns UI).

---

## Repo structure (Nx + pnpm)

This repo uses **pnpm workspaces** and **Nx**.

- `apps/demo-core/` — host app (core/plain + isolated remotes)
- `apps/demo-material/` — Material visual environment
- `apps/demo-daisy/` — Daisy visual environment
- `packages/` — publishable libraries
- `docs/` — architecture and component specifications

See `docs/repo-structure.md`.

---

## Consumer docs

The fastest way to understand the library as a consumer is to run the local docs host:

```bash
pnpm install
pnpm demo
```

Open:
- `http://127.0.0.1:4200/table`
- `http://127.0.0.1:4200/wizard`

Each feature page includes:
- `Overview` for mental model and responsibilities
- `API` for controller inputs, outputs, signals, commands, and types
- `Renders` for optional renderer packages and "build your own" guidance
- `Examples` for live previews plus integration snippets

`demo-core` is the consumer-facing docs host. `demo-material` and `demo-daisy` remain isolated preview apps used by the docs host for renderer demos.

## Getting started

### Install
```bash
pnpm install
```

### Run local docs and demos
```bash
pnpm demo
```

Composition model: iframe-isolated previews (stability-first), with federation configs reserved for a future phase.

Individual apps:
```bash
pnpm demo:core
pnpm demo:material
pnpm demo:daisy
```

### Build all
```bash
pnpm build
```

---

## Documentation
- Consumer docs host:
  - `/table`
  - `/wizard`
- Internal markdown specs:
- `docs/architecture.md`
- `docs/components/table.md`
- `docs/components/wizard.md`
- `docs/renderers.md`
- `docs/repo-structure.md`
- `docs/demo.md`

---

## Table MVP usage (headless + plain renderer)

`@ng-orbit/table` exposes a headless controller.  
`@ng-orbit/table-render-plain` is a minimal reference UI that calls controller commands.

```html
<section
  orbitTable
  #t="orbitTable"
  [rows]="state.rows"
  [columns]="columns"
  [total]="state.total"
  [loading]="state.loading"
  [error]="state.error"
  [query]="query"
  [getRowId]="getRowId"
  (orbitTableQueryChange)="onQueryChange($event)"
  (orbitTableSelectionChange)="onSelectionChange($event)"
>
  <orbit-table-render-plain [table]="t"></orbit-table-render-plain>
</section>
```

---

## License
MIT
