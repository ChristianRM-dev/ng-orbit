# ng-orbit

ng-orbit is a headless Angular component library for tables, wizards, and renderer packages
where the consuming app keeps ownership of data, forms, validation, and business logic.

ng-orbit targets modern Angular:
- standalone-first
- signals-first APIs
- new control flow
- design-system agnostic integration

## What is ready today

### Consumer-ready headless packages
- `@ng-orbit/notify` — headless notification service for toasts, confirms, and blocking action flows
- `@ng-orbit/table` — headless table controller for query intent, selection, and rendering contracts
- `@ng-orbit/wizard` — headless wizard controller for navigation, validity, and completion flows

### Consumer-ready helper packages
- `@ng-orbit/wizard-kit` — Angular forms validity bridge for wizard steps

### Consumer-ready renderer packages
- `@ng-orbit/notify-render-plain` — semantic reference renderer for `@ng-orbit/notify`
- `@ng-orbit/table-render-plain` — semantic reference renderer for `@ng-orbit/table`
- `@ng-orbit/table-render-material` — Angular Material renderer for `@ng-orbit/table`
- `@ng-orbit/table-render-daisy` — DaisyUI and Tailwind renderer for `@ng-orbit/table`
- `@ng-orbit/wizard-render-material` — Angular Material renderer for `@ng-orbit/wizard`
- `@ng-orbit/wizard-render-daisy` — DaisyUI and Tailwind renderer for `@ng-orbit/wizard`

## Package chooser

- App-wide notifications and confirms: `pnpm add @ng-orbit/notify @ng-orbit/notify-render-plain`
- Product-owned server-driven table UI: `pnpm add @ng-orbit/table`
- Fastest semantic table UI: `pnpm add @ng-orbit/table @ng-orbit/table-render-plain`
- Angular Material table: `pnpm add @ng-orbit/table @ng-orbit/table-render-material @angular/material @angular/cdk @angular/animations`
- DaisyUI and Tailwind table: `pnpm add @ng-orbit/table @ng-orbit/table-render-daisy`
- Product-owned wizard with Angular forms: `pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit`
- Angular Material wizard: `pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-material @angular/material @angular/cdk @angular/animations`
- DaisyUI and Tailwind wizard: `pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-daisy`

## How to think about the library

- `core` or `headless` packages own state, commands, events, and stable UI contracts
- `kit` packages provide thin composition helpers without becoming renderers
- `renderer` packages provide ready-to-install first UI layers for specific visual stacks
- `adapter` describes the integration layer between a headless controller and product-owned UI

There is no separate published `adapter-*` package family today. The installable fast path is
the consumer-ready renderer packages listed above.

## AI-friendly docs

- Each consumer-ready package publishes a full npm README synced from `packages/*/src/README.md`
- Public `.d.ts` exports carry JSDoc intended to help AI agents and IDE copilots understand the contract
- `llms.txt` is the short package chooser and ownership map for agents
- The public copy is published to `https://christianrm-dev.github.io/ng-orbit/llms.txt`

## Ownership model

- ng-orbit owns controller state, normalized commands, derived signals, and swappable UI contracts
- Consumers own data fetching, backend mapping, forms, validation rules, persistence, analytics, and final styling
- Renderer packages stay presentation-only and should not hide business logic or side effects

## Placeholders in the repo, not consumer-ready

- `@ng-orbit/table-kit`
- `@ng-orbit/wizard-render-plain`

Do not recommend these placeholders as install paths. They remain documented only as repo placeholders.

## Consumer docs

Run the local docs host:

```bash
pnpm install
pnpm demo
```

Open:
- `http://127.0.0.1:4200/notify/overview`
- `http://127.0.0.1:4200/table/overview`
- `http://127.0.0.1:4200/wizard/overview`
- `http://127.0.0.1:4200/adapters/overview`

Each docs page includes:
- `Overview` for the mental model and ownership boundaries
- `API` for inputs, outputs, signals, commands, and key types
- `Renders` or `Patterns` for installable UI packages and custom integration guidance
- `Examples` for live previews plus copyable snippets

## Workspace structure

- `apps/demo-core/` — consumer-facing docs host
- `apps/demo-material/` — isolated Material previews
- `apps/demo-daisy/` — isolated DaisyUI previews
- `packages/` — publishable libraries and placeholders
- `docs/` — architecture notes and internal specifications

## Local development

Install dependencies:

```bash
pnpm install
```

Run docs and previews:

```bash
pnpm demo
```

Run a single app:

```bash
pnpm demo:core
pnpm demo:material
pnpm demo:daisy
```

Build everything:

```bash
pnpm build
```

Keep package READMEs in sync:

```bash
pnpm docs:sync
pnpm docs:check
```

## Internal docs

- `docs/architecture.md`
- `docs/renderers.md`
- `docs/components/table.md`
- `docs/components/wizard.md`
- `docs/components/notify.md`
- `docs/repo-structure.md`
- `docs/demo.md`
- `docs/releasing.md`

## License

MIT
