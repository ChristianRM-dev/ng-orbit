import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitTableDirective } from '@ng-orbit/table';
import { OrbitTableRenderPlainComponent } from '@ng-orbit/table-render-plain';
import { TableDemoFacade } from './table-demo.facade';

@Component({
  selector: 'ng-orbit-table-plain-page',
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderPlainComponent],
  providers: [TableDemoFacade],
  templateUrl: './table-plain-page.component.html',
  styleUrl: './table-plain-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePlainPageComponent {
  protected readonly facade = inject(TableDemoFacade);
}
