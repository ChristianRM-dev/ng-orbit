# @ng-orbit/table

Headless table controller for ng-orbit.

## Install

```bash
pnpm add @ng-orbit/table
```

Add `@ng-orbit/table-render-plain` if you want a ready-made semantic renderer:

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-plain
```

## What the package owns

- Query intent: `page`, `pageSize`, `sort`, `search`, `filters`
- Selection state
- Signals and commands exposed via `exportAs="orbitTable"`

## What the consumer still owns

- Data fetching
- Mapping `OrbitTableQuery` to backend params
- Empty, loading, and error states
- Visual layout if you do not use a renderer package

## Quickstart

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

## Local consumer docs

Run:

```bash
pnpm demo
```

Then open `http://127.0.0.1:4200/table`.
