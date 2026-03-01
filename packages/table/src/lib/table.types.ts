import type { TemplateRef } from '@angular/core';

export type OrbitTableRowId = string | number;

export type OrbitTableSortDirection = 'asc' | 'desc' | '';

export interface OrbitTableSort {
  activeId: string | null;
  direction: OrbitTableSortDirection;
}

export interface OrbitTableQuery {
  page: number;
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
