import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ng-orbit-wizard-material-placeholder-page',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './wizard-material-placeholder-page.component.html',
  styleUrl: './wizard-material-placeholder-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardMaterialPlaceholderPageComponent {}
