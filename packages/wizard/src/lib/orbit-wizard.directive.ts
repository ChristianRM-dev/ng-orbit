import {
  Directive,
  computed,
  effect,
  input,
  isDevMode,
  output,
  signal,
  untracked
} from '@angular/core';
import {
  EMPTY_ORBIT_WIZARD_STEP,
  EMPTY_ORBIT_WIZARD_VALIDITY,
  areOrbitWizardStepsEqual,
  areOrbitWizardValidityMapsEqual,
  areOrbitWizardVisitedSetsEqual,
  calculateOrbitWizardProgress,
  canOrbitWizardStepProceed,
  findNextEnabledOrbitWizardIndex,
  findOrbitWizardStepIndexById,
  findPrevEnabledOrbitWizardIndex,
  normalizeOrbitWizardIndex,
  normalizeOrbitWizardSteps,
  pruneOrbitWizardValidity,
  pruneOrbitWizardVisited,
  resolveNearestEnabledOrbitWizardIndex,
  resolveOrbitWizardInitialIndex
} from './wizard.utils';
import type {
  OrbitWizardProgress,
  OrbitWizardStep,
  OrbitWizardStepChangeEvent,
  OrbitWizardStepDef,
  OrbitWizardValidityMap
} from './wizard.types';

@Directive({
  selector: '[orbitWizard]',
  exportAs: 'orbitWizard',
  standalone: true
})
export class OrbitWizardDirective {
  readonly stepsInput = input.required<readonly OrbitWizardStepDef[]>({ alias: 'steps' });
  readonly initialStepIdInput = input<string | undefined>(undefined, {
    alias: 'initialStepId'
  });
  readonly linearInput = input(true, { alias: 'linear' });

  readonly stepChange = output<OrbitWizardStepChangeEvent>();
  readonly completed = output<void>();

  private readonly stepsState = signal<readonly OrbitWizardStep[]>([]);
  private readonly indexState = signal(0);
  private readonly visitedState = signal<ReadonlySet<string>>(new Set<string>());
  private readonly validityState = signal<OrbitWizardValidityMap>(EMPTY_ORBIT_WIZARD_VALIDITY);
  private initialized = false;

  readonly steps = computed(() => this.stepsState());
  readonly index = computed(() => this.indexState());
  readonly current = computed<OrbitWizardStep>(() => {
    const currentStep = this.stepsState()[this.indexState()];
    if (currentStep) {
      return currentStep;
    }

    return this.stepsState().find((step) => !step.disabled) ?? EMPTY_ORBIT_WIZARD_STEP;
  });
  readonly visited = computed(() => this.visitedState());
  readonly validity = computed(() => this.validityState());

  readonly progress = computed<OrbitWizardProgress>(() =>
    calculateOrbitWizardProgress(
      this.stepsState(),
      this.visitedState(),
      this.validityState(),
      this.current().id
    )
  );

  readonly isFirst = computed(() => {
    const currentIndex = findOrbitWizardStepIndexById(this.stepsState(), this.current().id);
    if (currentIndex < 0) {
      return true;
    }

    return findPrevEnabledOrbitWizardIndex(this.stepsState(), currentIndex) < 0;
  });

  readonly isLast = computed(() => {
    const currentIndex = findOrbitWizardStepIndexById(this.stepsState(), this.current().id);
    if (currentIndex < 0) {
      return true;
    }

    return findNextEnabledOrbitWizardIndex(this.stepsState(), currentIndex) < 0;
  });

  readonly canPrev = computed(() => {
    const currentIndex = findOrbitWizardStepIndexById(this.stepsState(), this.current().id);
    if (currentIndex < 0) {
      return false;
    }

    return findPrevEnabledOrbitWizardIndex(this.stepsState(), currentIndex) >= 0;
  });

  readonly canNext = computed(() => {
    const currentStep = this.current();
    if (!currentStep.id || currentStep.disabled) {
      return false;
    }

    return canOrbitWizardStepProceed(currentStep, this.validityState());
  });

  constructor() {
    effect(() => {
      const normalizedSteps = normalizeOrbitWizardSteps(this.stepsInput());
      const hasEnabledSteps = normalizedSteps.some((step) => !step.disabled);

      if (!hasEnabledSteps) {
        if (isDevMode()) {
          throw new Error(
            '[orbitWizard] requires at least one enabled step. All steps are disabled or invalid.'
          );
        }

        return;
      }

      const previousSteps = untracked(() => this.stepsState());
      const previousIndex = untracked(() => this.indexState());
      const previousVisited = untracked(() => this.visitedState());
      const previousValidity = untracked(() => this.validityState());

      const validIds = new Set(normalizedSteps.map((step) => step.id));
      const prunedVisited = pruneOrbitWizardVisited(previousVisited, validIds);
      const prunedValidity = pruneOrbitWizardValidity(previousValidity, validIds);

      const nextIndex = untracked(() => this.resolveIndexFromInputChange(normalizedSteps));
      if (nextIndex < 0) {
        if (isDevMode()) {
          throw new Error('[orbitWizard] could not resolve an enabled current step.');
        }

        return;
      }

      const nextCurrentId = normalizedSteps[nextIndex]?.id;
      if (!nextCurrentId) {
        return;
      }

      prunedVisited.add(nextCurrentId);

      if (!areOrbitWizardStepsEqual(previousSteps, normalizedSteps)) {
        this.stepsState.set(normalizedSteps);
      }

      if (previousIndex !== nextIndex) {
        this.indexState.set(nextIndex);
      }

      if (!areOrbitWizardVisitedSetsEqual(previousVisited, prunedVisited)) {
        this.visitedState.set(prunedVisited);
      }

      if (!areOrbitWizardValidityMapsEqual(previousValidity, prunedValidity)) {
        this.validityState.set(prunedValidity);
      }

      this.initialized = true;
    });
  }

