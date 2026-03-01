# Table (headless) specification

Package: `@ng-orbit/table`

## Goal
Provide a headless table controller that manages UI intent only:
- query intent (`page`, `pageSize`, `sort`, `search`, `filters`)
- selection state
- command API for renderers/consumers

The core does not:
- fetch data
- apply sort/filter/search/pagination to rows in memory
- render `<table>` markup
- ship CSS

---

## Public API

```ts
import type { TemplateRef } from '@angular/core';

export type OrbitTableRowId = string | number;

export type OrbitTableSortDirection = 'asc' | 'desc' | '';

export interface OrbitTableSort {
  activeId: string | null;
  direction: OrbitTableSortDirection;
}

export interface OrbitTableQuery {
  page: number; // 1-based
  pageSize: number;
  sort: OrbitTableSort | null;
  search: string;
  filters: Record<string, unknown>;
}

export interface OrbitTableSelectionState {
  mode: 'multi';
  selected: ReadonlySet<OrbitTableRowId>;
}

export interface OrbitTableHeaderContext<T> {
  column: OrbitTableColumn<T>;
  query: OrbitTableQuery;
  isSorted: boolean;
  sortDir: OrbitTableSortDirection | null;
}

export interface OrbitTableCellContext<T> {
  row: T;
  column: OrbitTableColumn<T>;
  rowIndex: number;
  value: unknown;
}

export interface OrbitTableColumn<T> {
  id: string;
  header: string | TemplateRef<OrbitTableHeaderContext<T>>;
  accessor?: (row: T) => unknown;
  property?: keyof T;
  sortable?: boolean;
  sortField?: string;
  headerTemplate?: TemplateRef<OrbitTableHeaderContext<T>>;
  cellTemplate?: TemplateRef<OrbitTableCellContext<T>>;
}
```

---

## Controller directive

`OrbitTableDirective<T>` is standalone and exported as `orbitTable`.

Selector:
- `[orbitTable]`

Export:
- `exportAs: 'orbitTable'`

Inputs (owned by parent):
- `rows: readonly T[]`
- `columns: readonly OrbitTableColumn<T>[]`
- `total: number`
- `loading: boolean`
- `error: unknown | null`
- `query: OrbitTableQuery`
- `getRowId: (row: T) => OrbitTableRowId` (required)

Outputs:
- `orbitTableQueryChange: OrbitTableQuery`
- `orbitTableSelectionChange: OrbitTableSelectionState`

Exposed signals:
- `rows()`
- `columns()`
- `total()`
- `loading()`
- `error()`
- `query()`
- `selection()`
- `canPrevPage()`
- `canNextPage()`

Commands:
- `toggleSort(columnId: string)`
- `setSearch(value: string)`
- `setPage(page: number)`
- `setPageSize(size: number)`
- `setFilters(filters: Record<string, unknown>)`
- `toggleRow(row: T)`
- `clearSelection()`
- `isRowSelected(row: T)`

---

## Behavior rules

1. Core is query-intent controller, not data processor.
2. `rows()` mirrors parent input (no processed rows).
3. Query normalization:
   - `page >= 1`
   - `pageSize >= 1`
4. Commands reset page to 1:
   - `toggleSort`
   - `setSearch`
   - `setFilters`
   - `setPageSize`
5. Canonical no-sort state is `query.sort = null`.
6. Sort toggle cycle:
   - `null -> asc -> desc -> null`
7. Selection mode in v1:
   - fixed `mode: 'multi'`
   - identity by `getRowId`

Default query:
```ts
{ page: 1, pageSize: 10, sort: null, search: '', filters: {} }
```
