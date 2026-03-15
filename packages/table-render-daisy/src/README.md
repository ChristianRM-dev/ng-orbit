# @ng-orbit/table-render-daisy

DaisyUI renderer for `@ng-orbit/table`.

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

- DaisyUI/Tailwind-flavored table markup
- mapping UI events into `orbitTable` commands

## Consumer owns

- data fetching and backend query mapping
- loading and error state
- product-specific styling tokens, analytics, and business behavior

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

- `@ng-orbit/table`
- `@ng-orbit/table-render-plain`
- `@ng-orbit/table-render-material`

## Docs host

Run `pnpm demo` and open `http://127.0.0.1:4200/table?tab=renders&renderer=daisy`.
