import { Injectable, computed, inject, signal } from '@angular/core';
import { ORBIT_NOTIFY_CONFIG } from './orbit-notify.providers';
import {
  mergeOrbitNotifyConfig,
  normalizeOrbitNotifyAction,
  normalizeOrbitNotifyTone,
  normalizeOptionalText,
  normalizeOrbitToastPosition,
  resolveOrbitBlockingDismissActionId,
  resolveOrbitToastDurationMs,
  sanitizeOrbitNotifyId
} from './notify.utils';
import type {
  OrbitBlockingNotification,
  OrbitBlockingOptions,
  OrbitConfirmOptions,
  OrbitNotifyAction,
  OrbitNotifyConfig,
  OrbitNotifyResolvedConfig,
  OrbitNotifyTone,
  OrbitToast,
  OrbitToastCloseResult,
  OrbitToastOptions,
  OrbitToastRef
} from './notify.types';

interface OrbitToastRecord {
  readonly toast: OrbitToast;
  readonly closed: Promise<OrbitToastCloseResult>;
  readonly resolveClosed: (result: OrbitToastCloseResult) => void;
  remainingMs: number;
  startedAt: number | null;
  timeoutHandle: ReturnType<typeof setTimeout> | null;
  paused: boolean;
  settled: boolean;
}

interface OrbitBlockingRecord {
  readonly blocking: OrbitBlockingNotification;
  readonly resolved: Promise<string>;
  readonly resolve: (actionId: string) => void;
  settled: boolean;
}

/**
 * Headless notification service for toasts and blocking notification flows.
 *
 * @remarks
 * The service owns queueing, defaults, auto-dismiss timers, and the normalized state exposed
 * to renderer packages. Consumers still own the business side effects triggered after an
 * action resolves.
 */
@Injectable()
export class OrbitNotifyService {
  private readonly configInput = inject(ORBIT_NOTIFY_CONFIG);

  private readonly toastQueueState = signal<readonly OrbitToastRecord[]>([]);
  private readonly blockingQueueState = signal<readonly OrbitBlockingRecord[]>([]);

  private toastIdCounter = 0;
  private blockingIdCounter = 0;

  private readonly config: OrbitNotifyResolvedConfig = mergeOrbitNotifyConfig(
    this.configInput as OrbitNotifyConfig
  );

  /**
   * Visible toast stack exposed to renderers.
   */
  readonly toasts = computed<readonly OrbitToast[]>(() =>
    this.toastQueueState()
      .slice(0, this.config.toast.visibleLimit)
      .map((record) => record.toast)
  );

  /**
   * Current blocking notification exposed to renderers.
   */
  readonly activeBlocking = computed<OrbitBlockingNotification | null>(
    () => this.blockingQueueState()[0]?.blocking ?? null
  );

  /**
   * Opens a non-blocking toast using global defaults unless overridden by the call.
   */
  show(input: string | OrbitToastOptions): OrbitToastRef {
    const normalizedInput = this.normalizeToastInput(input);
    const takenIds = new Set(this.toastQueueState().map((record) => record.toast.id));
    const id = this.ensureUniqueId(
      normalizedInput.id,
      `orbit-toast-${++this.toastIdCounter}`,
      takenIds
    );

    let resolveClosed!: (result: OrbitToastCloseResult) => void;
    const closed = new Promise<OrbitToastCloseResult>((resolve) => {
      resolveClosed = resolve;
    });

    const toast: OrbitToast = {
      id,
      title: normalizedInput.title,
      message: normalizedInput.message,
      tone: normalizedInput.tone,
      durationMs: normalizedInput.durationMs,
      action: normalizedInput.action,
      dismissible: normalizedInput.dismissible,
      position: normalizedInput.position
    };

    const record: OrbitToastRecord = {
      toast,
      closed,
      resolveClosed,
      remainingMs: toast.durationMs,
      startedAt: null,
      timeoutHandle: null,
      paused: false,
      settled: false
    };

    this.toastQueueState.set([...this.toastQueueState(), record]);
    this.syncToastTimers();

    return {
      id,
      closed
    };
  }

