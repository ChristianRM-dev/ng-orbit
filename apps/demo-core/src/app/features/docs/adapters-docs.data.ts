import { TableDocsPreviewComponent } from '../table/table-docs-preview.component';
import { WizardDocsPreviewComponent } from '../wizard/wizard-docs-preview.component';
import type { DocsFeatureDefinition } from './docs.models';

export const ADAPTERS_DOCS: DocsFeatureDefinition = {
  id: 'adapters',
  routePath: 'adapters',
  title: 'Adapters',
  heroEyebrow: 'Adapters guide',
  heroBlocks: [
    {
      title: 'Principles',
      code: snippet(`
Keep the adapter thin.
Read state from the headless controller.
Call only controller commands from UI events.
Leave data fetching, forms, and side effects to the consumer.
`),
      language: 'text',
      copyable: false
    },
    {
      title: 'Package map',
      code: snippet(`
@ng-orbit/table -> headless table controller
@ng-orbit/wizard -> headless wizard controller
@ng-orbit/wizard-kit -> optional form-sync bridge
@ng-orbit/table-render-plain -> ready semantic table renderer
@ng-orbit/table-render-material and table-render-daisy -> ready table renderers
@ng-orbit/wizard-render-material and wizard-render-daisy -> ready wizard renderers
`),
      language: 'text',
      copyable: false
    }
  ],
  summary:
    'Adapters are the thin integration layer between ng-orbit headless controllers and your product UI, and ng-orbit already ships ready-to-install Material and Daisy options for teams that want a faster adoption path.',
  tagline:
    'The contract stays the same: controllers own state and commands, adapters translate that state into UI, and the consumer keeps business logic, data, and forms whether the UI is custom or installed from a renderer package.',
  quickstartTitle: 'Adapter skeleton',
  quickstartLanguage: 'markup',
  quickstartSnippet: snippet(`
<section
  orbitTable
  #table="orbitTable"
  [rows]="rows()"
  [columns]="columns"
  [total]="total()"
  [loading]="loading()"
  [error]="error()"
  [query]="query()"
  [getRowId]="getRowId"
  (orbitTableQueryChange)="onQueryChange($event)"
>
  <product-data-grid
    [rows]="table.rows()"
    [loading]="table.loading()"
    [canNextPage]="table.canNextPage()"
    (searchChange)="table.setSearch($event)"
    (sortChange)="table.toggleSort($event.columnId)"
    (pageChange)="table.setPage($event)"
  />
</section>
`),
  overviewCodeSectionTitle: 'Ready to install',
  overviewCodeSectionLead:
    'These renderer packages are already available today, so consumers can start quickly and still keep the controller contract swappable later.',
  overviewCodeBlocks: [
    {
      title: 'Table + Material',
      code: snippet(`
pnpm add @ng-orbit/table @ng-orbit/table-render-material
`),
      language: 'bash'
    },
    {
      title: 'Table + Daisy',
      code: snippet(`
pnpm add @ng-orbit/table @ng-orbit/table-render-daisy
`),
      language: 'bash'
    },
    {
      title: 'Wizard + Material',
      code: snippet(`
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-material
`),
      language: 'bash'
    },
    {
      title: 'Wizard + Daisy',
      code: snippet(`
pnpm add @ng-orbit/wizard @ng-orbit/wizard-kit @ng-orbit/wizard-render-daisy
`),
      language: 'bash'
    }
  ],
  overviewSections: [
    {
      title: 'What adapters mean in ng-orbit',
      body:
        'An adapter is the UI-facing layer that reads controller state, maps it into your design system, and sends user intent back through controller commands.',
      points: [
        'Adapters can be as small as a custom template around exportAs controllers.',
        'Ready-to-install Material and Daisy renderer packages are one adapter flavor already available today.',
        'The headless controller remains the only source of truth for UI state.'
      ]
    },
    {
      title: 'When to build one',
      body:
        'Build a custom adapter when your product already has opinionated UI primitives, layout rules, analytics hooks, or accessibility patterns that generic renderers should not own.',
      points: [
        'Use a thin wrapper around your own table, cards, step nav, or footer actions.',
        'Keep the adapter reusable inside your product surface, not inside the core package.',
        'Reach for the ready-to-install Material or Daisy packages when speed matters more than bespoke UI control.'
      ]
    },
    {
      title: 'Where kits and renderers fit',
      body:
        'Kits help you compose product-owned UI without giving up the contract. Renderers package more UI upfront, but they should still stay presentation-only.',
      points: [
        'wizard-kit is the current public bridge for form-backed wizard steps.',
        'Table and wizard already have installable Material and Daisy renderer packages.',
        'table-kit and wizard-render-plain still exist only as repo placeholders.',
        'Renderers remain optional and should not fetch data or own submission rules.',
        'The same ownership rules apply whether the adapter is custom, kit-assisted, or full-renderer.'
      ]
    }
  ],
  apiSummary:
    'This page documents the integration contract behind adapters: what you read from controllers, what you send back through commands, and which responsibilities must stay outside the adapter layer.',
  apiGroups: [
    {
      id: 'entrypoints',
      title: 'Core entry points',
      description: 'Adapters always start from the public headless surface.',
      entries: [
        {
          name: 'OrbitTableDirective',
          signature: `import { OrbitTableDirective } from '@ng-orbit/table';`,
          description:
            'Expose the table controller as exportAs="orbitTable" and read rows, query, selection, and command helpers from it.'
        },
        {
          name: 'OrbitWizardDirective',
          signature: `import { OrbitWizardDirective } from '@ng-orbit/wizard';`,
          description:
            'Expose the wizard controller as exportAs="orbitWizard" and build your own step nav, progress UI, and footer actions around it.'
        },
        {
          name: 'OrbitWizardStepFormSyncDirective',
          signature: `import { OrbitWizardStepFormSyncDirective } from '@ng-orbit/wizard-kit';`,
          description:
            'Optional helper for form-backed wizard adapters when Angular forms should drive controller validity.'
        }
      ]
    },
    {
      id: 'read-model',
      title: 'Read model',
      description: 'Adapters read normalized controller state and map it into product UI props.',
      entries: [
        {
          name: 'Table state',
          signature:
            'rows(), columns(), query(), selection(), total(), loading(), error(), canPrevPage(), canNextPage()',
          description:
            'Use these signals to drive grids, cards, filters, pagination controls, and selected-state visuals.'
        },
        {
          name: 'Wizard state',
          signature:
            'steps(), current(), visited(), validity(), progress(), canPrev(), canNext(), canGoTo(stepId)',
          description:
            'Use these signals to render step chips, summaries, progress bars, and button disabled states.'
        }
      ]
    },
    {
      id: 'write-model',
      title: 'Commands and events',
      description: 'Adapters send user intent into the controller and let the consumer react to emitted events.',
      entries: [
        {
          name: 'Table commands and outputs',
          signature:
            'toggleSort(), setSearch(), setPage(), setPageSize(), toggleRow(), orbitTableQueryChange, orbitTableSelectionChange',
          description:
            'Use commands for user interaction and let the parent feature layer react to normalized query or selection outputs.'
        },
        {
          name: 'Wizard commands and outputs',
          signature:
            'next(), prev(), goTo(), setValid(), stepChange, completed',
          description:
            'Adapters trigger navigation and validity changes while the consumer decides what completion actually does.'
        }
      ]
    },
    {
      id: 'ownership',
      title: 'Ownership boundaries',
      description: 'A healthy adapter is presentation-focused and easy to swap.',
      entries: [
        {
          name: 'What the adapter owns',
          description:
            'Mapping controller state into product components, translating UI events into controller commands, and packaging reusable visual composition for the host app.',
          details: [
            'Layout, spacing, classes, and product-specific UI primitives belong here.',
            'Adapter code may normalize product event shapes before calling controller commands.'
          ]
        },
        {
          name: 'What stays outside',
          description:
            'Data fetching, backend query mapping, form ownership, submission side effects, analytics, and business validation rules stay in the consuming feature layer.',
          details: [
            'Do not hide API calls inside the adapter.',
            'Do not move wizard submission or table filtering business rules into the UI package.'
          ]
        }
      ]
    }
  ],
  renders: [
    {
      id: 'custom-markup',
      label: 'Headless custom markup',
      metaLabel: 'No extra package required',
      badgeText: 'Pattern',
      summary: 'Read controller state directly and render product-owned HTML or UI primitives.',
      description:
        'This is the most flexible adapter style. It works well when your app already has a design system and you want ng-orbit to stay behind the scenes as the state contract.',
      requirements: [
        'Use the headless directive directly in the feature or adapter component.',
        'Map clicks, searches, paging, and step navigation to controller commands only.'
      ],
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'custom' }
      },
      snippetTitle: 'Custom table adapter using orbitTable',
      snippetLanguage: 'markup',
      snippet: snippet(`
<section
  orbitTable
  #table="orbitTable"
  [rows]="rows()"
  [columns]="columns"
  [total]="total()"
  [loading]="loading()"
  [error]="error()"
  [query]="query()"
  [getRowId]="getRowId"
  (orbitTableQueryChange)="onQueryChange($event)"
>
  @for (row of table.rows(); track row.id) {
    <article class="user-card">
      <strong>{{ row.fullName }}</strong>
      <span>{{ row.email }}</span>
      <button type="button" (click)="table.toggleRow(row)">
        {{ table.isRowSelected(row) ? 'Unselect' : 'Select' }}
      </button>
    </article>
  }
</section>
`)
    },
    {
      id: 'kit-composition',
      label: 'Kit-assisted composition',
      packageName: '@ng-orbit/wizard-kit',
      metaLabel: 'Optional helper package',
      badgeText: 'Optional helper',
      summary: 'Add helper primitives when they reduce repeated wiring but keep layout and styling product-owned.',
      description:
        'wizard-kit is the current public example of this pattern. It bridges Angular form validity into orbitWizard while your adapter still controls markup, order, and interaction design.',
      requirements: [
        'Keep the final layout in your app or adapter component.',
        'Use kit directives only as composition helpers, not as a new source of business logic.'
      ],
      preview: {
        kind: 'component',
        component: WizardDocsPreviewComponent,
        inputs: { variant: 'multi-step' }
      },
      snippetTitle: 'Kit-assisted wizard composition',
      snippetLanguage: 'markup',
      snippet: snippet(`
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <form
    [formGroup]="accountForm"
    [orbitWizardStepFormSync]="wizard"
    orbitWizardStepId="account"
    [orbitWizardStepForm]="accountForm"
  >
    <app-form-field label="Full name">
      <input type="text" formControlName="fullName" />
    </app-form-field>
  </form>

  <app-wizard-footer
    [canPrev]="wizard.canPrev()"
    [canNext]="wizard.canNext()"
    (prev)="wizard.prev()"
    (next)="wizard.next()"
  />
</section>
`)
    },
    {
      id: 'full-renderer',
      label: 'Ready-to-install renderer adapters',
      metaLabel: '@ng-orbit/table-render-* and @ng-orbit/wizard-render-*',
      badgeText: 'Ready to install',
      summary:
        'Use the installable Material and Daisy renderer packages when you want a fast adoption path without building the first adapter yourself.',
      description:
        'These packages already exist for table and wizard. They still depend on the same controller contract, but they package the first UI layer for teams that want to install and integrate quickly.',
      requirements: [
        'Table: @ng-orbit/table-render-material and @ng-orbit/table-render-daisy.',
        'Wizard: @ng-orbit/wizard-render-material and @ng-orbit/wizard-render-daisy, plus @ng-orbit/wizard-kit for form sync.',
        'Treat every renderer as a presentation layer only and keep the same controller wiring so it remains swappable.'
      ],
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'renderer-swap' }
      },
      snippetTitle: 'Installable renderer packages',
      snippetLanguage: 'markup',
      snippet: snippet(`
<section
  orbitTable
  #table="orbitTable"
  [rows]="rows()"
  [columns]="columns"
  [total]="total()"
  [loading]="loading()"
  [error]="error()"
  [query]="query()"
  [getRowId]="getRowId"
  (orbitTableQueryChange)="onQueryChange($event)"
>
  <orbit-table-render-material [table]="table" />
</section>

// The same pattern applies to wizard renderers:
// bind the headless controller, project consumer-owned content, keep side effects outside.
`)
    }
  ],
  examples: [
    {
      id: 'table-custom-markup',
      label: 'Table custom UI',
      title: 'Custom table markup on top of orbitTable',
      description:
        'Use the headless controller as the source of truth while your adapter renders cards, rows, or any product-owned table surface.',
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'custom' }
      },
      snippetTitle: 'Table custom adapter example',
      snippet: snippet(`
<div class="toolbar">
  <input
    type="search"
    [value]="table.query().search"
    (input)="table.setSearch(($event.target as HTMLInputElement).value)"
  />
</div>

@for (row of table.rows(); track row.id) {
  <app-user-row
    [user]="row"
    [selected]="table.isRowSelected(row)"
    (toggleSelected)="table.toggleRow(row)"
  />
}
`),
      notes: [
        'This pattern works equally well with semantic tables, cards, or virtualized product components.'
      ]
    },
    {
      id: 'table-renderer-composition',
      label: 'Table renderer-style',
      title: 'Wrap a renderer-style adapter around the table contract',
      description:
        'A renderer-style adapter packages a ready-made visual layer but keeps the same rows, columns, query, and output contract that the parent already owns.',
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'renderer-swap' }
      },
      snippetTitle: 'Renderer-style table adapter',
      snippetLanguage: 'typescript',
      snippet: snippet(`
@Component({
  selector: 'app-users-table-adapter',
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderPlainComponent],
  template: \`
    <section
      orbitTable
      #table="orbitTable"
      [rows]="rows()"
      [columns]="columns"
      [total]="total()"
      [loading]="loading()"
      [error]="error()"
      [query]="query()"
      [getRowId]="getRowId"
      (orbitTableQueryChange)="queryChange.emit($event)"
    >
      <orbit-table-render-plain [table]="table" />
    </section>
  \`
})
export class UsersTableAdapterComponent {}
`),
      notes: [
        'You can start with a renderer package today and still replace it later with a custom adapter because the controller contract stays the same.'
      ]
    },
    {
      id: 'wizard-custom-layout',
      label: 'Wizard custom UI',
      title: 'Build a custom step layout on top of orbitWizard',
      description:
        'The adapter owns step chrome, progress visuals, and action placement while orbitWizard keeps navigation rules and completion behavior consistent.',
      preview: {
        kind: 'component',
        component: WizardDocsPreviewComponent,
        inputs: { variant: 'custom-render' }
      },
      snippetTitle: 'Custom wizard adapter example',
      snippetLanguage: 'markup',
      snippet: snippet(`
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <nav class="step-chips">
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

  <app-branded-footer
    [canPrev]="wizard.canPrev()"
    [canNext]="wizard.canNext()"
    (prev)="wizard.prev()"
    (next)="wizard.next()"
  />
</section>
`)
    },
    {
      id: 'wizard-form-sync',
      label: 'Wizard form sync',
      title: 'Bridge form validity with OrbitWizardStepFormSyncDirective',
      description:
        'When your adapter renders wizard forms, wizard-kit can push Angular form validity into the controller without moving submission logic into the UI layer.',
      preview: {
        kind: 'component',
        component: WizardDocsPreviewComponent,
        inputs: { variant: 'multi-step' }
      },
      snippetTitle: 'Wizard form sync integration',
      snippetLanguage: 'markup',
      snippet: snippet(`
<section orbitWizard #wizard="orbitWizard" [steps]="steps" (completed)="submit()">
  <form
    [formGroup]="accountForm"
    [orbitWizardStepFormSync]="wizard"
    orbitWizardStepId="account"
    [orbitWizardStepForm]="accountForm"
  >
    <input type="text" formControlName="fullName" />
    <input type="email" formControlName="email" />
  </form>

  <button type="button" [disabled]="!wizard.canNext()" (click)="wizard.next()">Next</button>
</section>
`),
      notes: [
        'Use wizard-kit only as a bridge. Submission, autosave, and analytics still belong to the consumer feature.'
      ]
    }
  ],
  tabLabels: {
    renders: 'Patterns'
  },
  tabRouteSegments: {
    renders: 'patterns'
  },
  renderSelectorLabel: 'Adapter patterns',
  renderPreviewDescription:
    'Each pattern keeps the same headless contract while changing how much UI the adapter packages.',
  exampleSelectorLabel: 'Integration scenarios',
  exampleEyebrow: 'Integration example',
  examplePreviewDescription:
    'Interact with the example and compare it with the adapter-oriented snippet below.'
};

function snippet(value: string): string {
  return value.trim();
}
