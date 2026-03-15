# @ng-orbit/table-render-plain

Reference semantic renderer for `@ng-orbit/table`.

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

## Consumer owns

- `rows`, `total`, `loading`, and `error`
- backend query mapping and server calls
- styling, analytics, and row-level business behavior

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

- `@ng-orbit/table`
- `@ng-orbit/table-render-material`
- `@ng-orbit/table-render-daisy`

## Docs host

Run `pnpm demo` and open `http://127.0.0.1:4200/table?tab=renders&renderer=plain`.
