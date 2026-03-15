import { Directive, computed, effect, input, output, signal } from '@angular/core';
import {
  areOrbitTableQueriesEqual,
  areOrbitTableSelectionsEqual,
  createDefaultOrbitTableQuery,
  createEmptyOrbitTableSelection,
  normalizeOrbitTableQuery,
  toggleOrbitTableSelectionById
} from './table.query-selection.utils';
import type {
  OrbitTableColumn,
  OrbitTableQuery,
  OrbitTableRowId,
  OrbitTableSelectionState,
  OrbitTableSort
} from './table.types';

/**
 * Headless table controller for Angular templates and custom renderer packages.
 *
 * @remarks
 * `OrbitTableDirective` owns query intent and selection state only. Consumers still own
 * data fetching, backend query mapping, loading and error state, and any visual markup.
 *
 * Bind the directive in a template with `#table="orbitTable"` and let your UI call the
 * command methods exposed by the controller.
 */
@Directive({
  selector: '[orbitTable]',
  exportAs: 'orbitTable',
  standalone: true
})
export class OrbitTableDirective<T> {
  /**
   * Consumer-owned row slice to render.
   */
  readonly rowsInput = input.required<readonly T[]>({ alias: 'rows' });
  /**
   * Column definitions used by renderers and custom templates.
   */
  readonly columnsInput = input.required<readonly OrbitTableColumn<T>[]>({
    alias: 'columns'
  });
  /**
   * Total number of available rows in the backing data source.
   */
  readonly totalInput = input.required<number>({ alias: 'total' });
  /**
   * Loading state controlled by the parent feature.
   */
  readonly loadingInput = input.required<boolean>({ alias: 'loading' });
  /**
   * Error state controlled by the parent feature.
   */
  readonly errorInput = input.required<unknown | null>({ alias: 'error' });
  /**
   * Latest consumer-owned query intent.
   */
  readonly queryInput = input.required<OrbitTableQuery>({ alias: 'query' });
  /**
   * Required row identity resolver used for selection.
   */
  readonly getRowIdInput = input.required<(row: T) => OrbitTableRowId>({
    alias: 'getRowId'
  });

  /**
   * Emits after a command changes the normalized query.
   */
  readonly orbitTableQueryChange = output<OrbitTableQuery>();
  /**
   * Emits after selection changes.
   */
  readonly orbitTableSelectionChange = output<OrbitTableSelectionState>();

  private readonly queryState = signal<OrbitTableQuery>(createDefaultOrbitTableQuery());
  private readonly selectionState = signal<OrbitTableSelectionState>(
    createEmptyOrbitTableSelection()
  );

  readonly rows = computed(() => this.rowsInput());
  readonly columns = computed(() => this.columnsInput());
  readonly total = computed(() => normalizeTotal(this.totalInput()));
  readonly loading = computed(() => this.loadingInput());
  readonly error = computed(() => this.errorInput());
  /**
   * Latest normalized query state.
   */
  readonly query = computed(() => this.queryState());
  /**
   * Latest normalized selection snapshot.
   */
  readonly selection = computed(() => this.selectionState());

  /**
   * Whether the current page can move backward.
   */
  readonly canPrevPage = computed(() => this.queryState().page > 1);
  /**
   * Whether the current page can move forward based on `total` and `pageSize`.
   */
  readonly canNextPage = computed(() => {
    const query = this.queryState();
    return query.page * query.pageSize < this.total();
  });

  constructor() {
    effect(() => {
      // Keep controller state canonical even when the parent passes partial or noisy values.
      const normalizedFromParent = normalizeOrbitTableQuery(this.queryInput());
      if (!areOrbitTableQueriesEqual(this.queryState(), normalizedFromParent)) {
        this.queryState.set(normalizedFromParent);
      }
    });
  }

  /**
   * Toggles sort intent for a sortable column.
   *
   * @remarks
   * The cycle is `null -> asc -> desc -> null`. Non-sortable or unknown columns are ignored.
   * Successful updates reset the current page to `1`.
   */
  toggleSort(columnId: string): void {
    const column = this.columnsInput().find((entry) => entry.id === columnId);
    if (!column?.sortable) {
      return;
    }

    const currentSort = this.queryState().sort;
    let nextSort: OrbitTableSort | null = null;

    if (!currentSort || currentSort.activeId !== columnId) {
      nextSort = { activeId: columnId, direction: 'asc' };
    } else if (currentSort.direction === 'asc') {
      nextSort = { activeId: columnId, direction: 'desc' };
    }

    this.commitQuery({
      ...this.queryState(),
      page: 1,
      sort: nextSort
    });
  }

  /**
   * Updates search intent and resets the current page to `1`.
   */
  setSearch(value: string): void {
    this.commitQuery({
      ...this.queryState(),
      page: 1,
      search: value
    });
  }

  /**
   * Requests a specific page.
   *
   * @remarks
   * Invalid values are normalized before emission.
   */
  setPage(page: number): void {
    this.commitQuery({
      ...this.queryState(),
      page
    });
  }

  /**
   * Updates page size and resets the current page to `1`.
   */
  setPageSize(pageSize: number): void {
    this.commitQuery({
      ...this.queryState(),
      page: 1,
      pageSize
    });
  }

  /**
   * Replaces the current filter payload and resets the current page to `1`.
   *
   * @remarks
   * The controller treats filters as opaque consumer-owned data.
   */
  setFilters(filters: Record<string, unknown>): void {
    this.commitQuery({
      ...this.queryState(),
      page: 1,
      filters
    });
  }

  /**
   * Toggles the selection state for a row resolved through `getRowId`.
   */
  toggleRow(row: T): void {
    const nextSelection = toggleOrbitTableSelectionById(
      this.selectionState(),
      this.resolveRowId(row)
    );
    this.commitSelection(nextSelection);
  }

  /**
   * Clears all selected rows.
   */
  clearSelection(): void {
    this.commitSelection(createEmptyOrbitTableSelection());
  }

  /**
   * Returns whether a row is currently selected.
   */
  isRowSelected(row: T): boolean {
    return this.selectionState().selected.has(this.resolveRowId(row));
  }

  /**
   * Resolves a stable row id using the consumer-provided identity function.
   */
  resolveRowId(row: T): OrbitTableRowId {
    return this.getRowIdInput()(row);
  }

  private commitQuery(nextQuery: OrbitTableQuery): void {
    const normalizedQuery = normalizeOrbitTableQuery(nextQuery);
    if (areOrbitTableQueriesEqual(this.queryState(), normalizedQuery)) {
      return;
    }

    this.queryState.set(normalizedQuery);
    this.orbitTableQueryChange.emit(normalizedQuery);
  }

  private commitSelection(nextSelection: OrbitTableSelectionState): void {
    if (areOrbitTableSelectionsEqual(this.selectionState(), nextSelection)) {
      return;
    }

    this.selectionState.set(nextSelection);
    this.orbitTableSelectionChange.emit(nextSelection);
  }
}

function normalizeTotal(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}
