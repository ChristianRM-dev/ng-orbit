import {
  createDefaultOrbitNotifyConfig,
  mergeOrbitNotifyConfig,
  normalizeOrbitNotifyAction,
  normalizeOrbitNotifyTone,
  normalizeOrbitToastPosition,
  resolveOrbitBlockingDismissActionId,
  resolveOrbitToastDurationMs,
  sanitizeOrbitNotifyId
} from './notify.utils';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

const defaults = createDefaultOrbitNotifyConfig();
assert(defaults.toast.visibleLimit === 3, 'default visibleLimit should be 3');
assert(defaults.toast.position === 'top-end', 'default toast position should be top-end');
assert(defaults.toast.durations.success === 3000, 'success duration should default to 3000ms');
assert(defaults.blocking.confirmTone === 'warning', 'confirm tone should default to warning');

const merged = mergeOrbitNotifyConfig({
  toast: {
    visibleLimit: 5,
    position: 'bottom-end',
    durations: {
      ...defaults.toast.durations,
      error: 12000
    }
  },
  blocking: {
    closeOnEscape: true,
    confirmLabel: 'Continue'
  }
});

assert(merged.toast.visibleLimit === 5, 'config should override the toast visible limit');
assert(merged.toast.position === 'bottom-end', 'config should override the toast position');
assert(merged.toast.durations.error === 12000, 'config should override tone durations');
assert(merged.toast.durations.success === 3000, 'config should preserve unspecified durations');
assert(merged.blocking.closeOnEscape, 'config should override closeOnEscape');
assert(merged.blocking.confirmLabel === 'Continue', 'config should override confirmLabel');

const normalizedAction = normalizeOrbitNotifyAction({
  id: ' retry ',
  label: ' Retry ',
  appearance: 'danger'
});
assert(normalizedAction?.id === 'retry', 'action ids should trim whitespace');
assert(normalizedAction?.label === 'Retry', 'action labels should trim whitespace');
assert(normalizedAction?.appearance === 'danger', 'valid appearances should be preserved');

assert(
  normalizeOrbitNotifyAction({ id: ' ', label: 'Undo' }) === null,
  'actions without a valid id should be dropped'
);
assert(
  normalizeOrbitNotifyTone('unknown', 'info') === 'info',
  'unknown tones should fall back to the provided value'
);
assert(
  normalizeOrbitToastPosition('somewhere', 'top-end') === 'top-end',
  'unknown toast positions should fall back to the provided value'
);
assert(
  resolveOrbitToastDurationMs(undefined, 'warning', defaults.toast) === 6000,
  'toast duration should fall back to the tone default'
);
assert(
  resolveOrbitToastDurationMs(2500, 'warning', defaults.toast) === 2500,
  'explicit positive durations should win over defaults'
);
assert(
  sanitizeOrbitNotifyId(' notify-1 ', 'fallback') === 'notify-1',
  'ids should trim whitespace before use'
);
assert(
  resolveOrbitBlockingDismissActionId({
    actions: [
      { id: 'back', label: 'Back', appearance: 'secondary' },
      { id: 'continue', label: 'Continue', appearance: 'primary' }
    ]
  }) === 'back',
  'blocking dismiss resolution should prefer a secondary action'
);
