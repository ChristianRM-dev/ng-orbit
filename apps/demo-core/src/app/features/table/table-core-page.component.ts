import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitTableDirective, type OrbitTableColumn } from '@ng-orbit/table';
import { TranslatePipe } from '@ngx-translate/core';
import type { DemoPersonRow } from '../../core/data/table-demo.types';
import { TableDemoFacade } from './table-demo.facade';

@Component({
  selector: 'ng-orbit-table-core-page',
  standalone: true,
  imports: [OrbitTableDirective, TranslatePipe],
  providers: [TableDemoFacade],
  templateUrl: './table-core-page.component.html',
  styleUrl: './table-core-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableCorePageComponent {
  protected readonly facade = inject(TableDemoFacade);

  protected renderHeader(column: OrbitTableColumn<DemoPersonRow>): string {
    return typeof column.header === 'string' ? column.header : column.id;
  }

  protected parsePageSize(event: Event): number {
    const selectElement = event.target as HTMLSelectElement | null;
    return Number(selectElement?.value ?? 10);
  }

  protected parseSearch(event: Event): string {
    const inputElement = event.target as HTMLInputElement | null;
    return inputElement?.value ?? '';
  }
}
