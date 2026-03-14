import { TableDocsPreviewComponent } from '../table/table-docs-preview.component';
import type { DocsFeatureDefinition } from './docs.models';

export const TABLE_DOCS: DocsFeatureDefinition = {
  id: 'table',
  routePath: 'table',
  title: 'Table',
  packageName: '@ng-orbit/table',
  summary:
    'A headless table controller for Angular apps that want consumer-owned data fetching, selection, sorting intent, and markup.',
  tagline:
    'Use the directive as the stable contract, then plug in a renderer or your own templates without moving business logic into the visual layer.',
  installSnippet: snippet(`
pnpm add @ng-orbit/table @ng-orbit/table-render-plain
`),
  importSnippet: snippet(`
import { OrbitTableDirective, type OrbitTableQuery } from '@ng-orbit/table';
import { OrbitTableRenderPlainComponent } from '@ng-orbit/table-render-plain';
`),
  quickstartSnippet: snippet(`
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  OrbitTableDirective,
  createDefaultOrbitTableQuery,
  type OrbitTableColumn,
  type OrbitTableQuery
} from '@ng-orbit/table';
import { OrbitTableRenderPlainComponent } from '@ng-orbit/table-render-plain';

interface UserRow {
  id: number;
  fullName: string;
  email: string;
}

@Component({
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderPlainComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      (orbitTableQueryChange)="onQueryChange($event)"
    >
      <orbit-table-render-plain [table]="table" />
    </section>
  \`
})
export class UsersTableComponent {
  readonly query = signal(createDefaultOrbitTableQuery());
  readonly rows = signal<readonly UserRow[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal<unknown | null>(null);

  readonly columns: readonly OrbitTableColumn<UserRow>[] = [
    { id: 'fullName', header: 'Name', accessor: (row) => row.fullName, sortable: true },
    { id: 'email', header: 'Email', accessor: (row) => row.email, sortable: true }
  ];

  readonly getRowId = (row: UserRow) => row.id;

  onQueryChange(query: OrbitTableQuery): void {
    this.query.set(query);
    this.fetchUsers(query);
  }

  private fetchUsers(query: OrbitTableQuery): void {
    // Fetch data using your backend contract, then update rows/total/loading/error.
  }
}
`),
  overviewSections: [
    {
      title: 'Mental model',
      body:
        'OrbitTable manages query intent and selection state. The parent still owns the data source, server calls, and row updates.',
      points: [
        'No HTML table markup is shipped by the core package.',
        'No in-memory sorting, filtering, or pagination rules are enforced.',
        'Renderers stay thin because they only call controller commands.'
      ]
    },
    {
      title: 'What the consumer owns',
      body:
        'Your feature layer remains in charge of data fetching, query persistence, analytics, and empty or error states.',
      points: [
        'Translate OrbitTableQuery into backend params.',
        'Provide rows, total, loading, and error inputs.',
        'Choose between renderer packages or custom markup.'
      ]
    },
    {
      title: 'What the package does not do',
      body:
        'The table core is intentionally conservative so teams can plug it into very different design systems.',
      points: [
        'No data adapter layer or HTTP client opinion.',
        'No CSS, tokens, or design-system dependency.',
        'No business filtering or row action logic.'
      ]
    }
  ],
  apiSummary:
    'The public API is small on purpose: one standalone directive, a query model, selection state, and a command surface that renderers can call.',
  apiGroups: [
    {
      id: 'imports',
      title: 'Imports',
      description: 'Start with the controller. Add a renderer only if you want a prebuilt visual layer.',
      entries: [
        {
          name: 'OrbitTableDirective',
          signature: `import { OrbitTableDirective } from '@ng-orbit/table';`,
          description: 'Standalone directive exposed as exportAs="orbitTable".'
        },
        {
          name: 'OrbitTableRenderPlainComponent',
          signature: `import { OrbitTableRenderPlainComponent } from '@ng-orbit/table-render-plain';`,
          description: 'Reference renderer that maps controller state to semantic HTML.'
        }
      ]
    },
    {
      id: 'inputs',
      title: 'Inputs',
      description: 'All inputs are owned by the parent component.',
      entries: [
        {
          name: 'rows',
          signature: `rows: readonly T[]`,
          description: 'The current row slice you want the renderer to display.'
        },
        {
          name: 'columns',
          signature: `columns: readonly OrbitTableColumn<T>[]`,
          description: 'Column metadata, cell accessors, and optional templates.'
        },
        {
          name: 'total / loading / error',
          signature: `total: number, loading: boolean, error: unknown | null`,
          description: 'Server state remains external and is passed back into the controller.'
        },
        {
          name: 'query',
          signature: `query: OrbitTableQuery`,
          description: 'Current query intent, including page, pageSize, sort, search, and filters.'
        },
        {
          name: 'getRowId',
          signature: `getRowId: (row: T) => OrbitTableRowId`,
          description: 'Required row identity function used for selection state.'
        }
      ]
    },
    {
      id: 'outputs',
      title: 'Outputs and events',
      description: 'Use controller outputs to react in your feature layer.',
      entries: [
        {
          name: 'orbitTableQueryChange',
          signature: `orbitTableQueryChange: OrbitTableQuery`,
          description: 'Emits after commands such as sort, search, page, page size, or filters change.'
        },
        {
          name: 'orbitTableSelectionChange',
          signature: `orbitTableSelectionChange: OrbitTableSelectionState`,
          description: 'Emits when the set of selected row ids changes.'
        }
      ]
    },
    {
      id: 'signals',
      title: 'Signals',
      description: 'Signals mirror the latest normalized controller state.',
      entries: [
        {
          name: 'query / selection',
          signature: `query(), selection()`,
          description: 'Read the latest query and selection values inside custom markup.'
        },
        {
          name: 'rows / columns / total / loading / error',
          signature: `rows(), columns(), total(), loading(), error()`,
          description: 'Convenient read access for custom renderers and consumer-owned layouts.'
        },
        {
          name: 'canPrevPage / canNextPage',
          signature: `canPrevPage(), canNextPage()`,
          description: 'Derived pagination helpers for footer controls.'
        }
      ]
    },
    {
      id: 'commands',
      title: 'Commands',
      description: 'Commands change controller intent and emit normalized outputs.',
      entries: [
        {
          name: 'toggleSort / setSearch',
          signature: `toggleSort(columnId: string), setSearch(value: string)`,
          description: 'Update sort or search intent and reset page to 1.'
        },
        {
          name: 'setPage / setPageSize / setFilters',
          signature: `setPage(page: number), setPageSize(size: number), setFilters(filters: Record<string, unknown>)`,
          description: 'Move through server-driven result sets while keeping the query normalized.'
        },
        {
          name: 'toggleRow / clearSelection / isRowSelected',
          signature: `toggleRow(row: T), clearSelection(), isRowSelected(row: T)`,
          description: 'Selection helpers keyed by getRowId.'
        }
      ]
    },
    {
      id: 'types',
      title: 'Types',
      description: 'These are the consumer-facing models you will touch most often.',
      entries: [
        {
          name: 'OrbitTableQuery',
          signature: `interface OrbitTableQuery { page: number; pageSize: number; sort: OrbitTableSort | null; search: string; filters: Record<string, unknown>; }`,
          description: 'Canonical query intent emitted by the controller.'
        },
        {
          name: 'OrbitTableColumn<T>',
          signature: `interface OrbitTableColumn<T> { id: string; header: string | TemplateRef<...>; accessor?: (row: T) => unknown; property?: keyof T; sortable?: boolean; }`,
          description: 'Column contract for both renderers and custom markup.'
        },
        {
          name: 'OrbitTableSelectionState',
          signature: `interface OrbitTableSelectionState { mode: 'multi'; selected: ReadonlySet<OrbitTableRowId>; }`,
          description: 'Selection state emitted from the controller.'
        }
      ]
    }
  ],
  renders: [
    {
      id: 'plain',
      label: 'Plain',
      packageName: '@ng-orbit/table-render-plain',
      summary: 'Reference semantic renderer with zero design-system dependencies.',
      description:
        'Use this renderer when you want a ready-to-read baseline or when your team plans to fork the markup without bringing in Material or DaisyUI.',
      requirements: [
        'Install @ng-orbit/table-render-plain next to @ng-orbit/table.',
        'Keep data fetching in the parent and update inputs from orbitTableQueryChange.'
      ],
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'plain' }
      },
      snippetTitle: 'Plain renderer integration',
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
  <orbit-table-render-plain [table]="table" />
</section>
`)
    },
    {
      id: 'material',
      label: 'Material',
      packageName: '@ng-orbit/table-render-material',
      summary: 'A ready-made Material-flavored renderer for teams already on Angular Material.',
      description:
        'The renderer talks only to OrbitTableDirective. Your feature component still handles the backend contract, errors, and row updates.',
      requirements: [
        'Install Angular Material in the host app.',
        'Keep the same controller wiring you use for any other renderer.'
      ],
      preview: {
        kind: 'iframe',
        remoteName: 'demo-material',
        remotePath: '/table/material',
        renderer: 'material',
        frameHeight: '620px'
      },
      snippetTitle: 'Material renderer integration',
      snippet: snippet(`
import { OrbitTableDirective } from '@ng-orbit/table';
import { OrbitTableRenderMaterialComponent } from '@ng-orbit/table-render-material';

@Component({
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderMaterialComponent],
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
      (orbitTableQueryChange)="onQueryChange($event)"
    >
      <orbit-table-render-material [table]="table" />
    </section>
  \`
})
export class UsersMaterialTableComponent {}
`)
    },
    {
      id: 'daisy',
      label: 'Daisy',
      packageName: '@ng-orbit/table-render-daisy',
      summary: 'A renderer for Tailwind + DaisyUI stacks that want class-based styling.',
      description:
        'Use it when you already have DaisyUI in the host app and want to adopt ng-orbit without inventing table markup on day one.',
      requirements: [
        'Install Tailwind + DaisyUI in the consuming app.',
        'The renderer remains presentation-only and expects the parent to own query changes.'
      ],
      preview: {
        kind: 'iframe',
        remoteName: 'demo-daisy',
        remotePath: '/table/daisy',
        renderer: 'daisy',
        frameHeight: '620px'
      },
      snippetTitle: 'Daisy renderer integration',
      snippet: snippet(`
import { OrbitTableDirective } from '@ng-orbit/table';
import { OrbitTableRenderDaisyComponent } from '@ng-orbit/table-render-daisy';

@Component({
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderDaisyComponent],
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
      (orbitTableQueryChange)="onQueryChange($event)"
    >
      <orbit-table-render-daisy [table]="table" />
    </section>
  \`
})
export class UsersDaisyTableComponent {}
`)
    },
    {
      id: 'custom',
      label: 'Build your own',
      packageName: '@ng-orbit/table',
      summary: 'Own the markup while still delegating state and query intent to the controller.',
      description:
        'This is the recommended long-term path when your product has a bespoke design language or custom cell layouts that a renderer package should not own.',
      requirements: [
        'Render your own table, grid, or card layout.',
        'Call only controller commands from the UI layer.'
      ],
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'custom' }
      },
      snippetTitle: 'Custom markup using orbitTable',
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
  (orbitTableSelectionChange)="selection.set($event)"
