import { NotifyDocsPreviewComponent } from '../notify/notify-docs-preview.component';
import type { DocsFeatureDefinition } from './docs.models';

export const NOTIFY_DOCS: DocsFeatureDefinition = {
  id: 'notify',
  routePath: 'notify',
  title: 'Notify',
  packageName: '@ng-orbit/notify',
  summary:
    'A headless notification service for Angular apps that want fast toasts, confirms, and blocking prompts while keeping side effects in the feature layer.',
  tagline:
    'Provide the service once, mount the renderer once, and let features call `show`, `success`, `openBlocking`, or `confirm` without wiring UI every time.',
  installSnippetLanguage: 'bash',
  installSnippet: snippet(`
pnpm add @ng-orbit/notify @ng-orbit/notify-render-plain
`),
  importSnippetLanguage: 'typescript',
  importSnippet: snippet(`
import { OrbitNotifyService, provideOrbitNotify } from '@ng-orbit/notify';
import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';
`),
  quickstartLanguage: 'typescript',
  quickstartSnippet: snippet(`
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrbitNotifyService, provideOrbitNotify } from '@ng-orbit/notify';
import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';

@Component({
  standalone: true,
  imports: [OrbitNotifyRenderPlainComponent],
  providers: [provideOrbitNotify()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button type="button" (click)="save()">Save draft</button>
    <orbit-notify-render-plain />
  \`
})
export class SaveDraftButtonComponent {
  private readonly notify = inject(OrbitNotifyService);

  async save(): Promise<void> {
    this.notify.success('Draft saved');

    const decision = await this.notify.confirm({
      title: 'Publish changes?',
      message: 'This confirm resolves to confirm or cancel.'
    });

    if (decision === 'confirm') {
      // Keep business work in your feature layer.
    }
  }
}
`),
  overviewSections: [
    {
      title: 'Mental model',
      body:
        'OrbitNotify owns queueing, defaults, and timer behavior. Your app still decides when a notification should appear and what a chosen action actually does.',
      points: [
        'Toasts are non-blocking and stack with per-tone defaults.',
        'Blocking notifications resolve action ids through a FIFO queue.',
        'The service stays headless so the renderer shell can change later.'
      ]
    },
    {
      title: 'What the consumer owns',
      body:
        'The feature layer still owns copy strategy, analytics, retries, publish actions, deletes, or any other business side effect triggered after a result resolves.',
      points: [
        'Call notify methods from your own components, facades, or effects.',
        'Await blocking results and branch in app code.',
        'Override defaults only where product behavior genuinely differs.'
      ]
    },
    {
      title: 'DX defaults',
      body:
        'The default setup is intentionally fast: mount one renderer, call one service, and only drop into config when the app truly needs a different policy.',
      points: [
        'Toast stack limit defaults to 3 and position defaults to top-end.',
        'Tone defaults control durations automatically.',
        'Blocking prompts do not close on Escape or backdrop unless you opt in.'
      ]
    }
  ],
  apiSummary:
    'The public API centers on one provider, one service, and small text-first models for toasts, actions, and blocking prompts.',
  apiGroups: [
    {
      id: 'setup',
      title: 'Setup',
      description: 'Provide the service once and mount a renderer once.',
      entries: [
        {
          name: 'provideOrbitNotify',
          signature: `provideOrbitNotify(config?: Partial<OrbitNotifyConfig>)`,
          description: 'Provides OrbitNotifyService and injector-scoped defaults for the current app or feature tree.'
        },
        {
          name: 'OrbitNotifyRenderPlainComponent',
          signature: `import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';`,
          description: 'Reference renderer that reads the service signals and mounts the toast stack plus blocking shell.'
        }
      ]
    },
    {
      id: 'methods',
      title: 'Service methods',
      description: 'These are the methods most consumers call directly.',
      entries: [
        {
          name: 'show / success / info / warning / error',
          signature: `show(input), success(input), info(input), warning(input), error(input)`,
          description: 'Open non-blocking toasts with per-call overrides and a close result promise.'
        },
        {
          name: 'openBlocking / confirm',
          signature: `openBlocking(options): Promise<string>, confirm(input): Promise<'confirm' | 'cancel'>`,
          description: 'Queue blocking prompts and resolve the selected action id back to the feature layer.'
        },
        {
          name: 'dismissToast / clearToasts',
          signature: `dismissToast(id: string), clearToasts()`,
          description: 'Manual queue controls for close buttons, route cleanup, or test utilities.'
        }
      ]
    },
    {
      id: 'renderer-state',
      title: 'Renderer-facing state',
      description: 'Renderers only need the visible stack and the current blocking item.',
      entries: [
        {
          name: 'toasts / activeBlocking',
          signature: `toasts(), activeBlocking()`,
          description: 'Signals that expose the visible toast stack and the current blocking prompt.'
        },
        {
          name: 'pauseToast / resumeToast / triggerToastAction',
          signature: `pauseToast(id), resumeToast(id), triggerToastAction(id)`,
          description: 'Renderer helpers for hover/focus pause behavior and toast action buttons.'
        },
        {
          name: 'runBlockingAction / dismissBlocking',
          signature: `runBlockingAction(actionId), dismissBlocking(trigger)`,
          description: 'Renderer helpers for footer buttons, Escape, and optional backdrop dismissal.'
        }
      ]
    },
    {
      id: 'types',
      title: 'Types',
      description: 'These are the main models used by both consumers and renderers.',
      entries: [
        {
          name: 'OrbitToastOptions / OrbitToast',
          signature: `interface OrbitToastOptions { message: string; tone?: OrbitNotifyTone; ... }`,
          description: 'Text-first toast input plus the normalized state exposed to renderers.'
        },
        {
          name: 'OrbitBlockingOptions / OrbitBlockingNotification',
          signature: `interface OrbitBlockingOptions { title: string; actions: readonly OrbitNotifyAction[]; ... }`,
          description: 'Blocking input and the normalized queue item rendered by the modal shell.'
        },
        {
          name: 'OrbitNotifyConfig',
          signature: `interface OrbitNotifyConfig { toast?: Partial<...>; blocking?: Partial<...>; }`,
          description: 'Global defaults for stack size, positions, durations, and blocking behavior.'
        }
      ]
    }
  ],
  renders: [
    {
      id: 'plain',
      label: 'Plain',
      packageName: '@ng-orbit/notify-render-plain',
      summary: 'Reference semantic renderer for both the toast stack and the blocking shell.',
      description:
        'Use this renderer when you want notifications working quickly, or when your team wants a clear baseline to fork later into product-owned markup.',
      requirements: [
        'Provide OrbitNotifyService with provideOrbitNotify(...) in the current injector tree.',
        'Mount the renderer once near app root so features can call the service from anywhere.'
      ],
      preview: {
        kind: 'component',
        component: NotifyDocsPreviewComponent,
        inputs: { variant: 'plain' }
      },
      snippetTitle: 'App root integration',
      snippetLanguage: 'typescript',
      snippet: snippet(`
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideOrbitNotify } from '@ng-orbit/notify';
import { OrbitNotifyRenderPlainComponent } from '@ng-orbit/notify-render-plain';

@Component({
  standalone: true,
  imports: [OrbitNotifyRenderPlainComponent],
  providers: [provideOrbitNotify()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <router-outlet />
    <orbit-notify-render-plain />
  \`
})
export class AppShellComponent {}
`)
    }
  ],
  examples: [
    {
      id: 'success-toast',
      label: 'Success toast',
      title: 'Fire a toast with default success timing',
      description: 'This is the fast path: no manual duration or position config, just a success call and an optional close result.',
      preview: {
        kind: 'component',
        component: NotifyDocsPreviewComponent,
        inputs: { variant: 'success-toast' }
      },
      snippetTitle: 'Success toast',
      snippetLanguage: 'typescript',
      snippet: snippet(`
const toastRef = notify.success({
  title: 'Saved',
  message: 'Draft saved successfully.'
});

const result = await toastRef.closed;
`)
    },
    {
      id: 'toast-action',
      label: 'Undo action',
      title: 'Add one quick action to a non-blocking toast',
      description: 'Useful for Undo, Retry, or Restore flows that should stay lightweight.',
      preview: {
        kind: 'component',
        component: NotifyDocsPreviewComponent,
        inputs: { variant: 'toast-action' }
      },
      snippetTitle: 'Toast with action',
      snippetLanguage: 'typescript',
      snippet: snippet(`
const toastRef = notify.show({
  title: 'Draft saved',
  message: 'Need to undo the last change?',
  tone: 'info',
  action: { id: 'undo', label: 'Undo' }
});

const result = await toastRef.closed;
`)
    },
    {
      id: 'blocking-multi',
      label: 'Blocking multi-action',
      title: 'Resolve the chosen action id from a blocking prompt',
      description: 'Blocking notifications can expose more than confirm/cancel while keeping the result simple.',
      preview: {
        kind: 'component',
        component: NotifyDocsPreviewComponent,
        inputs: { variant: 'blocking-multi' }
      },
      snippetTitle: 'Blocking prompt',
      snippetLanguage: 'typescript',
      snippet: snippet(`
const actionId = await notify.openBlocking({
  title: 'Review account changes',
  message: 'Choose what should happen before continuing.',
  tone: 'warning',
  actions: [
    { id: 'cancel', label: 'Keep editing', appearance: 'secondary' },
    { id: 'review', label: 'Send to review', appearance: 'primary' },
    { id: 'archive', label: 'Archive', appearance: 'danger' }
  ]
});
`)
    },
    {
      id: 'blocking-queue',
      label: 'Blocking queue',
      title: 'Queue blocking prompts in FIFO order',
      description: 'Only one blocking notification is visible at a time. The next one becomes active after the current prompt resolves.',
      preview: {
        kind: 'component',
        component: NotifyDocsPreviewComponent,
        inputs: { variant: 'blocking-queue' }
      },
      snippetTitle: 'Blocking queue',
      snippetLanguage: 'typescript',
      snippet: snippet(`
const first = notify.openBlocking({ title: 'First checkpoint', actions: [...] });
const second = notify.openBlocking({ title: 'Second checkpoint', actions: [...] });

const firstResult = await first;
const secondResult = await second;
`)
    }
  ]
};

function snippet(source: string): string {
  return source.trim();
}
