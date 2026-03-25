# Notify (headless) specification

Package: `@ng-orbit/notify`

## Goal
Provide a headless notification service that manages:
- non-blocking toast queueing and auto-dismiss behavior
- blocking notification queueing and action resolution
- global defaults through DI

The core does not:
- decide when your product should show a notification
- perform the business side effects behind confirm, retry, delete, or publish flows
- render final UI markup by itself
- support rich HTML or template projection in v1

---

## Public API

```ts
export type OrbitNotifyTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export type OrbitToastPosition =
  | 'top-start'
  | 'top-center'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-center'
  | 'bottom-end';

export interface OrbitNotifyAction {
  id: string;
  label: string;
  appearance?: 'primary' | 'secondary' | 'danger';
}

export interface OrbitToastOptions {
  id?: string;
  title?: string;
  message: string;
  tone?: OrbitNotifyTone;
  durationMs?: number;
  action?: OrbitNotifyAction;
  dismissible?: boolean;
  position?: OrbitToastPosition;
}

export interface OrbitBlockingOptions {
  id?: string;
  title: string;
  message?: string;
  tone?: OrbitNotifyTone;
  actions: readonly OrbitNotifyAction[];
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
}

export interface OrbitConfirmOptions {
  title: string;
  message?: string;
  tone?: OrbitNotifyTone;
  confirmLabel?: string;
  cancelLabel?: string;
}
```

---

## Service contract

`OrbitNotifyService` is provided through `provideOrbitNotify(...)`.

Methods:
- `show(input: string | OrbitToastOptions): OrbitToastRef`
- `success(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef`
- `info(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef`
- `warning(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef`
- `error(input: string | Omit<OrbitToastOptions, 'tone'>): OrbitToastRef`
- `openBlocking(options: OrbitBlockingOptions): Promise<string>`
- `confirm(input: string | OrbitConfirmOptions): Promise<'confirm' | 'cancel'>`
- `dismissToast(id: string): void`
- `clearToasts(): void`

Renderer-facing signals:
- `toasts(): readonly OrbitToast[]`
- `activeBlocking(): OrbitBlockingNotification | null`

Renderer helpers:
- `pauseToast(id: string): void`
- `resumeToast(id: string): void`
- `triggerToastAction(id: string): void`
- `runBlockingAction(actionId: string): void`
- `dismissBlocking(trigger: 'escape' | 'backdrop'): void`

---

## Behavior rules

1. Toasts are non-blocking and blocking notifications are FIFO.
2. Only one blocking notification is visible at a time.
3. Toast stack visible limit defaults to `3`.
4. Toast position defaults to `top-end`.
5. Toast duration defaults are tone-based:
   - `success = 3000`
   - `neutral/info = 4500`
   - `warning = 6000`
   - `error = 8000`
6. Toast timers start only when the toast enters the visible stack.
7. Toast timers pause on hover/focus and resume on leave/blur.
8. Blocking notifications do not close by Escape or backdrop unless explicitly enabled.
9. `confirm()` is sugar over `openBlocking()` with `cancel` and `confirm` actions.

---

## Optional renderer

Ready renderer package today:

- `@ng-orbit/notify-render-plain`

This renderer:
- mounts a text-first toast stack
- mounts a blocking modal shell
- reads state from `OrbitNotifyService`
- calls only renderer-facing helpers on the service
