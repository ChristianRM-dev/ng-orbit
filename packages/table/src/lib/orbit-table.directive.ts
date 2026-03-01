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

@Directive({
  selector: '[orbitTable]',
  exportAs: 'orbitTable',
  standalone: true
})
export class OrbitTableDirective<T> {
  readonly rowsInput = input.required<readonly T[]>({ alias: 'rows' });
  readonly columnsInput = input.required<readonly OrbitTableColumn<T>[]>({
    alias: 'columns'
  });
  readonly totalInput = input.required<number>({ alias: 'total' });
  readonly loadingInput = input.required<boolean>({ alias: 'loading' });
  readonly errorInput = input.required<unknown | null>({ alias: 'error' });
  readonly queryInput = input.required<OrbitTableQuery>({ alias: 'query' });
  readonly getRowIdInput = input.required<(row: T) => OrbitTableRowId>({
    alias: 'getRowId'
  });

  readonly orbitTableQueryChange = output<OrbitTableQuery>();
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
  readonly query = computed(() => this.queryState());
  readonly selection = computed(() => this.selectionState());

  readonly canPrevPage = computed(() => this.queryState().page > 1);
  readonly canNextPage = computed(() => {
    const query = this.queryState();
    return query.page * query.pageSize < this.total();
  });

  constructor() {
    effect(() => {
      const normalizedFromParent = normalizeOrbitTableQuery(this.queryInput());
      if (!areOrbitTableQueriesEqual(this.queryState(), normalizedFromParent)) {
        this.queryState.set(normalizedFromParent);
      }
    });
  }

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

  setSearch(value: string): void {
    this.commitQuery({
      ...this.queryState(),
      page: 1,
      search: value
    });
  }

  setPage(page: number): void {
    this.commitQuery({
      ...this.queryState(),
      page
    });
  }

  setPageSize(pageSize: number): void {
    this.commitQuery({
      ...this.queryState(),
      page: 1,
      pageSize
    });
  }

  setFilters(filters: Record<string, unknown>): void {
    this.commitQuery({
      ...this.queryState(),
      page: 1,
      filters
    });
  }

  toggleRow(row: T): void {
    const nextSelection = toggleOrbitTableSelectionById(
      this.selectionState(),
      this.resolveRowId(row)
    );
    this.commitSelection(nextSelection);
  }

  clearSelection(): void {
    this.commitSelection(createEmptyOrbitTableSelection());
  }

  isRowSelected(row: T): boolean {
    return this.selectionState().selected.has(this.resolveRowId(row));
  }

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
