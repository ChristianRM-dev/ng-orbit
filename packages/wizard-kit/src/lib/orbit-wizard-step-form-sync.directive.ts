import { Directive, effect, input } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import { OrbitWizardDirective } from '@ng-orbit/wizard';

@Directive({
  selector: '[orbitWizardStepFormSync]',
  standalone: true
})
export class OrbitWizardStepFormSyncDirective {
  readonly wizardInput = input.required<OrbitWizardDirective>({
    alias: 'orbitWizardStepFormSync'
  });
  readonly stepIdInput = input.required<string>({ alias: 'orbitWizardStepId' });
  readonly formInput = input.required<AbstractControl>({ alias: 'orbitWizardStepForm' });

  constructor() {
    effect((onCleanup) => {
      const wizard = this.wizardInput();
      const rawStepId = this.stepIdInput();
      const form = this.formInput();
      const stepId = rawStepId.trim();

      if (!stepId) {
        return;
      }

      const syncValidity = () => {
        wizard.setValid(stepId, form.valid);
      };

      syncValidity();

      const statusSubscription = form.statusChanges.subscribe(() => {
        syncValidity();
      });

      onCleanup(() => {
        statusSubscription.unsubscribe();
      });
    });
  }
}
