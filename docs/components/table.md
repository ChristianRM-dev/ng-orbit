# Table (headless) specification

Package: `@ng-orbit/table`

## Goal
Provide a headless table controller:
- columns, rows, sorting, pagination, selection
- templates per cell/row header
- no rendering assumptions, no CSS

Consumers decide UI and styling.

---

## Public API (contract)

### Column model
```ts
export interface OrbitTableColumnDef<T = unknown> {
  id: string;
  header: string;
  accessor?: (row: T) => unknown;
  sortable?: boolean;            // default: false
  width?: string;                // hint only; renderer may ignore
  align?: 'start' | 'center' | 'end';
}
```

### Sort model
```ts
export type OrbitSortDirection = 'asc' | 'desc' | '';
export interface OrbitSortState {
  activeId: string | null;
  direction: OrbitSortDirection;
}
```

### Controller
Exposed via `exportAs="orbitTable"`.

Inputs:
- `data: readonly T[]`
- `columns: readonly OrbitTableColumnDef<T>[]`
- `trackBy?: (index: number, row: T) => unknown`
- `initialSort?: OrbitSortState`

Signals:
- `rows(): readonly T[]` (processed)
- `columns(): readonly OrbitTableColumnDef<T>[]`
- `sort(): OrbitSortState`
- `selection(): ReadonlySet<unknown>`

Commands:
- `setSort(columnId: string, direction?: OrbitSortDirection): void`
- `toggleSort(columnId: string): void`
- `toggleRow(row: T): void`
- `clearSelection(): void`

Templates (optional - implementation choice):
- `cellTemplateMap?: Record<string, TemplateRef<...>>`
- `headerTemplateMap?: Record<string, TemplateRef<...>>`

---

## Optional kits and renderers
Same approach as wizard: kit primitives + optional renderers.
