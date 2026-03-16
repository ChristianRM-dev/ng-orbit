# Architecture

ng-orbit follows a strict separation of concerns so consumers can keep product logic outside the
UI layer.

## 1. Core or headless packages

Core packages own:
- state management
- derived state
- events and command methods
- small, stable UI contracts

Core packages do not own:
- CSS or SCSS
- design-system components
- backend calls
- business filtering, sorting, or submission rules

Current headless packages:
- `@ng-orbit/table`
- `@ng-orbit/wizard`

## 2. Kits

Kits are optional composition helpers, not full renderers.

Current public kit:
- `@ng-orbit/wizard-kit` — Angular forms validity bridge for wizard steps

Placeholder in the repo:
- `@ng-orbit/table-kit` — not consumer-ready yet

Kits should:
- stay thin
- avoid CSS
- help consumers reduce repeated wiring without taking over layout

## 3. Renderers

Renderers are ready-to-install UI packages for specific visual stacks.

Ready renderer packages today:
- `@ng-orbit/table-render-plain`
- `@ng-orbit/table-render-material`
- `@ng-orbit/table-render-daisy`
- `@ng-orbit/wizard-render-material`
- `@ng-orbit/wizard-render-daisy`

Placeholder in the repo:
- `@ng-orbit/wizard-render-plain` — not consumer-ready yet

Renderers should:
- map headless state into UI
- call controller commands only
- stay presentation-only

Renderers must not:
- fetch data directly
- own form state
- own submission side effects
- own business rules that belong in the feature layer

## 4. Adapters

In ng-orbit, an adapter is the integration layer between a headless controller and a product UI.

An adapter can be:
- custom markup around `orbitTable` or `orbitWizard`
- a kit-assisted composition layer
- an installable renderer package

There is no separate published `adapter-*` package family today. The fast install path is the
renderer packages listed above.

## 5. Non-goals

- ng-orbit is not a design system
- ng-orbit does not own consumer forms
- ng-orbit does not hide backend integration
- ng-orbit does not enforce one visual stack

## Angular target

Development baseline is Angular `21.2.1`, with the first stable release aimed at Angular `22`.

