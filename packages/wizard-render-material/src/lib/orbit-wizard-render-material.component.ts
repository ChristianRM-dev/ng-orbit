import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { OrbitWizardStep } from '@ng-orbit/wizard';
import { OrbitWizardDirective } from '@ng-orbit/wizard';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'orbit-wizard-render-material',
  standalone: true,
  imports: [MatButtonModule, MatStepperModule],
  templateUrl: './orbit-wizard-render-material.component.html',
  styleUrl: './orbit-wizard-render-material.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrbitWizardRenderMaterialComponent {
  readonly wizard = input.required<OrbitWizardDirective>();

  protected readonly enabledSteps = computed(() =>
    this.wizard()
      .steps()
      .filter((step) => !step.disabled)
  );

  protected readonly navSteps = computed(() =>
    this.enabledSteps().filter((step) => step.showInNav)
  );

  protected readonly selectedNavIndex = computed(() => {
    const currentStepId = this.wizard().current().id;
    const index = this.navSteps().findIndex((step) => step.id === currentStepId);
    return index >= 0 ? index : 0;
  });

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

  protected onSelectedNavIndexChange(index: number): void {
    const selectedStep = this.navSteps()[index];
    if (!selectedStep) {
      return;
    }

    this.wizard().goTo(selectedStep.id);
  }

  protected canSelectStep(stepId: string): boolean {
    const currentStepId = this.wizard().current().id;
    if (stepId === currentStepId) {
      return true;
    }

    return this.wizard().canGoTo(stepId);
  }

  protected stepTitle(step: OrbitWizardStep): string {
    return step.title ?? step.id;
  }

  protected isStepCompleted(step: OrbitWizardStep): boolean {
    return (
      this.wizard().isVisited(step.id) &&
      (this.wizard().isStepValid(step.id) || step.optional || step.kind === 'summary')
    );
  }
}