>
  <table>
    <thead>
      <tr>
        @for (column of table.columns(); track column.id) {
          <th>
            <button type="button" (click)="table.toggleSort(column.id)">
              {{ column.id }}
            </button>
          </th>
        }
      </tr>
    </thead>
    <tbody>
      @for (row of table.rows(); track row.id) {
        <tr>
          @for (column of table.columns(); track column.id) {
            <td>{{ column.accessor?.(row) }}</td>
          }
        </tr>
      }
    </tbody>
  </table>
</section>
`)
    }
  ],
  examples: [
    {
      id: 'quickstart-plain',
      label: 'Quickstart',
      title: 'Quickstart with the plain renderer',
      description:
        'Start from the smallest possible consumer integration: keep server state in your component and let the reference renderer render the table.',
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'plain' }
      },
      snippetTitle: 'Minimal table component',
      snippet: snippet(`
readonly query = signal(createDefaultOrbitTableQuery());
readonly rows = signal<readonly UserRow[]>([]);
readonly total = signal(0);
readonly loading = signal(false);
readonly error = signal<unknown | null>(null);

onQueryChange(query: OrbitTableQuery): void {
  this.query.set(query);
  this.fetchUsers(query);
}
`),
      notes: [
        'You can keep query state in signals, component store, ngrx, or any other app-level abstraction.',
        'Rows are always pushed back into the directive by the parent.'
      ]
    },
    {
      id: 'custom-headless',
      label: 'Custom markup',
      title: 'Headless integration with consumer-owned markup',
      description:
        'When your product needs bespoke headers, cards, or row layouts, use orbitTable directly and render whatever structure you need.',
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'custom' }
      },
      snippetTitle: 'Custom layout example',
      snippet: snippet(`
