# ng-orbit

**ng-orbit** is a modern **Angular headless component library** focused on orchestration and composition:
data tables, form wizards, and other reusable primitives that **do not depend on any UI framework**.

ng-orbit targets **modern Angular**:
- Standalone-first
- Signals-first APIs
- New control flow (`@if`, `@for`, `@switch`)
- Design-system agnostic (Material, DaisyUI/Tailwind, custom UI)

> Baseline: Angular **21.2.0**. First stable target: Angular **22**.

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

- `apps/demo/` — demo Angular app showcasing core + kit + default renderers
- `packages/` — publishable libraries
- `docs/` — architecture and component specifications

See `docs/repo-structure.md`.

---

## Getting started

### Install
```bash
pnpm install
```

### Run demo
```bash
pnpm demo
```

### Build all
```bash
pnpm build
```

---

## Documentation
- `docs/architecture.md`
- `docs/components/table.md`
- `docs/components/wizard.md`
- `docs/renderers.md`
- `docs/repo-structure.md`
- `docs/demo.md`

---

## License
MIT
