# ng-orbit

ng-orbit is a headless Angular component library for tables, wizards, and other reusable UI
contracts where the consuming app should keep ownership of data, forms, and business logic.

ng-orbit targets modern Angular:
- standalone-first
- signals-first APIs
- new control flow
- design-system agnostic integration

## What is ready today

### Core packages
- `@ng-orbit/table`
- `@ng-orbit/wizard`

### Ready helper packages
- `@ng-orbit/wizard-kit` — Angular forms validity bridge for wizard steps

### Ready renderer packages
- `@ng-orbit/table-render-plain`
- `@ng-orbit/table-render-material`
- `@ng-orbit/table-render-daisy`
- `@ng-orbit/wizard-render-material`
- `@ng-orbit/wizard-render-daisy`

### Placeholders in the repo
- `@ng-orbit/table-kit` — placeholder, not consumer-ready
- `@ng-orbit/wizard-render-plain` — placeholder, not consumer-ready

## How to think about the library

- `core` or `headless` packages own state, commands, events, and stable UI contracts
- `kit` packages provide small composition helpers without becoming a renderer
- `renderer` packages provide a ready-to-install first UI layer for a specific stack
- `adapter` describes the integration layer between a headless controller and your product UI

There is no separate published `adapter-*` package family today. The installable fast path is
the renderer packages listed above.

## Recommended path

- Use `@ng-orbit/table` or `@ng-orbit/wizard` when your product owns the final UI
- Add `@ng-orbit/wizard-kit` when Angular forms should drive wizard validity
- Add a renderer package when you want a faster first integration and can accept its visual stack

## Consumer docs

Run the local docs host:

```bash
pnpm install
pnpm demo
```

Open:
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

## Internal docs

- `docs/architecture.md`
- `docs/renderers.md`
- `docs/components/table.md`
- `docs/components/wizard.md`
- `docs/repo-structure.md`
- `docs/demo.md`
- `docs/releasing.md`

## License

MIT
