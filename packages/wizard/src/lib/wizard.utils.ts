import type {
  OrbitWizardProgress,
  OrbitWizardStep,
  OrbitWizardStepDef,
  OrbitWizardValidityMap
} from './wizard.types';

/**
 * Canonical empty validity map used by the controller.
 *
 * @remarks
 * This low-level constant is exported for advanced integrations.
 */
export const EMPTY_ORBIT_WIZARD_VALIDITY: OrbitWizardValidityMap = Object.freeze({});

/**
 * Fallback step returned when the controller cannot resolve a current enabled step.
 *
 * @remarks
 * This constant mainly exists for defensive internal use and advanced integrations.
 */
export const EMPTY_ORBIT_WIZARD_STEP: OrbitWizardStep = Object.freeze({
  id: '',
  kind: 'step',
  optional: false,
  disabled: true,
  showInNav: false
});

/**
 * Normalizes a single consumer-provided step definition.
 *
 * @remarks
 * Blank ids are rejected and returned as `null`.
 */
export function normalizeOrbitWizardStep(step: OrbitWizardStepDef): OrbitWizardStep | null {
  const normalizedId = typeof step.id === 'string' ? step.id.trim() : '';
  if (!normalizedId) {
    return null;
  }

  const normalizedTitle =
    typeof step.title === 'string' && step.title.trim().length > 0 ? step.title : undefined;

  return {
    id: normalizedId,
    title: normalizedTitle,
    kind: step.kind === 'summary' ? 'summary' : 'step',
    optional: step.optional === true,
    disabled: step.disabled === true,
    showInNav: step.showInNav !== false
  };
}

/**
 * Normalizes a step array into a unique, controller-ready collection.
 *
 * @remarks
 * Invalid steps and duplicate ids are dropped. The first valid occurrence wins.
 */
export function normalizeOrbitWizardSteps(
  steps: readonly OrbitWizardStepDef[] | null | undefined
): OrbitWizardStep[] {
  if (!Array.isArray(steps)) {
    return [];
  }

  const normalizedSteps: OrbitWizardStep[] = [];
  const seenIds = new Set<string>();

  for (const step of steps) {
    const normalizedStep = normalizeOrbitWizardStep(step);
    if (!normalizedStep || seenIds.has(normalizedStep.id)) {
      continue;
    }

    seenIds.add(normalizedStep.id);
    normalizedSteps.push(normalizedStep);
  }

  return normalizedSteps;
}

/**
 * Finds the index of a step by id.
 */
export function findOrbitWizardStepIndexById(
  steps: readonly OrbitWizardStep[],
  stepId: string
): number {
  return steps.findIndex((step) => step.id === stepId);
}

/**
 * Finds the next enabled step after `currentIndex`.
 */
export function findNextEnabledOrbitWizardIndex(
  steps: readonly OrbitWizardStep[],
  currentIndex: number
): number {
  for (let index = currentIndex + 1; index < steps.length; index += 1) {
    if (!steps[index].disabled) {
      return index;
    }
  }

  return -1;
}

/**
 * Finds the previous enabled step before `currentIndex`.
 */
export function findPrevEnabledOrbitWizardIndex(
  steps: readonly OrbitWizardStep[],
  currentIndex: number
): number {
  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    if (!steps[index].disabled) {
      return index;
    }
  }

  return -1;
}

/**
 * Resolves the initial enabled index for a wizard instance.
 *
 * @remarks
 * Prefers `initialStepId` when it points to an enabled step, otherwise falls back to the
 * first enabled step.
 */
export function resolveOrbitWizardInitialIndex(
  steps: readonly OrbitWizardStep[],
  initialStepId?: string
): number {
  if (steps.length === 0) {
    return -1;
  }

  const normalizedInitialId = typeof initialStepId === 'string' ? initialStepId.trim() : '';
  if (normalizedInitialId) {
    const initialIndex = steps.findIndex(
      (step) => step.id === normalizedInitialId && !step.disabled
    );
    if (initialIndex >= 0) {
      return initialIndex;
    }
  }

  return steps.findIndex((step) => !step.disabled);
}

/**
 * Resolves the closest enabled step around a preferred index.
 */
