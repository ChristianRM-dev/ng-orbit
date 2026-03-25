import type {
  OrbitBlockingNotification,
  OrbitNotifyAction,
  OrbitNotifyBlockingConfig,
  OrbitNotifyConfig,
  OrbitNotifyResolvedConfig,
  OrbitNotifyTone,
  OrbitNotifyToastConfig,
  OrbitToastPosition
} from './notify.types';

export const ORBIT_NOTIFY_TONES: readonly OrbitNotifyTone[] = [
  'neutral',
  'info',
  'success',
  'warning',
  'error'
];

export const ORBIT_TOAST_POSITIONS: readonly OrbitToastPosition[] = [
  'top-start',
  'top-center',
  'top-end',
  'bottom-start',
  'bottom-center',
  'bottom-end'
];

const DEFAULT_TOAST_CONFIG: OrbitNotifyToastConfig = {
  visibleLimit: 3,
  position: 'top-end',
  dismissible: true,
  durations: {
    neutral: 4500,
    info: 4500,
    success: 3000,
    warning: 6000,
    error: 8000
  }
};

const DEFAULT_BLOCKING_CONFIG: OrbitNotifyBlockingConfig = {
  closeOnEscape: false,
  closeOnBackdrop: false,
  confirmTone: 'warning',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel'
};

/**
 * Built-in defaults used when no provider overrides are present.
 */
export function createDefaultOrbitNotifyConfig(): OrbitNotifyResolvedConfig {
  return {
    toast: {
      ...DEFAULT_TOAST_CONFIG,
      durations: { ...DEFAULT_TOAST_CONFIG.durations }
    },
    blocking: { ...DEFAULT_BLOCKING_CONFIG }
  };
}

/**
 * Merges user config over the built-in defaults.
 */
export function mergeOrbitNotifyConfig(
  config: OrbitNotifyConfig | null | undefined
): OrbitNotifyResolvedConfig {
  const defaults = createDefaultOrbitNotifyConfig();
  const toastConfig = config?.toast;
  const blockingConfig = config?.blocking;

  return {
    toast: {
      visibleLimit: normalizePositiveInt(
        toastConfig?.visibleLimit,
        defaults.toast.visibleLimit
      ),
      position: normalizeOrbitToastPosition(
        toastConfig?.position,
        defaults.toast.position
      ),
      dismissible:
        typeof toastConfig?.dismissible === 'boolean'
          ? toastConfig.dismissible
          : defaults.toast.dismissible,
      durations: mergeToneDurations(toastConfig?.durations, defaults.toast.durations)
    },
    blocking: {
      closeOnEscape:
        typeof blockingConfig?.closeOnEscape === 'boolean'
          ? blockingConfig.closeOnEscape
          : defaults.blocking.closeOnEscape,
      closeOnBackdrop:
        typeof blockingConfig?.closeOnBackdrop === 'boolean'
          ? blockingConfig.closeOnBackdrop
          : defaults.blocking.closeOnBackdrop,
      confirmTone: normalizeOrbitNotifyTone(
        blockingConfig?.confirmTone,
        defaults.blocking.confirmTone
      ),
      confirmLabel:
        normalizeOptionalText(blockingConfig?.confirmLabel) ??
        defaults.blocking.confirmLabel,
      cancelLabel:
        normalizeOptionalText(blockingConfig?.cancelLabel) ??
        defaults.blocking.cancelLabel
    }
  };
}

/**
 * Normalizes a tone value against the supported list.
 */
export function normalizeOrbitNotifyTone(
  tone: OrbitNotifyTone | string | null | undefined,
  fallback: OrbitNotifyTone
): OrbitNotifyTone {
  return ORBIT_NOTIFY_TONES.includes(tone as OrbitNotifyTone)
    ? (tone as OrbitNotifyTone)
    : fallback;
}

/**
 * Normalizes a toast position value against the supported list.
 */
export function normalizeOrbitToastPosition(
  position: OrbitToastPosition | string | null | undefined,
  fallback: OrbitToastPosition
): OrbitToastPosition {
  return ORBIT_TOAST_POSITIONS.includes(position as OrbitToastPosition)
    ? (position as OrbitToastPosition)
    : fallback;
}

/**
 * Normalizes an action model and removes invalid ids or labels.
 */
export function normalizeOrbitNotifyAction(
  action: OrbitNotifyAction | null | undefined
): OrbitNotifyAction | null {
  if (!action) {
    return null;
  }

  const id = normalizeOptionalText(action.id);
  const label = normalizeOptionalText(action.label);

  if (!id || !label) {
    return null;
  }

  const appearance = isActionAppearance(action.appearance)
    ? action.appearance
    : undefined;

  return {
    id,
    label,
    appearance
  };
}

/**
 * Normalizes text input and trims surrounding whitespace.
 */
export function normalizeOptionalText(value: string | null | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Normalizes user-provided ids while keeping readable generated fallbacks.
 */
export function sanitizeOrbitNotifyId(
  value: string | null | undefined,
  fallback: string
): string {
  return normalizeOptionalText(value) ?? fallback;
}

/**
 * Resolves the final duration for a toast.
 */
export function resolveOrbitToastDurationMs(
  requestedDurationMs: number | undefined,
  tone: OrbitNotifyTone,
  config: OrbitNotifyToastConfig
): number {
  if (Number.isFinite(requestedDurationMs) && (requestedDurationMs as number) > 0) {
    return Math.trunc(requestedDurationMs as number);
  }

  return config.durations[tone];
}

/**
 * Picks a stable action id when backdrop or Escape dismissal is enabled.
 */
export function resolveOrbitBlockingDismissActionId(
  blocking: Pick<OrbitBlockingNotification, 'actions'>
): string {
  const cancelAction = blocking.actions.find((action) => action.id === 'cancel');
  if (cancelAction) {
    return cancelAction.id;
  }

  const secondaryAction = blocking.actions.find(
    (action) => action.appearance === 'secondary'
  );
  if (secondaryAction) {
    return secondaryAction.id;
  }

  return blocking.actions[0]?.id ?? 'dismiss';
}

function mergeToneDurations(
  durations: Readonly<Record<OrbitNotifyTone, number>> | undefined,
  fallback: Readonly<Record<OrbitNotifyTone, number>>
): Readonly<Record<OrbitNotifyTone, number>> {
  const nextDurations = { ...fallback };

  for (const tone of ORBIT_NOTIFY_TONES) {
    const candidate = durations?.[tone];
    nextDurations[tone] = normalizePositiveInt(candidate, fallback[tone]);
  }

  return nextDurations;
}

function normalizePositiveInt(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  const normalized = Math.trunc(value as number);
  return normalized >= 1 ? normalized : fallback;
}

function isActionAppearance(value: string | undefined): value is OrbitNotifyAction['appearance'] {
  return value === 'primary' || value === 'secondary' || value === 'danger';
}
