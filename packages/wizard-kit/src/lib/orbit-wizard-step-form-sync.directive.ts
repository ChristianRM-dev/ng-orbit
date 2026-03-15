import { Directive, effect, input } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import { OrbitWizardDirective } from '@ng-orbit/wizard';

/**
 * Bridges Angular form validity into {@link OrbitWizardDirective}.
 *
 * @remarks
 * This directive is an optional composition helper. It does not create forms or validation
 * rules. It only listens to the provided control and forwards its validity into the wizard.
 */
@Directive({
  selector: '[orbitWizardStepFormSync]',
  standalone: true
})
export class OrbitWizardStepFormSyncDirective {
  /**
   * Wizard controller that should receive validity updates.
   */
  readonly wizardInput = input.required<OrbitWizardDirective>({
    alias: 'orbitWizardStepFormSync'
  });
  /**
   * Step id that owns the provided form control.
   */
  readonly stepIdInput = input.required<string>({ alias: 'orbitWizardStepId' });
  /**
   * Angular form control or group whose `valid` state should be mirrored into the wizard.
   */
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
