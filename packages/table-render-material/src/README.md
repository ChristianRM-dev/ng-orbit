# @ng-orbit/table-render-material

Angular Material renderer for `@ng-orbit/table`.

## What it is

`@ng-orbit/table-render-material` packages a Material-flavored first UI layer around the
headless table controller.

## Install

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-material
```

This package expects Angular Material to already exist in the consuming app.

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

## Consumer owns

- data fetching and backend query mapping
- loading and error state
- analytics, row actions, and feature-specific business behavior

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

- `@ng-orbit/table`
- `@ng-orbit/table-render-plain`
- `@ng-orbit/table-render-daisy`

## Docs host

Run `pnpm demo` and open `http://127.0.0.1:4200/table?tab=renders&renderer=material`.
