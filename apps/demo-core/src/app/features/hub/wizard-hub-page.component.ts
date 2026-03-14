import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeatureDocsPageComponent } from '../docs/feature-docs-page.component';
import { WIZARD_DOCS } from '../docs/wizard-docs.data';

@Component({
  selector: 'ng-orbit-wizard-hub-page',
  standalone: true,
  imports: [FeatureDocsPageComponent],
  templateUrl: './wizard-hub-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardHubPageComponent {
  protected readonly docs = WIZARD_DOCS;
}
