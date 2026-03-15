import type {
  OrbitTableQuery,
  OrbitTableRowId,
  OrbitTableSelectionState,
  OrbitTableSort
} from './table.types';

const EMPTY_FILTERS = Object.freeze({}) as Record<string, unknown>;

/**
 * Creates the canonical default query used by {@link OrbitTableDirective}.
 *
 * @remarks
 * This is an advanced helper for consumers who want to initialize or reset query state
 * outside the directive.
 */
export function createDefaultOrbitTableQuery(): OrbitTableQuery {
  return {
    page: 1,
    pageSize: 10,
    sort: null,
    search: '',
    filters: EMPTY_FILTERS
  };
}

/**
 * Creates an empty multi-select state.
 *
 * @remarks
 * This is a low-level helper used by the controller and custom integrations.
 */
export function createEmptyOrbitTableSelection(): OrbitTableSelectionState {
  return {
    mode: 'multi',
    selected: new Set<OrbitTableRowId>()
  };
}

/**
 * Normalizes raw sort input into the controller's canonical sort shape.
 *
 * @remarks
 * Invalid ids and unsupported directions collapse to `null`.
 */
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

/**
 * Normalizes partial query input into a complete {@link OrbitTableQuery}.
 *
 * @remarks
 * Missing or invalid values fall back to {@link createDefaultOrbitTableQuery}. This helper
 * is exported for advanced integrations that keep query state outside the directive.
 */
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

/**
 * Compares two normalized sort payloads.
 */
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

/**
 * Compares two queries for semantic equality.
 *
 * @remarks
 * `filters` are compared by reference, not by deep equality. Consumers who replace filter
 * objects should create stable references when they want to avoid extra emissions.
 */
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

/**
 * Compares two selection snapshots.
 */
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

/**
 * Toggles a row id inside a multi-select state and returns a fresh snapshot.
 */
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
