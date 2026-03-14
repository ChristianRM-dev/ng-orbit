import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OrbitWizardDirective } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';
import { OrbitWizardRenderMaterialComponent } from '@ng-orbit/wizard-render-material';
import { TranslatePipe } from '@ngx-translate/core';
import type { WizardDemoMode } from './wizard-demo.facade';
import { WizardDemoFacade } from './wizard-demo.facade';

@Component({
  selector: 'ng-orbit-wizard-material-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    OrbitWizardDirective,
    OrbitWizardStepFormSyncDirective,
    OrbitWizardRenderMaterialComponent
  ],
  providers: [WizardDemoFacade],
  templateUrl: './wizard-material-page.component.html',
  styleUrl: './wizard-material-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardMaterialPageComponent {
  protected readonly facade = inject(WizardDemoFacade);

  protected onModeChange(mode: WizardDemoMode, wizard: OrbitWizardDirective): void {
    this.facade.setMode(mode);
    wizard.reset();
  }
}
