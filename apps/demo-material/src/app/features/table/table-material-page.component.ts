import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitTableDirective } from '@ng-orbit/table';
import { OrbitTableRenderMaterialComponent } from '@ng-orbit/table-render-material';
import { TranslatePipe } from '@ngx-translate/core';
import { TableDemoFacade } from './table-demo.facade';

@Component({
  selector: 'ng-orbit-table-material-page',
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderMaterialComponent, TranslatePipe],
  providers: [TableDemoFacade],
  templateUrl: './table-material-page.component.html',
  styleUrl: './table-material-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableMaterialPageComponent {
  protected readonly facade = inject(TableDemoFacade);
}
