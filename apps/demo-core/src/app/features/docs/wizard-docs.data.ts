import { WizardDocsPreviewComponent } from '../wizard/wizard-docs-preview.component';
import type { DocsFeatureDefinition } from './docs.models';

export const WIZARD_DOCS: DocsFeatureDefinition = {
  id: 'wizard',
  routePath: 'wizard',
  title: 'Wizard',
  packageName: '@ng-orbit/wizard',
  summary:
    'A headless wizard controller for multi-step flows where the consumer keeps ownership of forms, layout, validation, and submission side effects.',
  tagline:
    'Use orbitWizard for navigation state and completion rules, then pair it with your own form UI or an optional renderer package.',
  installSnippetLanguage: 'bash',
  installSnippet: snippet(`
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit
`),
  importSnippetLanguage: 'typescript',
  importSnippet: snippet(`
import { OrbitWizardDirective, type OrbitWizardStepDef } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';
`),
  quickstartLanguage: 'typescript',
  quickstartSnippet: snippet(`
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrbitWizardDirective, type OrbitWizardStepDef } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, OrbitWizardDirective, OrbitWizardStepFormSyncDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
      <form
        [formGroup]="accountForm"
        [orbitWizardStepFormSync]="wizard"
        orbitWizardStepId="account"
        [orbitWizardStepForm]="accountForm"
      >
        <input type="text" formControlName="fullName" />
      </form>

      <button type="button" [disabled]="!wizard.canNext()" (click)="wizard.next()">
        {{ wizard.isLast() ? 'Finish' : 'Next' }}
      </button>
    </section>
  \`
})
export class SignupWizardComponent {
  constructor(private readonly formBuilder: FormBuilder) {}

  readonly steps: readonly OrbitWizardStepDef[] = [
    { id: 'account', title: 'Account' },
    { id: 'summary', title: 'Summary', kind: 'summary' }
  ];

  readonly accountForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]]
  });

  submit(): void {
    // Persist data here. The controller only emits completion.
  }
}
`),
  overviewSections: [
    {
      title: 'Mental model',
      body:
        'OrbitWizard owns navigation state, visited steps, completion rules, and validity tracking. The consumer owns forms, fields, and actual side effects.',
      points: [
        'No CSS or design-system assumptions in the core package.',
        'No form generation or field ownership.',
        'Optional renderers stay focused on UI composition.'
      ]
    },
    {
      title: 'What the consumer owns',
      body:
        'You decide how each step is rendered, when data is saved, and which validations should block moving forward.',
      points: [
        'Provide step definitions.',
        'Sync form validity into the controller.',
        'Handle submit, autosave, analytics, and route guards at the app level.'
      ]
    },
    {
      title: 'Why the kit matters',
      body:
        'Wizard examples often rely on OrbitWizardStepFormSyncDirective because it keeps reactive form validity aligned with the headless controller.',
      points: [
        'The directive is optional but useful for form-backed steps.',
        'You can still call wizard.setValid(stepId, valid) manually if you prefer.',
        'Renderers never own your submission rules.'
      ]
    }
  ],
  apiSummary:
    'The wizard API centers on one directive, a step definition model, and a command surface for moving between steps while keeping the workflow linear by default.',
  apiGroups: [
    {
      id: 'imports',
      title: 'Imports',
      description: 'The core directive is enough for custom UI. Add wizard-kit or a renderer only when you want helpers.',
      entries: [
        {
          name: 'OrbitWizardDirective',
          signature: `import { OrbitWizardDirective } from '@ng-orbit/wizard';`,
          description: 'Standalone directive exposed as exportAs="orbitWizard".'
        },
        {
          name: 'OrbitWizardStepFormSyncDirective',
          signature: `import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';`,
          description: 'Optional helper to push Angular form validity into the wizard controller.'
        }
      ]
    },
    {
      id: 'inputs',
      title: 'Inputs',
      description: 'Wizard inputs define navigation constraints, not field UI.',
      entries: [
        {
          name: 'steps',
          signature: `steps: readonly OrbitWizardStepDef[]`,
          description: 'Required list of steps, including optional summary and disabled flags.'
        },
        {
          name: 'initialStepId',
          signature: `initialStepId?: string`,
          description: 'Optional initial step id. Falls back to the first enabled step.'
        },
        {
          name: 'linear',
          signature: `linear?: boolean`,
          description: 'Defaults to true and prevents jumping to unvisited future steps.'
        }
      ]
    },
    {
      id: 'outputs',
      title: 'Outputs and events',
      description: 'Use events to react to navigation or completion at the feature layer.',
      entries: [
        {
          name: 'stepChange',
          signature: `stepChange: { fromId: string; toId: string }`,
          description: 'Emits when navigation changes the current step.'
        },
        {
          name: 'completed',
          signature: `completed: void`,
          description: 'Emits when next() is triggered from the last enabled step.'
        }
      ]
    },
    {
      id: 'signals',
      title: 'Signals',
      description: 'Signals expose the current step model and derived navigation state.',
      entries: [
        {
          name: 'steps / current / index',
          signature: `steps(), current(), index()`,
          description: 'Read the normalized step collection and current pointer.'
        },
        {
          name: 'visited / validity / progress',
          signature: `visited(), validity(), progress()`,
          description: 'Track which steps were visited and which ones are currently valid.'
        },
        {
          name: 'canPrev / canNext / canGoTo',
          signature: `canPrev(), canNext(), canGoTo(stepId: string)`,
          description: 'Derived helpers for nav buttons and step chips.'
        }
      ]
    },
    {
      id: 'commands',
      title: 'Commands',
      description: 'Commands are intentionally small and workflow-oriented.',
      entries: [
        {
          name: 'next / prev',
          signature: `next(), prev()`,
          description: 'Move through enabled steps and emit completed on the last step.'
        },
        {
          name: 'goTo / goToIndex / reset',
          signature: `goTo(stepId: string), goToIndex(index: number), reset()`,
          description: 'Navigate explicitly or reset the controller to its initial step.'
        },
        {
          name: 'setValid',
          signature: `setValid(stepId: string, valid: boolean)`,
          description: 'Push validity from forms or custom validation logic into the controller.'
        }
      ]
    },
    {
      id: 'types',
      title: 'Types',
      description: 'These types show up in nearly every consumer integration.',
      entries: [
        {
          name: 'OrbitWizardStepDef',
          signature: `interface OrbitWizardStepDef { id: string; title?: string; kind?: 'step' | 'summary'; optional?: boolean; disabled?: boolean; showInNav?: boolean; }`,
          description: 'Step input contract used by the directive.'
        },
        {
          name: 'OrbitWizardProgress',
          signature: `interface OrbitWizardProgress { total: number; visited: number; valid: number; completed: number; percent: number; }`,
          description: 'Derived progress state available through progress().'
        },
        {
          name: 'OrbitWizardStepChangeEvent',
          signature: `interface OrbitWizardStepChangeEvent { fromId: string; toId: string; }`,
          description: 'Event payload emitted by stepChange.'
        }
      ]
    }
  ],
  renders: [
    {
      id: 'material',
      label: 'Material',
      packageName: '@ng-orbit/wizard-render-material',
      summary: 'Renderer package for Angular Material teams that want a fast adoption path.',
      description:
        'The renderer maps orbitWizard state to Material navigation components while the consumer still owns forms, step markup, and completion side effects.',
      requirements: [
        'Install Angular Material in the consuming app.',
        'Provide your own step forms and sync validity through wizard-kit or manual setValid calls.'
      ],
      preview: {
        kind: 'iframe',
        remoteName: 'demo-material',
        remotePath: 'wizard/material',
        renderer: 'material',
        frameHeight: '700px'
      },
      snippetTitle: 'Material renderer integration',
      snippetLanguage: 'typescript',
      snippet: snippet(`
import { ReactiveFormsModule } from '@angular/forms';
import { OrbitWizardDirective } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';
import { OrbitWizardRenderMaterialComponent } from '@ng-orbit/wizard-render-material';

<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <orbit-wizard-render-material [wizard]="wizard">
    <form
      [formGroup]="accountForm"
      [orbitWizardStepFormSync]="wizard"
      orbitWizardStepId="account"
      [orbitWizardStepForm]="accountForm"
    >
      <!-- consumer-owned fields -->
    </form>
  </orbit-wizard-render-material>
</section>
`)
    },
    {
      id: 'daisy',
      label: 'Daisy',
      packageName: '@ng-orbit/wizard-render-daisy',
      summary: 'Renderer package for DaisyUI and Tailwind-based product surfaces.',
      description:
        'Use the Daisy renderer when the consuming product already has DaisyUI tokens and wants a quick first integration without designing step navigation from scratch.',
      requirements: [
        'Install Tailwind + DaisyUI in the consuming app.',
        'Keep forms and submission handlers in your own feature component.'
      ],
      preview: {
        kind: 'iframe',
        remoteName: 'demo-daisy',
        remotePath: 'wizard/daisy',
        renderer: 'daisy',
        frameHeight: '700px'
      },
      snippetTitle: 'Daisy renderer integration',
      snippetLanguage: 'typescript',
      snippet: snippet(`
import { ReactiveFormsModule } from '@angular/forms';
import { OrbitWizardDirective } from '@ng-orbit/wizard';
import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';
import { OrbitWizardRenderDaisyComponent } from '@ng-orbit/wizard-render-daisy';

<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <orbit-wizard-render-daisy [wizard]="wizard">
    <form
      [formGroup]="detailsForm"
      [orbitWizardStepFormSync]="wizard"
      orbitWizardStepId="details"
      [orbitWizardStepForm]="detailsForm"
    >
      <!-- consumer-owned fields -->
    </form>
  </orbit-wizard-render-daisy>
</section>
`)
    },
    {
      id: 'custom',
      label: 'Build your own',
      packageName: '@ng-orbit/wizard',
      summary: 'Render your own step UI while orbitWizard keeps navigation state honest.',
      description:
        'This is the recommended path when your product has a branded flow, custom progress UI, or layout rules that generic renderers should not dictate.',
      requirements: [
        'Use OrbitWizardDirective directly in your component.',
        'Sync validity with wizard-kit or by calling wizard.setValid(stepId, valid).'
      ],
      preview: {
        kind: 'component',
        component: WizardDocsPreviewComponent,
        inputs: { variant: 'custom-render' }
      },
      snippetTitle: 'Consumer-owned wizard layout',
      snippetLanguage: 'markup',
      snippet: snippet(`
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <nav>
    @for (step of wizard.steps(); track step.id) {
      <button
        type="button"
        [disabled]="wizard.current().id !== step.id && !wizard.canGoTo(step.id)"
        (click)="wizard.goTo(step.id)"
      >
        {{ step.title }}
      </button>
    }
  </nav>

  <button type="button" [disabled]="!wizard.canPrev()" (click)="wizard.prev()">Back</button>
  <button type="button" [disabled]="!wizard.canNext()" (click)="wizard.next()">
    {{ wizard.isLast() ? 'Finish' : 'Next' }}
  </button>
</section>
`)
    }
  ],
  examples: [
    {
      id: 'multi-step-form',
      label: 'Multi-step',
      title: 'Multi-step form with custom markup',
      description:
        'A consumer-owned layout can still rely on orbitWizard for step progress, navigation guards, and completion events.',
      preview: {
        kind: 'component',
        component: WizardDocsPreviewComponent,
        inputs: { variant: 'multi-step' }
      },
      snippetTitle: 'Multi-step wizard',
      snippetLanguage: 'typescript',
      snippet: snippet(`
readonly steps: readonly OrbitWizardStepDef[] = [
  { id: 'account', title: 'Account' },
  { id: 'details', title: 'Details' },
  { id: 'summary', title: 'Summary', kind: 'summary' }
];

<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <!-- custom step nav -->
  <button type="button" [disabled]="!wizard.canPrev()" (click)="wizard.prev()">Back</button>
  <button type="button" [disabled]="!wizard.canNext()" (click)="wizard.next()">Next</button>
</section>
`)
    },
    {
      id: 'conditional-company-step',
      label: 'Conditional step',
      title: 'Conditionally insert the company step',
      description:
        'Step lists can change as the user edits the form. The controller keeps the nearest valid step selected and prunes stale state.',
      preview: {
        kind: 'component',
        component: WizardDocsPreviewComponent,
        inputs: { variant: 'conditional' }
      },
      snippetTitle: 'Conditional step definition',
      snippetLanguage: 'typescript',
      snippet: snippet(`
readonly steps = computed<readonly OrbitWizardStepDef[]>(() => {
  const steps: OrbitWizardStepDef[] = [{ id: 'account', title: 'Account type' }];

  if (this.accountForm.controls.accountType.value === 'business') {
    steps.push({ id: 'company', title: 'Company' });
  }

  steps.push(
    { id: 'details', title: 'Details' },
    { id: 'summary', title: 'Summary', kind: 'summary' }
  );

  return steps;
});
`),
      notes: ['The controller preserves navigation stability even when the step array changes.']
    },
    {
      id: 'single-step-mode',
      label: 'Single-step',
      title: 'Single-step mode using the same controller',
      description:
        'A one-step flow can still reuse orbitWizard if you want the same completion event, validity model, and future extensibility.',
      preview: {
        kind: 'component',
        component: WizardDocsPreviewComponent,
        inputs: { variant: 'single-step' }
      },
      snippetTitle: 'Single-step setup',
      snippetLanguage: 'typescript',
      snippet: snippet(`
readonly steps: readonly OrbitWizardStepDef[] = [
  { id: 'single', title: 'Profile' }
];

<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <form
    [formGroup]="singleForm"
    [orbitWizardStepFormSync]="wizard"
    orbitWizardStepId="single"
    [orbitWizardStepForm]="singleForm"
  >
    <!-- fields -->
  </form>
</section>
`)
    },
    {
      id: 'renderer-integration',
      label: 'Renderer integration',
      title: 'Integrate a renderer with OrbitWizardStepFormSyncDirective',
      description:
        'This keeps validity in your form layer while the renderer only consumes the controller and projects your step content.',
      preview: {
        kind: 'iframe',
        remoteName: 'demo-material',
        remotePath: 'wizard/material',
        renderer: 'material',
        frameHeight: '700px'
      },
      snippetTitle: 'Renderer + wizard-kit integration',
      snippetLanguage: 'markup',
      snippet: snippet(`
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <orbit-wizard-render-material [wizard]="wizard">
    <form
      [formGroup]="accountForm"
      [orbitWizardStepFormSync]="wizard"
      orbitWizardStepId="account"
      [orbitWizardStepForm]="accountForm"
    >
      <input type="text" formControlName="fullName" />
      <input type="email" formControlName="email" />
    </form>
  </orbit-wizard-render-material>
</section>
`),
      notes: ['Use wizard-kit only as a bridge. The renderer still should not own your business logic.']
    }
  ]
};

function snippet(value: string): string {
  return value.trim();
}
