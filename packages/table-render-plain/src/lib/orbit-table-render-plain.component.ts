import { NgTemplateOutlet } from '@angular/common';
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
  imports: [NgTemplateOutlet],
  templateUrl: './orbit-table-render-plain.component.html',
  styleUrl: './orbit-table-render-plain.component.scss'
})
export class OrbitTableRenderPlainComponent<T> {
  readonly table = input.required<OrbitTableDirective<T>>();
  protected readonly pageSizeOptions: readonly number[] = [10, 25, 50];

  protected onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.table().setSearch(inputElement?.value ?? '');
  }

  protected onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    const parsedSize = Number(selectElement?.value);
    this.table().setPageSize(parsedSize);
  }

  protected resolveHeaderTemplate(
    column: OrbitTableColumn<T>
  ): TemplateRef<OrbitTableHeaderContext<T>> | null {
    if (column.headerTemplate) {
      return column.headerTemplate;
    }

    return isTemplateRef<OrbitTableHeaderContext<T>>(column.header)
      ? column.header
      : null;
  }

  protected resolveHeaderLabel(column: OrbitTableColumn<T>): string {
    return isTemplateRef<OrbitTableHeaderContext<T>>(column.header) ? '' : column.header;
  }

  protected getHeaderContext(column: OrbitTableColumn<T>): OrbitTableHeaderContext<T> {
    const query = this.table().query();
    const isSorted = query.sort?.activeId === column.id;

    return {
      column,
      query,
      isSorted,
      sortDir: isSorted ? query.sort?.direction ?? null : null
    };
  }

  protected getCellContext(
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

  protected getSortIndicator(column: OrbitTableColumn<T>): string {
    if (!column.sortable) {
      return '';
    }

    const sort = this.table().query().sort;
    if (!sort || sort.activeId !== column.id) {
      return '(sort)';
    }

    return sort.direction === 'asc' ? '(asc)' : '(desc)';
  }

  protected getTotalPages(): number {
    const query = this.table().query();
    return Math.max(1, Math.ceil(this.table().total() / query.pageSize));
  }

  protected resolveCellValue(row: T, column: OrbitTableColumn<T>): unknown {
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