  canGoTo(stepId: string): boolean {
    const targetIndex = findOrbitWizardStepIndexById(this.stepsState(), stepId);
    if (targetIndex < 0) {
      return false;
    }

    const targetStep = this.stepsState()[targetIndex];
    if (targetStep.disabled) {
      return false;
    }

    if (!this.linearInput()) {
      return true;
    }

    const currentStepId = this.current().id;
    if (stepId === currentStepId) {
      return true;
    }

    return this.visitedState().has(stepId);
  }

  next(): void {
    if (!this.canNext()) {
      return;
    }

    const currentStepIndex = findOrbitWizardStepIndexById(this.stepsState(), this.current().id);
    if (currentStepIndex < 0) {
      return;
    }

    const nextEnabledIndex = findNextEnabledOrbitWizardIndex(this.stepsState(), currentStepIndex);
    if (nextEnabledIndex < 0) {
      this.completed.emit();
      return;
    }

    this.commitIndex(nextEnabledIndex, true);
  }

  prev(): void {
    const currentStepIndex = findOrbitWizardStepIndexById(this.stepsState(), this.current().id);
    if (currentStepIndex < 0) {
      return;
    }

    const previousEnabledIndex = findPrevEnabledOrbitWizardIndex(this.stepsState(), currentStepIndex);
    if (previousEnabledIndex < 0) {
      return;
    }

    this.commitIndex(previousEnabledIndex, true);
  }

  goTo(stepId: string): void {
    if (!this.canGoTo(stepId)) {
      return;
    }

    const nextIndex = findOrbitWizardStepIndexById(this.stepsState(), stepId);
    if (nextIndex < 0) {
      return;
    }

    this.commitIndex(nextIndex, true);
  }

  goToIndex(index: number): void {
    const normalizedIndex = normalizeOrbitWizardIndex(index, this.stepsState().length);
    if (normalizedIndex < 0) {
      return;
    }

    this.goTo(this.stepsState()[normalizedIndex].id);
  }

  reset(): void {
    const resetIndex = resolveOrbitWizardInitialIndex(
      this.stepsState(),
      this.initialStepIdInput()
    );
    if (resetIndex < 0) {
      return;
    }

    const resetStepId = this.stepsState()[resetIndex]?.id;
    if (!resetStepId) {
      return;
    }

    this.validityState.set(EMPTY_ORBIT_WIZARD_VALIDITY);
    this.visitedState.set(new Set<string>([resetStepId]));
    this.commitIndex(resetIndex, false);
  }

  setValid(stepId: string, valid: boolean): void {
    if (findOrbitWizardStepIndexById(this.stepsState(), stepId) < 0) {
      return;
    }

    const normalizedValid = valid === true;
    if (this.validityState()[stepId] === normalizedValid) {
      return;
    }

    this.validityState.set({
      ...this.validityState(),
      [stepId]: normalizedValid
    });
  }

  isVisited(stepId: string): boolean {
    return this.visitedState().has(stepId);
  }

  isStepValid(stepId: string): boolean {
    return this.validityState()[stepId] === true;
  }

  private resolveIndexFromInputChange(nextSteps: readonly OrbitWizardStep[]): number {
    if (!this.initialized) {
      return resolveOrbitWizardInitialIndex(nextSteps, this.initialStepIdInput());
    }

    const currentStepId = this.current().id;
    const currentIndexInNext = currentStepId
      ? findOrbitWizardStepIndexById(nextSteps, currentStepId)
      : -1;

    if (currentIndexInNext >= 0 && !nextSteps[currentIndexInNext].disabled) {
      return currentIndexInNext;
    }

    const preferredIndex =
      currentIndexInNext >= 0 ? currentIndexInNext : this.indexState();

    const nearestEnabledIndex = resolveNearestEnabledOrbitWizardIndex(nextSteps, preferredIndex);
    if (nearestEnabledIndex >= 0) {
      return nearestEnabledIndex;
    }

    return resolveOrbitWizardInitialIndex(nextSteps, this.initialStepIdInput());
  }

  private commitIndex(nextIndex: number, emitStepChange: boolean): void {
    const normalizedIndex = normalizeOrbitWizardIndex(nextIndex, this.stepsState().length);
    if (normalizedIndex < 0) {
      return;
    }

    const targetStep = this.stepsState()[normalizedIndex];
    if (!targetStep || targetStep.disabled) {
      return;
    }

    const previousStep = this.stepsState()[this.indexState()];
    const hasIndexChanged = this.indexState() !== normalizedIndex;

    if (hasIndexChanged) {
      this.indexState.set(normalizedIndex);
    }

    const nextVisited = new Set(this.visitedState());
    nextVisited.add(targetStep.id);
    if (!areOrbitWizardVisitedSetsEqual(this.visitedState(), nextVisited)) {
      this.visitedState.set(nextVisited);
    }

    if (
      emitStepChange &&
      hasIndexChanged &&
      previousStep &&
      previousStep.id !== targetStep.id
    ) {
      this.stepChange.emit({
        fromId: previousStep.id,
        toId: targetStep.id
      });
    }
  }
}
