import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { OrbitTableDirective } from '@ng-orbit/table';
import type {
  OrbitTableCellContext,
  OrbitTableColumn,
  OrbitTableHeaderContext
} from '@ng-orbit/table';

/**
 * Angular Material renderer for {@link OrbitTableDirective}.
 *
 * @remarks
 * This component packages a fast Material-based visual layer while keeping the controller
 * contract unchanged. It does not fetch data, own backend sorting rules, or replace the
 * consumer's feature-layer responsibilities.
 */
@Component({
  selector: 'orbit-table-render-material',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './orbit-table-render-material.component.html',
  styleUrl: './orbit-table-render-material.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrbitTableRenderMaterialComponent<T> {
  /**
   * Headless table controller instance bound by the parent template.
   */
  readonly table = input.required<OrbitTableDirective<T>>();
  protected readonly pageSizeOptions: readonly number[] = [10, 25, 50];
  protected readonly displayedColumns = computed(() => [
    '__select',
    ...this.table()
      .columns()
      .map((column) => column.id)
  ]);

  protected onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement | null;
    this.table().setSearch(inputElement?.value ?? '');
  }

  protected resolveHeaderTemplate(
    column: OrbitTableColumn<T>
  ): TemplateRef<OrbitTableHeaderContext<T>> | null {
    if (column.headerTemplate) {
      return column.headerTemplate;
    }

    return isTemplateRef<OrbitTableHeaderContext<T>>(column.header) ? column.header : null;
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

  protected getSortIcon(column: OrbitTableColumn<T>): string {
    const sort = this.table().query().sort;
    if (!sort || sort.activeId !== column.id) {
      return 'unfold_more';
    }

    return sort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  protected totalPages(): number {
    const query = this.table().query();
    return Math.max(1, Math.ceil(this.table().total() / query.pageSize));
  }

  protected resolveCellValue(row: T, column: OrbitTableColumn<T>): unknown {
    if (column.accessor) {
      return column.accessor(row);
    }

    if (column.property !== undefined) {
      return row[column.property];
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
