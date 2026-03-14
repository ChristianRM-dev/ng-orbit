import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureDocsPageComponent } from '../docs/feature-docs-page.component';
import { TABLE_DOCS } from '../docs/table-docs.data';

@Component({
  selector: 'ng-orbit-table-hub-page',
  standalone: true,
  imports: [FeatureDocsPageComponent],
  templateUrl: './table-hub-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableHubPageComponent {
  protected readonly docs = TABLE_DOCS;
}
