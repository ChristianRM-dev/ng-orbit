import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import type { TemplateRef } from '@angular/core';
import { OrbitTableDirective } from '@ng-orbit/table';
import type {
  OrbitTableCellContext,
  OrbitTableColumn,
  OrbitTableHeaderContext
} from '@ng-orbit/table';

@Component({
  selector: 'orbit-table-render-plain',
  standalone: true,
  imports: [NgIf, NgFor, NgTemplateOutlet],
  template: `
    <section>
      <label>
        Search
        <input
          type="search"
          [value]="table().query().search"
          (input)="onSearchInput($event)"
        />
      </label>
    </section>

    <table>
      <thead>
        <tr>
          <th scope="col">Select</th>
          <th
            *ngFor="let column of table().columns(); trackBy: trackByColumnId"
            scope="col"
          >
            <ng-container *ngIf="column.sortable; else staticHeader">
              <button type="button" (click)="table().toggleSort(column.id)">
                <ng-container
                  [ngTemplateOutlet]="resolveHeaderTemplate(column) ?? null"
                  [ngTemplateOutletContext]="getHeaderContext(column)"
                >
                </ng-container>
                <ng-container *ngIf="!resolveHeaderTemplate(column)">
                  {{ resolveHeaderLabel(column) }}
                </ng-container>
                <small>{{ getSortIndicator(column) }}</small>
              </button>
            </ng-container>

            <ng-template #staticHeader>
              <ng-container
                [ngTemplateOutlet]="resolveHeaderTemplate(column) ?? null"
                [ngTemplateOutletContext]="getHeaderContext(column)"
              >
              </ng-container>
              <ng-container *ngIf="!resolveHeaderTemplate(column)">
                {{ resolveHeaderLabel(column) }}
              </ng-container>
            </ng-template>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr *ngIf="table().loading()">
          <td [attr.colspan]="table().columns().length + 1">Loading...</td>
        </tr>

        <tr *ngIf="!table().loading() && table().error() as currentError">
          <td [attr.colspan]="table().columns().length + 1">
            Error: {{ currentError }}
          </td>
        </tr>

        <tr
          *ngIf="
            !table().loading() && !table().error() && table().rows().length === 0
          "
        >
          <td [attr.colspan]="table().columns().length + 1">No rows</td>
        </tr>

        <ng-container
          *ngIf="!table().loading() && !table().error() && table().rows().length > 0"
        >
          <tr
            *ngFor="
              let row of table().rows();
              let rowIndex = index;
              trackBy: trackByRow
            "
          >
            <td>
              <input
                type="checkbox"
                [checked]="table().isRowSelected(row)"
                (change)="table().toggleRow(row)"
              />
            </td>

            <td *ngFor="let column of table().columns(); trackBy: trackByColumnId">
              <ng-container
                *ngIf="column.cellTemplate; else defaultCell"
                [ngTemplateOutlet]="column.cellTemplate"
                [ngTemplateOutletContext]="getCellContext(row, column, rowIndex)"
              >
              </ng-container>
              <ng-template #defaultCell>{{ resolveCellValue(row, column) }}</ng-template>
            </td>
          </tr>
        </ng-container>
      </tbody>
    </table>

    <nav aria-label="Pagination controls">
      <button
        type="button"
        [disabled]="!table().canPrevPage()"
        (click)="table().setPage(table().query().page - 1)"
      >
        Prev
      </button>
      <span>Page {{ table().query().page }} / {{ getTotalPages() }}</span>
      <button
        type="button"
        [disabled]="!table().canNextPage()"
        (click)="table().setPage(table().query().page + 1)"
      >
        Next
      </button>

      <label>
        Page size
        <select [value]="table().query().pageSize" (change)="onPageSizeChange($event)">
          <option *ngFor="let size of pageSizeOptions" [value]="size">
            {{ size }}
          </option>
        </select>
      </label>
    </nav>
  `
})
export class OrbitTableRenderPlainComponent<T> {
  readonly table = input.required<OrbitTableDirective<T>>();
  readonly pageSizeOptions: readonly number[] = [10, 25, 50];

  trackByColumnId(_: number, column: OrbitTableColumn<T>): string {
    return column.id;
  }

  trackByRow = (_: number, row: T): string | number => this.table().resolveRowId(row);

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.table().setSearch(inputElement?.value ?? '');
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    const parsedSize = Number(selectElement?.value);
    this.table().setPageSize(parsedSize);
  }

  resolveHeaderTemplate(
    column: OrbitTableColumn<T>
  ): TemplateRef<OrbitTableHeaderContext<T>> | null {
    if (column.headerTemplate) {
      return column.headerTemplate;
    }

    return isTemplateRef<OrbitTableHeaderContext<T>>(column.header)
      ? column.header
      : null;
  }

  resolveHeaderLabel(column: OrbitTableColumn<T>): string {
    return isTemplateRef<OrbitTableHeaderContext<T>>(column.header) ? '' : column.header;
  }

  getHeaderContext(column: OrbitTableColumn<T>): OrbitTableHeaderContext<T> {
    const query = this.table().query();
    const isSorted = query.sort?.activeId === column.id;

    return {
      column,
      query,
      isSorted,
      sortDir: isSorted ? query.sort?.direction ?? null : null
    };
  }

  getCellContext(
    row: T,
    column: OrbitTableColumn<T>,
    rowIndex: number
  ): OrbitTableCellContext<T> {
    return {
      row,
      column,
      rowIndex,
      value: this.resolveCellValue(row, column)
    };
  }

  getSortIndicator(column: OrbitTableColumn<T>): string {
    if (!column.sortable) {
      return '';
    }

    const sort = this.table().query().sort;
    if (!sort || sort.activeId !== column.id) {
      return '(sort)';
    }

    return sort.direction === 'asc' ? '(asc)' : '(desc)';
  }

  getTotalPages(): number {
    const query = this.table().query();
    return Math.max(1, Math.ceil(this.table().total() / query.pageSize));
  }

  resolveCellValue(row: T, column: OrbitTableColumn<T>): unknown {
    if (column.accessor) {
      return column.accessor(row);
    }

    if (column.property !== undefined) {
      const key = column.property as keyof T;
      return row[key] as unknown;
    }

    return undefined;
  }
}

function isTemplateRef<C>(value: unknown): value is TemplateRef<C> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'createEmbeddedView' in value &&
    typeof (value as { createEmbeddedView?: unknown }).createEmbeddedView === 'function'
  );
}
