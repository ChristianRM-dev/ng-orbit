import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { OrbitWizardStep } from '@ng-orbit/wizard';
import { OrbitWizardDirective } from '@ng-orbit/wizard';

/**
 * DaisyUI/Tailwind-flavored renderer for {@link OrbitWizardDirective}.
 *
 * @remarks
 * The renderer stays presentation-only. Consumers continue to own forms, validation,
 * persistence, and any business-specific navigation rules outside the headless contract.
 */
@Component({
  selector: 'orbit-wizard-render-daisy',
  standalone: true,
  templateUrl: './orbit-wizard-render-daisy.component.html',
  styleUrl: './orbit-wizard-render-daisy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrbitWizardRenderDaisyComponent {
  /**
   * Headless wizard controller instance bound by the parent template.
   */
  readonly wizard = input.required<OrbitWizardDirective>();

  protected readonly enabledSteps = computed(() =>
    this.wizard()
      .steps()
      .filter((step) => !step.disabled)
  );

  protected readonly navSteps = computed(() =>
    this.enabledSteps().filter((step) => step.showInNav)
  );

  protected readonly nextLabel = computed(() =>
    this.wizard().isLast() ? 'Finish' : 'Next'
  );

  protected readonly currentStepLabel = computed(() => {
    const currentStep = this.wizard().current();
    return currentStep.title ?? currentStep.id ?? '';
  });

  protected readonly currentStepPosition = computed(() => {
    const currentStepId = this.wizard().current().id;
    const currentIndex = this.enabledSteps().findIndex((step) => step.id === currentStepId);
    return currentIndex >= 0 ? currentIndex + 1 : 1;
  });

  protected readonly progressPercent = computed(() => this.wizard().progress().percent);

  protected canSelectStep(stepId: string): boolean {
    const currentStepId = this.wizard().current().id;
    if (currentStepId === stepId) {
      return true;
    }

    return this.wizard().canGoTo(stepId);
  }

  protected stepTitle(step: OrbitWizardStep): string {
    return step.title ?? step.id;
  }

  protected isStepPrimary(step: OrbitWizardStep): boolean {
    return (
      step.id === this.wizard().current().id ||
      (this.wizard().isVisited(step.id) &&
        (this.wizard().isStepValid(step.id) || step.optional || step.kind === 'summary'))
    );
  }
}
