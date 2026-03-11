import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ng-orbit-wizard-daisy-placeholder-page',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './wizard-daisy-placeholder-page.component.html',
  styleUrl: './wizard-daisy-placeholder-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardDaisyPlaceholderPageComponent {}
