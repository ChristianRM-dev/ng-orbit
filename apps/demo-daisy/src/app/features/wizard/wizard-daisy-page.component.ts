import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OrbitWizardDirective } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';
import { OrbitWizardRenderDaisyComponent } from '@ng-orbit/wizard-render-daisy';
import { TranslatePipe } from '@ngx-translate/core';
import type { WizardDemoMode } from './wizard-demo.facade';
import { WizardDemoFacade } from './wizard-demo.facade';

@Component({
  selector: 'ng-orbit-wizard-daisy-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    OrbitWizardDirective,
    OrbitWizardStepFormSyncDirective,
    OrbitWizardRenderDaisyComponent
  ],
  providers: [WizardDemoFacade],
  templateUrl: './wizard-daisy-page.component.html',
  styleUrl: './wizard-daisy-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardDaisyPageComponent {
  protected readonly facade = inject(WizardDemoFacade);

  protected onModeChange(mode: WizardDemoMode, wizard: OrbitWizardDirective): void {
    this.facade.setMode(mode);
    wizard.reset();
  }
}
