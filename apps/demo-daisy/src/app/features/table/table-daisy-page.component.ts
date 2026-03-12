import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitTableDirective } from '@ng-orbit/table';
import { OrbitTableRenderDaisyComponent } from '@ng-orbit/table-render-daisy';
import { TableDemoFacade } from './table-demo.facade';

@Component({
  selector: 'ng-orbit-table-daisy-page',
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderDaisyComponent],
  providers: [TableDemoFacade],
  templateUrl: './table-daisy-page.component.html',
  styleUrl: './table-daisy-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDaisyPageComponent {
  protected readonly facade = inject(TableDemoFacade);
}
