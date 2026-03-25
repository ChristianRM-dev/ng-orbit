/**
 * Shared tone variants supported by ng-orbit notification APIs and renderers.
 */
export type OrbitNotifyTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

/**
 * Logical toast positions supported by the reference renderer.
 */
export type OrbitToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

/**
 * Button styling hint used by notification renderers.
 */
export type OrbitNotifyActionAppearance = 'primary' | 'secondary' | 'danger';

/**
 * Action model shared by toasts and blocking notifications.
 */
export interface OrbitNotifyAction {
  /**
   * Stable action id resolved back to the consumer.
   */
  id: string;
  /**
   * User-facing label.
   */
  label: string;
  /**
   * Optional renderer hint for visual emphasis.
   */
  appearance?: OrbitNotifyActionAppearance;
}

/**
 * Options accepted by `show()` and the tone helpers.
 */
export interface OrbitToastOptions {
  /**
   * Optional stable id. A generated one is used when omitted.
   */
  id?: string;
  /**
   * Optional short title shown above the message.
   */
  title?: string;
  /**
   * Main toast message.
   */
  message: string;
  /**
   * Tone used for defaults and visual styling.
   */
  tone?: OrbitNotifyTone;
  /**
   * Explicit auto-dismiss duration in milliseconds.
   */
  durationMs?: number;
  /**
   * Optional single action rendered next to the message.
   */
  action?: OrbitNotifyAction;
  /**
   * Whether the toast can be dismissed manually.
   */
  dismissible?: boolean;
  /**
   * Optional position override for this toast.
   */
  position?: OrbitToastPosition;
}

/**
 * Normalized toast state exposed to renderers.
 */
export interface OrbitToast {
  /**
   * Stable toast id.
   */
  id: string;
  /**
   * Optional heading.
   */
  title?: string;
  /**
   * Main message rendered in the stack.
   */
  message: string;
  /**
   * Normalized tone.
   */
  tone: OrbitNotifyTone;
  /**
   * Auto-dismiss duration in milliseconds.
   */
  durationMs: number;
  /**
   * Single optional action.
   */
  action: OrbitNotifyAction | null;
  /**
   * Whether the toast shows a manual close affordance.
   */
  dismissible: boolean;
  /**
   * Final renderer position for this toast.
   */
  position: OrbitToastPosition;
}

/**
 * Input model for blocking notifications opened through `openBlocking()`.
 */
export interface OrbitBlockingOptions {
  /**
   * Optional stable id. A generated one is used when omitted.
   */
  id?: string;
  /**
   * Required title rendered by the blocking shell.
   */
  title: string;
  /**
   * Optional supporting message.
   */
  message?: string;
  /**
   * Blocking tone used by renderers.
   */
  tone?: OrbitNotifyTone;
  /**
   * Required action list. The chosen action id resolves the returned promise.
   */
  actions: readonly OrbitNotifyAction[];
  /**
   * Whether Escape may dismiss the notification.
   */
  closeOnEscape?: boolean;
  /**
   * Whether clicking the backdrop may dismiss the notification.
   */
  closeOnBackdrop?: boolean;
}

/**
 * Normalized blocking notification exposed to renderers.
 */
export interface OrbitBlockingNotification {
  /**
   * Stable blocking id.
   */
  id: string;
  /**
   * Required heading text.
   */
  title: string;
  /**
   * Optional supporting message.
   */
  message?: string;
  /**
   * Normalized tone.
   */
  tone: OrbitNotifyTone;
  /**
   * Final action list shown in the modal footer.
   */
  actions: readonly OrbitNotifyAction[];
  /**
   * Whether Escape may dismiss the blocking shell.
   */
  closeOnEscape: boolean;
  /**
   * Whether clicking the backdrop may dismiss the blocking shell.
   */
  closeOnBackdrop: boolean;
}

/**
 * Short-hand input for confirm-style flows.
 */
export interface OrbitConfirmOptions {
  /**
   * Required confirm title.
   */
  title: string;
  /**
   * Optional supporting message.
   */
  message?: string;
  /**
   * Optional tone override. Defaults to `warning`.
   */
  tone?: OrbitNotifyTone;
  /**
   * Label used for the confirm action.
   */
  confirmLabel?: string;
  /**
   * Label used for the cancel action.
   */
  cancelLabel?: string;
  /**
   * Whether Escape may resolve the confirm flow.
   */
  closeOnEscape?: boolean;
  /**
   * Whether clicking the backdrop may resolve the confirm flow.
   */
  closeOnBackdrop?: boolean;
}

/**
 * Result resolved from a toast ref once the toast leaves the stack.
 */
export interface OrbitToastCloseResult {
  /**
   * Reason the toast closed.
   */
  reason: 'timeout' | 'dismiss' | 'action';
  /**
   * Optional action id when `reason === 'action'`.
   */
  actionId?: string;
}

/**
 * Handle returned when a toast is shown.
 */
export interface OrbitToastRef {
  /**
   * Stable toast id.
   */
  id: string;
  /**
   * Promise resolved once the toast closes.
   */
  closed: Promise<OrbitToastCloseResult>;
}

/**
 * Toast defaults shared across calls.
 */
export interface OrbitNotifyToastConfig {
  /**
   * Maximum number of visible toasts at once.
   */
  visibleLimit: number;
  /**
   * Default toast position.
   */
  position: OrbitToastPosition;
  /**
   * Whether toasts are dismissible by default.
   */
  dismissible: boolean;
  /**
   * Per-tone duration defaults.
   */
  durations: Readonly<Record<OrbitNotifyTone, number>>;
}

/**
 * Blocking defaults shared across calls.
 */
export interface OrbitNotifyBlockingConfig {
  /**
   * Default Escape dismissal rule.
   */
  closeOnEscape: boolean;
  /**
   * Default backdrop dismissal rule.
   */
  closeOnBackdrop: boolean;
  /**
   * Default tone used by `confirm()`.
   */
  confirmTone: OrbitNotifyTone;
  /**
   * Default confirm label.
   */
  confirmLabel: string;
  /**
   * Default cancel label.
   */
  cancelLabel: string;
}

/**
 * Consumer-facing configuration accepted by `provideOrbitNotify()`.
 */
export interface OrbitNotifyConfig {
  /**
   * Toast defaults overridden globally for the current injector tree.
   */
  toast?: Partial<OrbitNotifyToastConfig>;
  /**
   * Blocking notification defaults overridden globally for the current injector tree.
   */
  blocking?: Partial<OrbitNotifyBlockingConfig>;
}

/**
 * Fully normalized config used internally by the service.
 */
export interface OrbitNotifyResolvedConfig {
  /**
   * Resolved toast defaults.
   */
  toast: OrbitNotifyToastConfig;
  /**
   * Resolved blocking defaults.
   */
  blocking: OrbitNotifyBlockingConfig;
}
