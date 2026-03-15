import type { TemplateRef } from '@angular/core';

/**
 * Stable row identity used by selection helpers and renderer integrations.
 */
export type OrbitTableRowId = string | number;

/**
 * Sort direction emitted by the controller.
 *
 * An empty string is accepted on input and normalized away by the helper utilities.
 */
export type OrbitTableSortDirection = 'asc' | 'desc' | '';

/**
 * Canonical sort intent for a table query.
 */
export interface OrbitTableSort {
  /**
   * Column id currently driving sort intent.
   */
  activeId: string | null;
  /**
   * Requested direction for the active column.
   */
  direction: OrbitTableSortDirection;
}

/**
 * Consumer-owned query intent passed into and emitted from {@link OrbitTableDirective}.
 *
 * @remarks
 * The controller does not execute this query in memory. Consumers still own backend mapping,
 * fetching, caching, and persistence.
 */
export interface OrbitTableQuery {
  /**
   * Current 1-based page number.
   */
  page: number;
  /**
   * Requested page size.
   */
  pageSize: number;
  /**
   * Active sort intent, or `null` when sorting is cleared.
   */
  sort: OrbitTableSort | null;
  /**
   * Free-text search intent.
   */
  search: string;
  /**
   * Arbitrary filter payload owned by the consuming feature layer.
   */
  filters: Record<string, unknown>;
}

/**
 * Selection snapshot emitted by the controller.
 *
 * @remarks
 * v1 supports multi-select only.
 */
export interface OrbitTableSelectionState {
  /**
   * Selection mode supported by the controller.
   */
  mode: 'multi';
  /**
   * Selected row ids keyed by {@link OrbitTableRowId}.
   */
  selected: ReadonlySet<OrbitTableRowId>;
}

/**
 * Context passed into custom table header templates.
 */
export interface OrbitTableHeaderContext<T> {
  /**
   * Column definition for the current header cell.
   */
  column: OrbitTableColumn<T>;
  /**
   * Latest normalized query state.
   */
  query: OrbitTableQuery;
  /**
   * Whether this column is currently the active sort target.
   */
  isSorted: boolean;
  /**
   * Active sort direction for the column, when sorted.
   */
  sortDir: OrbitTableSortDirection | null;
}

/**
 * Context passed into custom table cell templates.
 */
export interface OrbitTableCellContext<T> {
  /**
   * Current row object from the consumer-owned row slice.
   */
  row: T;
  /**
   * Column definition for the current cell.
   */
  column: OrbitTableColumn<T>;
  /**
   * Zero-based row index inside the rendered slice.
   */
  rowIndex: number;
  /**
   * Resolved cell value from `accessor` or `property`.
   */
  value: unknown;
}

/**
 * Column contract used by the headless controller and optional renderer packages.
 *
 * @remarks
 * If both `accessor` and `property` are provided, renderer packages prefer `accessor`.
 * If both `headerTemplate` and `header` are provided, renderer packages prefer
 * `headerTemplate`.
 */
export interface OrbitTableColumn<T> {
  /**
   * Stable column id used for sort intent and renderer bookkeeping.
   */
  id: string;
  /**
   * Plain label or inline header template.
   */
  header: string | TemplateRef<OrbitTableHeaderContext<T>>;
  /**
   * Optional value resolver for this column.
   */
  accessor?: (row: T) => unknown;
  /**
   * Optional property key shortcut used by basic renderer integrations.
   */
  property?: keyof T;
  /**
   * Whether the column can participate in sort intent.
   */
  sortable?: boolean;
  /**
   * Optional backend-facing sort key owned by the consumer.
   *
   * @remarks
   * The headless controller does not interpret this field. It is metadata for your own
   * query-mapping layer.
   */
  sortField?: string;
  /**
   * Explicit header template override.
   */
  headerTemplate?: TemplateRef<OrbitTableHeaderContext<T>>;
  /**
   * Optional cell template override.
   */
  cellTemplate?: TemplateRef<OrbitTableCellContext<T>>;
}
