import {
  areOrbitTableQueriesEqual,
  createDefaultOrbitTableQuery,
  createEmptyOrbitTableSelection,
  normalizeOrbitTableQuery,
  normalizeOrbitTableSort,
  toggleOrbitTableSelectionById
} from './table.query-selection.utils';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

// sort normalization
assert(normalizeOrbitTableSort(null) === null, 'null sort should remain null');
assert(
  normalizeOrbitTableSort({
    activeId: null,
    direction: 'asc'
  }) === null,
  'sort without activeId should normalize to null'
);
assert(
  normalizeOrbitTableSort({
    activeId: 'name',
    direction: ''
  }) === null,
  'sort with empty direction should normalize to null'
);

// query normalization
const normalizedQuery = normalizeOrbitTableQuery({
  page: 0,
  pageSize: -10,
  search: 'john',
  filters: { role: 'admin' }
});
assert(normalizedQuery.page === 1, 'page should clamp to 1');
assert(normalizedQuery.pageSize === 10, 'pageSize should clamp to 10 default');
assert(normalizedQuery.search === 'john', 'search should be preserved');

// query equality
const left = normalizeOrbitTableQuery(createDefaultOrbitTableQuery());
const right = normalizeOrbitTableQuery(createDefaultOrbitTableQuery());
assert(areOrbitTableQueriesEqual(left, right), 'default queries should be equal');

// selection toggling
let selection = createEmptyOrbitTableSelection();
selection = toggleOrbitTableSelectionById(selection, 7);
assert(selection.selected.has(7), 'row id should be selected after first toggle');
selection = toggleOrbitTableSelectionById(selection, 7);
assert(!selection.selected.has(7), 'row id should be deselected after second toggle');
