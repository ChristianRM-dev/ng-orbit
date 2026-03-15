import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ADAPTERS_DOCS } from '../docs/adapters-docs.data';
import { FeatureDocsPageComponent } from '../docs/feature-docs-page.component';

@Component({
  selector: 'ng-orbit-adapters-hub-page',
  standalone: true,
  imports: [FeatureDocsPageComponent],
  templateUrl: './adapters-hub-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdaptersHubPageComponent {
  protected readonly docs = ADAPTERS_DOCS;
}