  /**
   * Shortcut for a success toast.
   */
  success(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef {
    return this.show(this.withToastTone(input, 'success'));
  }

  /**
   * Shortcut for an info toast.
   */
  info(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef {
    return this.show(this.withToastTone(input, 'info'));
  }

  /**
   * Shortcut for a warning toast.
   */
  warning(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef {
    return this.show(this.withToastTone(input, 'warning'));
  }

  /**
   * Shortcut for an error toast.
   */
  error(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef {
    return this.show(this.withToastTone(input, 'error'));
  }

  /**
   * Opens a blocking notification and resolves with the chosen action id.
   */
  openBlocking(options: OrbitBlockingOptions): Promise<string> {
    const normalized = this.normalizeBlockingOptions(options);
    const takenIds = new Set(this.blockingQueueState().map((record) => record.blocking.id));
    const id = this.ensureUniqueId(
      normalized.id,
      `orbit-blocking-${++this.blockingIdCounter}`,
      takenIds
    );

    let resolve!: (actionId: string) => void;
    const resolved = new Promise<string>((resolver) => {
      resolve = resolver;
    });

    const blocking: OrbitBlockingNotification = {
      id,
      title: normalized.title,
      message: normalized.message,
      tone: normalized.tone,
      actions: normalized.actions,
      closeOnEscape: normalized.closeOnEscape,
      closeOnBackdrop: normalized.closeOnBackdrop
    };

    const record: OrbitBlockingRecord = {
      blocking,
      resolved,
      resolve,
      settled: false
    };

    this.blockingQueueState.set([...this.blockingQueueState(), record]);
    return resolved;
  }

  /**
   * Shortcut for confirm-style flows that resolve to `'confirm'` or `'cancel'`.
   */
  async confirm(input: string | OrbitConfirmOptions): Promise<'confirm' | 'cancel'> {
    const options =
      typeof input === 'string'
        ? ({
            title: input
          } satisfies OrbitConfirmOptions)
        : input;

    const actionId = await this.openBlocking({
      title: options.title,
      message: options.message,
      tone: options.tone ?? this.config.blocking.confirmTone,
      closeOnEscape: options.closeOnEscape,
      closeOnBackdrop: options.closeOnBackdrop,
      actions: [
        {
          id: 'cancel',
          label: normalizeOptionalText(options.cancelLabel) ?? this.config.blocking.cancelLabel,
          appearance: 'secondary'
        },
        {
          id: 'confirm',
          label:
            normalizeOptionalText(options.confirmLabel) ?? this.config.blocking.confirmLabel,
          appearance: 'primary'
        }
      ]
    });

    return actionId === 'confirm' ? 'confirm' : 'cancel';
  }

  /**
   * Dismisses a toast by id.
   */
  dismissToast(id: string): void {
    this.settleToast(id, { reason: 'dismiss' });
  }

  /**
   * Clears all queued and visible toasts.
   */
  clearToasts(): void {
    for (const record of this.toastQueueState()) {
      this.stopToastTimer(record);
      this.resolveToastRecord(record, { reason: 'dismiss' });
    }

    this.toastQueueState.set([]);
  }

  /**
   * Pauses the auto-dismiss timer for a visible toast.
   */
  pauseToast(id: string): void {
    const record = this.toastQueueState().find((toastRecord) => toastRecord.toast.id === id);
    if (!record || record.paused || !this.isToastVisible(id)) {
      return;
    }

    record.paused = true;
    this.stopToastTimer(record);
  }

  /**
   * Resumes the auto-dismiss timer for a visible toast.
   */
  resumeToast(id: string): void {
    const record = this.toastQueueState().find((toastRecord) => toastRecord.toast.id === id);
    if (!record || !record.paused || !this.isToastVisible(id)) {
      return;
    }

    record.paused = false;
    this.startToastTimer(record);
  }

  /**
   * Resolves a toast action and closes the toast.
   */
  triggerToastAction(id: string): void {
    const record = this.toastQueueState().find((toastRecord) => toastRecord.toast.id === id);
    const actionId = record?.toast.action?.id;

    if (!record || !actionId) {
      return;
    }

    this.settleToast(id, {
      reason: 'action',
      actionId
    });
  }

  /**
   * Resolves the current blocking notification with the chosen action.
   */
  runBlockingAction(actionId: string): void {
    const current = this.blockingQueueState()[0];
    if (!current) {
      return;
    }

    const targetAction = current.blocking.actions.find((action) => action.id === actionId);
    if (!targetAction) {
      return;
    }

    this.settleBlocking(current.blocking.id, targetAction.id);
  }

  /**
   * Dismisses the current blocking notification when the active rules allow it.
   */
  dismissBlocking(trigger: 'escape' | 'backdrop'): void {
    const current = this.blockingQueueState()[0];
    if (!current) {
      return;
    }

    if (trigger === 'escape' && !current.blocking.closeOnEscape) {
      return;
    }

    if (trigger === 'backdrop' && !current.blocking.closeOnBackdrop) {
      return;
    }

    this.settleBlocking(
      current.blocking.id,
      resolveOrbitBlockingDismissActionId(current.blocking)
    );
  }

  private normalizeToastInput(input: string | OrbitToastOptions): OrbitToast {
    const raw = typeof input === 'string' ? { message: input } : input;
    const tone = normalizeOrbitNotifyTone(raw.tone, 'neutral');
    const action = normalizeOrbitNotifyAction(raw.action);

    return {
      id: sanitizeOrbitNotifyId(raw.id, ''),
      title: normalizeOptionalText(raw.title),
      message: normalizeOptionalText(raw.message) ?? 'Notification',
      tone,
      durationMs: resolveOrbitToastDurationMs(raw.durationMs, tone, this.config.toast),
      action,
      dismissible:
        typeof raw.dismissible === 'boolean' ? raw.dismissible : this.config.toast.dismissible,
      position: normalizeOrbitToastPosition(raw.position, this.config.toast.position)
    };
  }

  private normalizeBlockingOptions(options: OrbitBlockingOptions): OrbitBlockingNotification {
    const normalizedActions = options.actions
      .map((action) => normalizeOrbitNotifyAction(action))
      .filter((action): action is OrbitNotifyAction => action !== null);

    return {
      id: sanitizeOrbitNotifyId(options.id, ''),
      title: normalizeOptionalText(options.title) ?? 'Action required',
      message: normalizeOptionalText(options.message),
      tone: normalizeOrbitNotifyTone(options.tone, 'neutral'),
      actions:
        normalizedActions.length > 0
          ? normalizedActions
          : [
              {
                id: 'close',
                label: 'Close',
                appearance: 'primary'
              }
            ],
      closeOnEscape:
        typeof options.closeOnEscape === 'boolean'
          ? options.closeOnEscape
          : this.config.blocking.closeOnEscape,
      closeOnBackdrop:
        typeof options.closeOnBackdrop === 'boolean'
          ? options.closeOnBackdrop
          : this.config.blocking.closeOnBackdrop
    };
  }

  private withToastTone(
    input: string | Omit<OrbitToastOptions, 'tone'>,
    tone: OrbitNotifyTone
  ): OrbitToastOptions {
    if (typeof input === 'string') {
      return {
        message: input,
        tone
      };
    }

    return {
      ...input,
      tone
    };
  }

  private ensureUniqueId(candidate: string, fallback: string, takenIds: ReadonlySet<string>): string {
    const preferredId = candidate || fallback;
    if (!takenIds.has(preferredId)) {
      return preferredId;
    }

    let suffix = 2;
    let nextId = `${preferredId}-${suffix}`;

    while (takenIds.has(nextId)) {
      suffix += 1;
      nextId = `${preferredId}-${suffix}`;
    }

    return nextId;
  }

  private isToastVisible(id: string): boolean {
    return this.toasts().some((toast) => toast.id === id);
  }

  private syncToastTimers(): void {
    const visibleIds = new Set(this.toasts().map((toast) => toast.id));

    for (const record of this.toastQueueState()) {
      if (!visibleIds.has(record.toast.id)) {
        this.stopToastTimer(record);
        continue;
      }

      if (record.paused || record.timeoutHandle !== null) {
        continue;
      }

      this.startToastTimer(record);
    }
  }

  private startToastTimer(record: OrbitToastRecord): void {
    if (record.settled) {
      return;
    }

    if (record.remainingMs <= 0) {
      this.settleToast(record.toast.id, { reason: 'timeout' });
      return;
    }

    record.startedAt = Date.now();
    record.timeoutHandle = setTimeout(() => {
      record.timeoutHandle = null;
      record.startedAt = null;
      this.settleToast(record.toast.id, { reason: 'timeout' });
    }, record.remainingMs);
  }

  private stopToastTimer(record: OrbitToastRecord): void {
    if (record.timeoutHandle === null) {
      return;
    }

    clearTimeout(record.timeoutHandle);
    record.timeoutHandle = null;

    if (record.startedAt !== null) {
      const elapsed = Date.now() - record.startedAt;
      record.remainingMs = Math.max(0, record.remainingMs - elapsed);
      record.startedAt = null;
    }
  }

  private settleToast(id: string, result: OrbitToastCloseResult): void {
    const record = this.toastQueueState().find((toastRecord) => toastRecord.toast.id === id);
    if (!record || record.settled) {
      return;
    }

    this.stopToastTimer(record);
    this.resolveToastRecord(record, result);
    this.toastQueueState.set(
      this.toastQueueState().filter((toastRecord) => toastRecord.toast.id !== id)
    );
    this.syncToastTimers();
  }

  private resolveToastRecord(record: OrbitToastRecord, result: OrbitToastCloseResult): void {
    if (record.settled) {
      return;
    }

    record.settled = true;
    record.resolveClosed(result);
  }

  private settleBlocking(id: string, actionId: string): void {
    const record = this.blockingQueueState().find(
      (blockingRecord) => blockingRecord.blocking.id === id
    );
    if (!record || record.settled) {
      return;
    }

    record.settled = true;
    record.resolve(actionId);
    this.blockingQueueState.set(
      this.blockingQueueState().filter((blockingRecord) => blockingRecord.blocking.id !== id)
    );
  }
}
