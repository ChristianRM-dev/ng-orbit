# @ng-orbit/table

Headless table controller for Angular applications that want consumer-owned data fetching,
query mapping, selection, and markup.

## What it is

`@ng-orbit/table` exposes a standalone directive, query types, selection state, and a small
command surface. It does not ship table HTML, styling, or in-memory data processing rules.

## Install

Core only:

```bash
pnpm add @ng-orbit/table
```

Fastest ready-to-install path:

```bash
pnpm add @ng-orbit/table @ng-orbit/table-render-plain
```

## Use this when

- your feature layer owns server calls and query persistence
- you want table state without locking into a design system
- you need a stable contract that can power custom UI or a renderer package

## Do not use this when

- you want a package that fetches data for you
- you expect built-in business filtering, sorting, or pagination logic
- you want a final visual design without building markup or installing a renderer

## Library owns

- query intent: `page`, `pageSize`, `sort`, `search`, `filters`
- selection state
- normalized outputs and command semantics
- template-friendly signals exposed through `exportAs="orbitTable"`

## Consumer owns

- backend query mapping
- data fetching and caching
- `rows`, `total`, `loading`, and `error`
- final markup, styling, analytics, and row actions

## Smallest working example

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitTableDirective,
  createDefaultOrbitTableQuery,
  type OrbitTableColumn,
  type OrbitTableQuery
} from '@ng-orbit/table';
import { OrbitTableRenderPlainComponent } from '@ng-orbit/table-render-plain';

interface UserRow {
  id: number;
  fullName: string;
  email: string;
}

@Component({
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderPlainComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  `
})
export class UsersTableComponent {
  readonly query = signal(createDefaultOrbitTableQuery());
  readonly rows = signal<readonly UserRow[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<unknown | null>(null);

  readonly columns: readonly OrbitTableColumn<UserRow>[] = [
    { id: 'fullName', header: 'Name', accessor: (row) => row.fullName, sortable: true },
    { id: 'email', header: 'Email', accessor: (row) => row.email, sortable: true }
  ];

  readonly getRowId = (row: UserRow) => row.id;

  onQueryChange(query: OrbitTableQuery): void {
    this.query.set(query);
    // Fetch from your own backend contract, then update rows/total/loading/error.
  }
}
```

## Related packages

- `@ng-orbit/table-render-plain` for semantic HTML
- `@ng-orbit/table-render-material` for Angular Material apps
- `@ng-orbit/table-render-daisy` for DaisyUI/Tailwind apps

## Docs host

Run `pnpm demo` and open:
- `http://127.0.0.1:4200/table`
- `http://127.0.0.1:4200/adapters`
