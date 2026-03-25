# Renderers, Kits, and Adapters

This document explains how to choose between the different integration layers in ng-orbit.

## Rule of thumb

- choose `core` when your product owns the final UI
- add a `kit` when repeated wiring should be reduced without shipping a full renderer
- add a `renderer` when you want a ready-to-install first UI layer
- use `adapter` as the concept name for the layer connecting headless state to your UI

## Ready packages today

### Core
- `@ng-orbit/notify`
- `@ng-orbit/table`
- `@ng-orbit/wizard`

### Helper package
- `@ng-orbit/wizard-kit`

### Ready renderer packages
- `@ng-orbit/notify-render-plain`
- `@ng-orbit/table-render-plain`
- `@ng-orbit/table-render-material`
- `@ng-orbit/table-render-daisy`
- `@ng-orbit/wizard-render-material`
- `@ng-orbit/wizard-render-daisy`

## Placeholders in the repo

These exist in the workspace but should not be presented as consumer-ready:
- `@ng-orbit/table-kit`
- `@ng-orbit/wizard-render-plain`

## How renderer interaction works

The renderer contract is intentionally simple:

1. a renderer reads state from the headless controller
2. a renderer calls controller commands in response to user intent
3. the parent feature reacts to emitted outputs
4. the parent updates inputs such as `rows`, `query`, `loading`, `error`, or step definitions

Example flow for table:

1. renderer calls `toggleSort`, `setSearch`, `setPage`, or `toggleRow`
2. `OrbitTableDirective` emits `orbitTableQueryChange` or `orbitTableSelectionChange`
3. the consuming feature maps the query to backend params and fetches data
4. the renderer reflects the updated inputs

Example flow for wizard:

1. renderer calls `next`, `prev`, `goTo`, or `setValid`
2. `OrbitWizardDirective` updates current, visited, validity, and progress state
3. the consuming feature decides what completion means and persists data if needed

Example flow for notify:

1. a feature calls `notify.success(...)`, `notify.show(...)`, `notify.openBlocking(...)`, or `notify.confirm(...)`
2. `OrbitNotifyService` updates the visible toast stack or blocking queue
3. a renderer reflects the latest state and forwards actions back into the service
4. the consuming feature reacts to the resolved result and performs product side effects

## Adapter boundaries

What belongs in an adapter:
- markup and layout
- component composition
- mapping UI events into controller commands
- framework-specific visual integration

What stays outside:
- backend interaction
- business validation rules
- form ownership
- submission side effects
- analytics and product-specific orchestration

## Consumer guidance

- if you already have a design system, start with the headless controller and build a custom adapter
- if you use Angular forms for wizard steps, add `@ng-orbit/wizard-kit`
- if you need a faster first UI layer, install one of the ready renderer packages

Use the local docs host for live guidance:
- `/notify`
- `/table`
- `/wizard`
- `/adapters`
