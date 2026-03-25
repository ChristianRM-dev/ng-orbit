# @ng-orbit/notify

Headless notification service for Angular applications that want app-wide toasts, confirms, and
blocking notifications without giving up ownership of side effects.

## AI Quick Map

- Role: headless notification service that owns queues, defaults, timers, and blocking action resolution
- Install: `pnpm add @ng-orbit/notify @ng-orbit/notify-render-plain`
- Pair with: `@ng-orbit/notify-render-plain`
- Package owns: toast stacking, auto-dismiss timing, blocking FIFO flow, config defaults, and renderer-facing signals
- Consumer owns: what happens after actions resolve, copy strategy, analytics, and final product styling
- Recommended path: provide the service once at app root, mount the plain renderer once, then call `notify.success()` or `await notify.confirm()`

## What it is

`@ng-orbit/notify` exposes an injector-scoped service and provider for global notifications.
It keeps toast timing and blocking queue behavior headless so the UI shell can stay swappable.

## Install

Recommended setup:

```bash
pnpm add @ng-orbit/notify @ng-orbit/notify-render-plain
```

## Use this when

- your app wants a shared notification channel across screens and features
- you want confirms and action prompts without coupling them to one design system
- you want fast defaults with room for global and per-call overrides

## Do not use this when

- you want a persistence layer or notification inbox
- you expect the package to perform business actions for you
- you need template projection or rich HTML content in v1

## Library owns

- toast queueing and visible stack limits
- per-tone auto-dismiss defaults and pause/resume timing
- blocking FIFO flow and action-id resolution
- injector-scoped defaults through `provideOrbitNotify(...)`

## Consumer owns

- the actions triggered after toast or blocking results resolve
- analytics, copy rules, and product-specific policies
- whether to use the plain renderer or a custom renderer shell

## Primary exports

- `provideOrbitNotify()` for injector-scoped defaults and service provisioning
- `OrbitNotifyService` for `show`, `success`, `error`, `openBlocking`, `confirm`, and queue helpers
- `OrbitToast`, `OrbitBlockingNotification`, and config types for renderer and consumer integrations

## Smallest working example

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideOrbitNotify, OrbitNotifyService } from '@ng-orbit/notify';
import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';

@Component({
  standalone: true,
  imports: [OrbitNotifyRenderPlainComponent],
  providers: [provideOrbitNotify()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="save()">Save draft</button>
    <orbit-notify-render-plain />
  `
})
export class SaveDraftButtonComponent {
  private readonly notify = inject(OrbitNotifyService);

  async save(): Promise<void> {
    this.notify.success('Draft saved');

    const decision = await this.notify.confirm({
      title: 'Publish changes?',
      message: 'This step is visible to your team.'
    });

    if (decision === 'confirm') {
      // Perform your own business action here.
    }
  }
}
```

## Related packages

- `@ng-orbit/notify-render-plain` for the ready semantic notification shell
- `@ng-orbit/table` for headless server-driven table state
- `@ng-orbit/wizard` for headless multi-step flow state

## Docs links

- Local overview: `http://127.0.0.1:4200/notify/overview`
- Local renderer docs: `http://127.0.0.1:4200/notify/renders/plain`
- Online overview: `https://christianrm-dev.github.io/ng-orbit/notify/overview`
- Online renderer docs: `https://christianrm-dev.github.io/ng-orbit/notify/renders/plain`
