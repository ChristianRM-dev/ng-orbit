import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocsContentService } from '../docs/docs-content.service';
import { FeatureDocsPageComponent } from '../docs/feature-docs-page.component';

@Component({
  selector: 'ng-orbit-notify-hub-page',
  standalone: true,
  imports: [FeatureDocsPageComponent],
  templateUrl: './notify-hub-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotifyHubPageComponent {
  private readonly docsContentService = inject(DocsContentService);

  protected readonly docs = this.docsContentService.notifyDocs;
}
