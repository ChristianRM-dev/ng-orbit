# Architecture

ng-orbit follows a strict separation of concerns:

## 1) Core (headless)
Core packages contain:
- State management (signals)
- Derived state (computed)
- Events and commands (next/prev/sort/select/etc.)
- Small, stable contracts (interfaces) between core and UI
- No CSS / SCSS
- No hard dependency on UI frameworks

Core exposes an API usable from templates:
- `exportAs` controller (e.g. `#t="orbitTable"`, `#w="orbitWizard"`)
- Signals for state (`current`, `steps`, `sort`, `progress`, etc.)
- Methods for commands (`next`, `prev`, `goTo`, etc.)

## 2) Kits (UI primitives, template-first)
Kits provide optional building blocks that:
- read the core API (DI or input)
- compute UI-friendly data (e.g. progress percent)
- expose template outlets for total customization

Kits should:
- not ship CSS
- allow consumers to decide layout and styling
- keep logic out of application code (reduce repeated patterns)

## 3) Renderers (optional, quick start)
Renderers are complete UIs for specific stacks:
- Angular Material: uses `mat-table`, `mat-stepper`, etc.
- DaisyUI: uses class-based styling (no CSS shipped)
- Plain: semantic HTML, minimal assumptions

Renderers must be optional dependencies so core stays lightweight.

## Non-goals
- ng-orbit is not a design system.
- ng-orbit does not enforce visual styling.
- ng-orbit does not own consumer forms (wizard steps are consumer components).

## Angular target
Development baseline is Angular 21.2.0, with first stable release aiming at Angular 22.