export function resolveNearestEnabledOrbitWizardIndex(
  steps: readonly OrbitWizardStep[],
  preferredIndex: number
): number {
  if (steps.length === 0) {
    return -1;
  }

  const normalizedPreferredIndex = normalizeOrbitWizardIndex(preferredIndex, steps.length);
  if (normalizedPreferredIndex < 0) {
    return steps.findIndex((step) => !step.disabled);
  }

  if (!steps[normalizedPreferredIndex].disabled) {
    return normalizedPreferredIndex;
  }

  const previousEnabledIndex = findPrevEnabledOrbitWizardIndex(
    steps,
    normalizedPreferredIndex
  );
  if (previousEnabledIndex >= 0) {
    return previousEnabledIndex;
  }

  return findNextEnabledOrbitWizardIndex(steps, normalizedPreferredIndex);
}

/**
 * Normalizes an index so it is safe to use against a step array.
 */
export function normalizeOrbitWizardIndex(index: number, size: number): number {
  if (!Number.isFinite(index) || size <= 0) {
    return -1;
  }

  const normalized = Math.trunc(index);
  if (normalized < 0 || normalized >= size) {
    return -1;
  }

  return normalized;
}

/**
 * Removes visited ids that no longer exist in the current step set.
 */
export function pruneOrbitWizardVisited(
  visited: ReadonlySet<string>,
  validIds: ReadonlySet<string>
): Set<string> {
  const nextVisited = new Set<string>();

  for (const stepId of visited) {
    if (validIds.has(stepId)) {
      nextVisited.add(stepId);
    }
  }

  return nextVisited;
}

/**
 * Removes validity entries for step ids that are no longer present.
 */
export function pruneOrbitWizardValidity(
  validity: OrbitWizardValidityMap,
  validIds: ReadonlySet<string>
): Record<string, boolean> {
  const nextValidity: Record<string, boolean> = {};

  for (const [stepId, isValid] of Object.entries(validity)) {
    if (validIds.has(stepId)) {
      nextValidity[stepId] = isValid;
    }
  }

  return nextValidity;
}

/**
 * Returns whether a step may proceed according to the wizard contract.
 */
export function canOrbitWizardStepProceed(
  step: OrbitWizardStep,
  validity: OrbitWizardValidityMap
): boolean {
  return step.optional || validity[step.id] === true || step.kind === 'summary';
}

/**
 * Calculates derived wizard progress for the current enabled step set.
 */
export function calculateOrbitWizardProgress(
  steps: readonly OrbitWizardStep[],
  visited: ReadonlySet<string>,
  validity: OrbitWizardValidityMap,
  currentStepId: string
): OrbitWizardProgress {
  const enabledSteps = steps.filter((step) => !step.disabled);
  const total = enabledSteps.length;

  if (total === 0) {
    return {
      total: 0,
      visited: 0,
      valid: 0,
      completed: 0,
      percent: 0
    };
  }

  const visitedCount = enabledSteps.filter((step) => visited.has(step.id)).length;
  const validCount = enabledSteps.filter((step) => validity[step.id] === true).length;
  const completedCount = enabledSteps.filter(
    (step) => step.id !== currentStepId && visited.has(step.id) && canOrbitWizardStepProceed(step, validity)
  ).length;

  return {
    total,
    visited: visitedCount,
    valid: validCount,
    completed: completedCount,
    percent: Math.round((completedCount / total) * 100)
  };
}

/**
 * Compares two validity maps for semantic equality.
 */
export function areOrbitWizardValidityMapsEqual(
  left: OrbitWizardValidityMap,
  right: OrbitWizardValidityMap
): boolean {
  if (left === right) {
    return true;
  }

  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);

  if (leftEntries.length !== rightEntries.length) {
    return false;
  }

  for (const [stepId, value] of leftEntries) {
    if (right[stepId] !== value) {
      return false;
    }
  }

  return true;
}

/**
 * Compares two visited-step sets.
 */
export function areOrbitWizardVisitedSetsEqual(
  left: ReadonlySet<string>,
  right: ReadonlySet<string>
): boolean {
  if (left === right) {
    return true;
  }

  if (left.size !== right.size) {
    return false;
  }

  for (const stepId of left) {
    if (!right.has(stepId)) {
      return false;
    }
  }

  return true;
}

/**
 * Compares two normalized step collections.
 */
export function areOrbitWizardStepsEqual(
  left: readonly OrbitWizardStep[],
  right: readonly OrbitWizardStep[]
): boolean {
  if (left === right) {
    return true;
  }

  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftStep = left[index];
    const rightStep = right[index];

    if (
      leftStep.id !== rightStep.id ||
      leftStep.title !== rightStep.title ||
      leftStep.kind !== rightStep.kind ||
      leftStep.optional !== rightStep.optional ||
      leftStep.disabled !== rightStep.disabled ||
      leftStep.showInNav !== rightStep.showInNav
    ) {
      return false;
    }
  }

  return true;
}
