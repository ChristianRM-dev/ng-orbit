import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocsContentService } from '../docs/docs-content.service';
import { FeatureDocsPageComponent } from '../docs/feature-docs-page.component';

@Component({
  selector: 'ng-orbit-wizard-hub-page',
  standalone: true,
  imports: [FeatureDocsPageComponent],
  templateUrl: './wizard-hub-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardHubPageComponent {
  private readonly docsContentService = inject(DocsContentService);

  protected readonly docs = this.docsContentService.wizardDocs;
}
