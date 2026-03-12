import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitTableDirective } from '@ng-orbit/table';
import { OrbitTableRenderMaterialComponent } from '@ng-orbit/table-render-material';
import { TableDemoFacade } from './table-demo.facade';

@Component({
  selector: 'ng-orbit-table-material-page',
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderMaterialComponent],
  providers: [TableDemoFacade],
  templateUrl: './table-material-page.component.html',
  styleUrl: './table-material-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableMaterialPageComponent {
  protected readonly facade = inject(TableDemoFacade);
}
