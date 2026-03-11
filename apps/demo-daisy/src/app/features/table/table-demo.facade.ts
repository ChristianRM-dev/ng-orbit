import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  createDefaultOrbitTableQuery,
  createEmptyOrbitTableSelection,
  type OrbitTableColumn,
  type OrbitTableQuery,
  type OrbitTableRowId,
  type OrbitTableSelectionState
} from '@ng-orbit/table';
import { TranslateService } from '@ngx-translate/core';
import { TableDemoDataService } from '../../core/data/table-demo-data.service';
import type { DemoPersonRow } from '../../core/data/table-demo.types';
import { DemoI18nService } from '../../core/i18n/demo-i18n.service';

@Injectable()
export class TableDemoFacade {
  private readonly dataService = inject(TableDemoDataService);
  private readonly i18nService = inject(DemoI18nService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private requestCounter = 0;

  readonly query = signal<OrbitTableQuery>(createDefaultOrbitTableQuery());
  readonly rows = signal<readonly DemoPersonRow[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<unknown | null>(null);
  readonly selection = signal<OrbitTableSelectionState>(createEmptyOrbitTableSelection());

  readonly columns = computed<readonly OrbitTableColumn<DemoPersonRow>[]>(() => {
    this.i18nService.language();

    return [
      {
        id: 'id',
        header: this.translateService.instant('table.columns.id'),
        accessor: (row) => row.id,
        sortable: true
      },
      {
        id: 'fullName',
        header: this.translateService.instant('table.columns.fullName'),
        accessor: (row) => row.fullName,
        sortable: true
      },
      {
        id: 'email',
        header: this.translateService.instant('table.columns.email'),
        accessor: (row) => row.email,
        sortable: true
      },
      {
        id: 'role',
        header: this.translateService.instant('table.columns.role'),
        accessor: (row) => row.role,
        sortable: true
      },
      {
        id: 'country',
        header: this.translateService.instant('table.columns.country'),
        accessor: (row) => row.country,
        sortable: true
      }
    ];
  });

  readonly selectedCount = computed(() => this.selection().selected.size);
  readonly totalPages = computed(() => {
    const currentQuery = this.query();
    return Math.max(1, Math.ceil(this.total() / currentQuery.pageSize));
  });

  readonly getRowId = (row: DemoPersonRow): OrbitTableRowId => row.id;

  constructor() {
    this.load(this.query());
  }

  onQueryChange(query: OrbitTableQuery): void {
    this.query.set(query);
    this.load(query);
  }

  onSelectionChange(selection: OrbitTableSelectionState): void {
    this.selection.set(selection);
  }

  applyScenarioSearch(value: string): void {
    this.onQueryChange({
      ...this.query(),
      page: 1,
      search: value
    });
  }

  getSortIndicator(columnId: string): string {
    const sort = this.query().sort;

    if (!sort || sort.activeId !== columnId) {
      return '↕';
    }

    return sort.direction === 'asc' ? '↑' : '↓';
  }

  resolveCellValue(row: DemoPersonRow, column: OrbitTableColumn<DemoPersonRow>): unknown {
    if (column.accessor) {
      return column.accessor(row);
    }

    if (column.property !== undefined) {
      return row[column.property];
    }

    return '';
  }

  private load(query: OrbitTableQuery): void {
    const requestId = ++this.requestCounter;

    this.loading.set(true);
    this.error.set(null);

    this.dataService
      .fetch(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ rows, total }) => {
          if (requestId !== this.requestCounter) {
            return;
          }

          this.rows.set(rows);
          this.total.set(total);
          this.loading.set(false);
        },
        error: () => {
          if (requestId !== this.requestCounter) {
            return;
          }

          this.rows.set([]);
          this.total.set(0);
          this.loading.set(false);
          this.error.set(this.translateService.instant('table.messages.simulatedError'));
        }
      });
  }
}