<div class="table-toolbar">
  <input
    type="search"
    [value]="table.query().search"
    (input)="table.setSearch(($event.target as HTMLInputElement).value)"
  />
</div>

@for (row of table.rows(); track row.id) {
  <article class="table-row-card">
    <strong>{{ row.fullName }}</strong>
    <span>{{ row.email }}</span>
    <button type="button" (click)="table.toggleRow(row)">
      {{ table.isRowSelected(row) ? 'Unselect' : 'Select' }}
    </button>
  </article>
}
`)
    },
    {
      id: 'server-driven',
      label: 'Server-driven flow',
      title: 'React to orbitTableQueryChange and fetch from the backend',
      description:
        'This example surfaces the emitted query payload so you can see exactly what the parent would send to an API layer.',
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'server-driven' }
      },
      snippetTitle: 'Fetch on query changes',
      snippet: snippet(`
onQueryChange(query: OrbitTableQuery): void {
  this.query.set(query);
  this.loading.set(true);

  this.usersApi
    .search({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      sortBy: query.sort?.activeId ?? null,
      sortDirection: query.sort?.direction ?? null
    })
    .subscribe({
      next: (response) => {
        this.rows.set(response.rows);
        this.total.set(response.total);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error);
        this.loading.set(false);
      }
    });
}
`),
      notes: ['Sorting, pagination, and search remain server-driven unless your app decides otherwise.']
    },
    {
      id: 'renderer-swap',
      label: 'Renderer swap',
      title: 'Swap renderers without rewriting the feature contract',
      description:
        'The same rows, columns, query, and controller outputs can back multiple visual environments while the parent logic stays untouched.',
      preview: {
        kind: 'component',
        component: TableDocsPreviewComponent,
        inputs: { variant: 'renderer-swap' }
      },
      snippetTitle: 'Renderer swap with the same contract',
      snippet: snippet(`
@if (useMaterial()) {
  <orbit-table-render-material [table]="table" />
} @else if (useDaisy()) {
  <orbit-table-render-daisy [table]="table" />
} @else {
  <orbit-table-render-plain [table]="table" />
}
`),
      notes: ['Swap the visual layer only. The parent keeps the same query and data contract.']
    }
  ]
};

function snippet(value: string): string {
  return value.trim();
}
