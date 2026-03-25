# @ng-orbit/table-render-material

Angular Material renderer for `@ng-orbit/table`.

## AI Quick Map

- Role: ready Angular Material renderer that maps `orbitTable` state into a Material table shell
- Install: `pnpm add @ng-orbit/table @ng-orbit/table-render-material @angular/material @angular/cdk @angular/animations`
- Pair with: `@ng-orbit/table`
- Package owns: Material table markup, default controls, and UI-to-command wiring
- Consumer owns: data fetching, backend query mapping, loading and error state, analytics, and row-level business behavior
- Recommended path: use this when your app already uses Angular Material and you want the fastest first table UI

## What it is

`@ng-orbit/table-render-material` packages a Material-flavored first UI layer around the
headless table controller.

## Install

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-material @angular/material @angular/cdk @angular/animations
```

## Use this when

- your product already uses Angular Material
- you want a faster adoption path than building the first table adapter yourself
- you still want server interaction and business logic to live outside the renderer

## Do not use this when

- you want the package to fetch or cache data
- you need renderer-owned business sorting or filtering rules
- your product does not use Angular Material

## Library owns

- Material-based table markup
- mapping UI events into `orbitTable` commands
- a ready-to-install first table shell for Material teams

## Consumer owns

- data fetching and backend query mapping
- loading and error state
- analytics, row actions, and feature-specific business behavior

## Primary exports

- `OrbitTableRenderMaterialComponent` for the ready Angular Material table renderer

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
  <orbit-table-render-material [table]="table" />
</section>
```

## Related packages

- `@ng-orbit/table` for the headless controller
- `@ng-orbit/table-render-plain` for a semantic baseline without Material
- `@ng-orbit/table-render-daisy` for DaisyUI and Tailwind apps

## Docs links

- Local renderer docs: `http://127.0.0.1:4200/table/renders/material`
- Local overview: `http://127.0.0.1:4200/table/overview`
- Online renderer docs: `https://christianrm-dev.github.io/ng-orbit/table/renders/material`
- Online overview: `https://christianrm-dev.github.io/ng-orbit/table/overview`
