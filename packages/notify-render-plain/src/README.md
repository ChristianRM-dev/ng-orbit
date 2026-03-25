# @ng-orbit/notify-render-plain

Reference semantic renderer for `@ng-orbit/notify`.

## AI Quick Map

- Role: ready semantic renderer that mounts the toast stack and blocking shell for `OrbitNotifyService`
- Install: `pnpm add @ng-orbit/notify @ng-orbit/notify-render-plain`
- Pair with: `@ng-orbit/notify`
- Package owns: semantic notification markup, focusable toast actions, and blocking modal rendering
- Consumer owns: when notifications are triggered, what action results mean, and product styling choices beyond the reference shell
- Recommended path: mount this once near app root after `provideOrbitNotify()` and start calling the service from features

## What it is

`@ng-orbit/notify-render-plain` is the thinnest ready-to-install UI shell for the headless
notification service. It renders text-only toasts and blocking notifications with no design-system dependency.

## Install

```bash
pnpm add @ng-orbit/notify @ng-orbit/notify-render-plain
```

## Use this when

- you want app-wide notifications working quickly
- you need a readable semantic baseline to fork later
- you want confirms and multi-action prompts without committing to Material or DaisyUI yet

## Do not use this when

- you expect the renderer to perform business actions for you
- you need rich HTML, content projection, or custom templates in v1
- you already need a fully product-branded notification shell on day one

## Library owns

- fixed-position toast stacks grouped by position
- blocking modal markup and action buttons
- wiring hover/focus events into the headless pause/resume behavior

## Consumer owns

- calling `show`, `success`, `openBlocking`, or `confirm`
- reacting to toast and blocking results
- swapping the renderer later if the visual layer changes

## Primary exports

- `OrbitNotifyRenderPlainComponent` for the ready semantic notification shell

## Smallest working example

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitNotifyService, provideOrbitNotify } from '@ng-orbit/notify';
import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';

@Component({
  standalone: true,
  imports: [OrbitNotifyRenderPlainComponent],
  providers: [provideOrbitNotify()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" (click)="notify.success('Saved')">Show toast</button>
    <orbit-notify-render-plain />
  `
})
export class NotificationsExampleComponent {
  readonly notify = inject(OrbitNotifyService);
}
```

## Related packages

- `@ng-orbit/notify` for the headless notification service
- `@ng-orbit/table-render-plain` for the headless table reference renderer
- `@ng-orbit/wizard-render-material` for a renderer example in another UI surface

## Docs links

- Local renderer docs: `http://127.0.0.1:4200/notify/renders/plain`
- Local overview: `http://127.0.0.1:4200/notify/overview`
- Online renderer docs: `https://christianrm-dev.github.io/ng-orbit/notify/renders/plain`
- Online overview: `https://christianrm-dev.github.io/ng-orbit/notify/overview`
