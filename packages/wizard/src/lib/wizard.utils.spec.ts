import {
  calculateOrbitWizardProgress,
  canOrbitWizardStepProceed,
  normalizeOrbitWizardStep,
  normalizeOrbitWizardSteps,
  pruneOrbitWizardValidity,
  pruneOrbitWizardVisited,
  resolveNearestEnabledOrbitWizardIndex,
  resolveOrbitWizardInitialIndex
} from './wizard.utils';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const normalizedStep = normalizeOrbitWizardStep({
  id: ' account ',
  kind: 'summary',
  optional: true,
  disabled: false,
  showInNav: false
});
assert(normalizedStep?.id === 'account', 'step id should trim whitespace');
assert(normalizedStep?.kind === 'summary', 'summary kind should be preserved');
assert(normalizedStep?.optional === true, 'optional should be preserved');
assert(normalizedStep?.showInNav === false, 'showInNav false should be preserved');

const normalizedSteps = normalizeOrbitWizardSteps([
  { id: 'a' },
  { id: 'a' },
  { id: 'b', disabled: true },
  { id: ' ' }
]);
assert(normalizedSteps.length === 2, 'steps should dedupe by id and remove invalid ids');

const initialIndex = resolveOrbitWizardInitialIndex(
  [
    { id: 'intro', kind: 'step', optional: false, disabled: true, showInNav: true },
    { id: 'details', kind: 'step', optional: false, disabled: false, showInNav: true }
  ],
  'details'
);
assert(initialIndex === 1, 'initialStepId should select enabled step when available');

const nearestEnabledIndex = resolveNearestEnabledOrbitWizardIndex(
  [
    { id: 'a', kind: 'step', optional: false, disabled: false, showInNav: true },
    { id: 'b', kind: 'step', optional: false, disabled: true, showInNav: true },
    { id: 'c', kind: 'step', optional: false, disabled: false, showInNav: true }
  ],
  1
);
assert(nearestEnabledIndex === 0, 'nearest enabled index should prefer previous enabled step');

const prunedVisited = pruneOrbitWizardVisited(
  new Set(['a', 'b', 'c']),
  new Set(['a', 'c'])
);
assert(prunedVisited.size === 2 && prunedVisited.has('a') && prunedVisited.has('c'), 'visited should prune removed ids');

const prunedValidity = pruneOrbitWizardValidity(
  { a: true, b: false, c: true },
  new Set(['a', 'c'])
);
assert(
  Object.keys(prunedValidity).length === 2 &&
    prunedValidity.a === true &&
    prunedValidity.c === true,
  'validity should prune removed ids'
);

const progress = calculateOrbitWizardProgress(
  [
    { id: 'a', kind: 'step', optional: false, disabled: false, showInNav: true },
    { id: 'b', kind: 'step', optional: true, disabled: false, showInNav: true },
    { id: 'c', kind: 'summary', optional: false, disabled: false, showInNav: true }
  ],
  new Set(['a', 'b', 'c']),
  { a: true, b: false, c: false },
  'c'
);
assert(progress.total === 3, 'progress total should count enabled steps');
assert(progress.visited === 3, 'progress visited should count visited enabled steps');
assert(progress.valid === 1, 'progress valid should count valid enabled steps');
assert(progress.completed === 2, 'progress completed should count navigated and passable previous steps');

assert(
  canOrbitWizardStepProceed(
    { id: 'summary', kind: 'summary', optional: false, disabled: false, showInNav: true },
    {}
  ),
  'summary step should always allow proceed'
);
