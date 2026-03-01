import type {
  OrbitTableQuery,
  OrbitTableRowId,
  OrbitTableSelectionState,
  OrbitTableSort
} from './table.types';

const EMPTY_FILTERS = Object.freeze({}) as Record<string, unknown>;

export function createDefaultOrbitTableQuery(): OrbitTableQuery {
  return {
    page: 1,
    pageSize: 10,
    sort: null,
    search: '',
    filters: EMPTY_FILTERS
  };
}

export function createEmptyOrbitTableSelection(): OrbitTableSelectionState {
  return {
    mode: 'multi',
    selected: new Set<OrbitTableRowId>()
  };
}

export function normalizeOrbitTableSort(
  sort: OrbitTableSort | null | undefined
): OrbitTableSort | null {
  if (!sort || !sort.activeId) {
    return null;
  }

  if (sort.direction !== 'asc' && sort.direction !== 'desc') {
    return null;
  }

  return {
    activeId: sort.activeId,
    direction: sort.direction
  };
}

export function normalizeOrbitTableQuery(
  query: Partial<OrbitTableQuery> | OrbitTableQuery | null | undefined
): OrbitTableQuery {
  const defaults = createDefaultOrbitTableQuery();
  const candidate = query ?? defaults;

  return {
    page: normalizePositiveInt(candidate.page, defaults.page),
    pageSize: normalizePositiveInt(candidate.pageSize, defaults.pageSize),
    sort: normalizeOrbitTableSort(candidate.sort),
    search: typeof candidate.search === 'string' ? candidate.search : defaults.search,
    filters: isRecord(candidate.filters) ? candidate.filters : defaults.filters
  };
}

export function areOrbitTableSortsEqual(
  left: OrbitTableSort | null,
  right: OrbitTableSort | null
): boolean {
  if (left === right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return left.activeId === right.activeId && left.direction === right.direction;
}

export function areOrbitTableQueriesEqual(
  left: OrbitTableQuery,
  right: OrbitTableQuery
): boolean {
  return (
    left.page === right.page &&
    left.pageSize === right.pageSize &&
    left.search === right.search &&
    left.filters === right.filters &&
    areOrbitTableSortsEqual(left.sort, right.sort)
  );
}

export function areOrbitTableSelectionsEqual(
  left: OrbitTableSelectionState,
  right: OrbitTableSelectionState
): boolean {
  if (left === right) {
    return true;
  }

  if (left.selected.size !== right.selected.size) {
    return false;
  }

  for (const id of left.selected) {
    if (!right.selected.has(id)) {
      return false;
    }
  }

  return true;
}

export function toggleOrbitTableSelectionById(
  selection: OrbitTableSelectionState,
  rowId: OrbitTableRowId
): OrbitTableSelectionState {
  const selected = new Set(selection.selected);

  if (selected.has(rowId)) {
    selected.delete(rowId);
  } else {
    selected.add(rowId);
  }

  return {
    mode: 'multi',
    selected
  };
}

function normalizePositiveInt(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  const normalizedValue = Math.trunc(value as number);
  return normalizedValue >= 1 ? normalizedValue : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
