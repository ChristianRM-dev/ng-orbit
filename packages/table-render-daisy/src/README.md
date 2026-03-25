# @ng-orbit/table-render-daisy

DaisyUI renderer for `@ng-orbit/table`.

## AI Quick Map

- Role: ready DaisyUI and Tailwind renderer that maps `orbitTable` state into a class-based table shell
- Install: `pnpm add @ng-orbit/table @ng-orbit/table-render-daisy`
- Pair with: `@ng-orbit/table`
- Package owns: DaisyUI-flavored table markup, default controls, and UI-to-command wiring
- Consumer owns: Tailwind and DaisyUI setup, data fetching, backend query mapping, analytics, and product styling
- Recommended path: use this when your app already has Tailwind and DaisyUI and you want a quick first table renderer

## What it is

`@ng-orbit/table-render-daisy` packages a DaisyUI/Tailwind-flavored first UI layer around the
headless table controller.

## Install

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-daisy
```

This package expects Tailwind and DaisyUI to already exist in the consuming app.

## Use this when

- your product already uses DaisyUI or Tailwind utility classes
- you want a quick renderer without moving data flow into the UI layer
- you prefer class-based styling over a component framework

## Do not use this when

- you want the renderer to own data fetching or query persistence
- you need Angular Material components
- your host app does not provide Tailwind and DaisyUI

## Library owns

- DaisyUI and Tailwind-flavored table markup
- mapping UI events into `orbitTable` commands
- a ready-to-install first table shell for utility-class-based design systems

## Consumer owns

- data fetching and backend query mapping
- loading and error state
- product-specific styling tokens, analytics, and business behavior

## Primary exports

- `OrbitTableRenderDaisyComponent` for the ready DaisyUI and Tailwind table renderer

## Smallest working example

```html
<section
  orbitTable
  #table="orbitTable"
  [rows]="rows()"
  [columns]="columns"
  [total]="total()"
  [loading]="loading()"
  [error]="error()"
  [query]="query()"
  [getRowId]="getRowId"
  (orbitTableQueryChange)="onQueryChange($event)"
>
  <orbit-table-render-daisy [table]="table" />
</section>
```

## Related packages

- `@ng-orbit/table` for the headless controller
- `@ng-orbit/table-render-plain` for a semantic baseline without Tailwind
- `@ng-orbit/table-render-material` for Angular Material apps

## Docs links

- Local renderer docs: `http://127.0.0.1:4200/table/renders/daisy`
- Local overview: `http://127.0.0.1:4200/table/overview`
- Online renderer docs: `https://christianrm-dev.github.io/ng-orbit/table/renders/daisy`
- Online overview: `https://christianrm-dev.github.io/ng-orbit/table/overview`
