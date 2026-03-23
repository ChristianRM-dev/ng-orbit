# @ng-orbit/table-render-plain

Reference semantic renderer for `@ng-orbit/table`.

## AI Quick Map

- Role: ready semantic renderer that turns `orbitTable` state into HTML without a design-system dependency
- Install: `pnpm add @ng-orbit/table @ng-orbit/table-render-plain`
- Pair with: `@ng-orbit/table`
- Package owns: semantic table markup, default controls, and UI-to-command wiring
- Consumer owns: data fetching, backend query mapping, loading and error state, analytics, and product styling
- Recommended path: start here when you want the fastest first table integration or a reference renderer to fork

## What it is

`@ng-orbit/table-render-plain` is the thinnest ready-to-install UI layer for the headless
table controller. It uses semantic HTML and ships no design-system styling.

## Install

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-plain
```

## Use this when

- you want the fastest possible first integration
- you prefer semantic HTML over a UI framework dependency
- you expect to fork or replace the markup later

## Do not use this when

- you want Angular Material or DaisyUI-specific visuals out of the box
- you expect the renderer to fetch data or own query mapping
- you need product-specific layout rules baked into the package

## Library owns

- semantic reference markup
- mapping UI events into `orbitTable` commands
- a small, readable baseline for custom renderer work

## Consumer owns

- `rows`, `total`, `loading`, and `error`
- backend query mapping and server calls
- styling, analytics, and row-level business behavior

## Primary exports

- `OrbitTableRenderPlainComponent` for the ready semantic renderer component

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
  <orbit-table-render-plain [table]="table" />
</section>
```

## Related packages

- `@ng-orbit/table` for the headless controller
- `@ng-orbit/table-render-material` for Angular Material apps
- `@ng-orbit/table-render-daisy` for DaisyUI and Tailwind apps

## Docs links

- Local renderer docs: `http://127.0.0.1:4200/table/renders/plain`
- Local overview: `http://127.0.0.1:4200/table/overview`
- Online renderer docs: `https://christianrm-dev.github.io/ng-orbit/table/renders/plain`
- Online overview: `https://christianrm-dev.github.io/ng-orbit/table/overview`
