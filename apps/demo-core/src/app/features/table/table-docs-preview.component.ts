import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { OrbitTableDirective, type OrbitTableQuery, type OrbitTableSelectionState } from '@ng-orbit/table';
import { OrbitTableRenderPlainComponent } from '@ng-orbit/table-render-plain';
import { RemoteIframePageComponent } from '../remote/remote-iframe-page.component';
import { TableCorePageComponent } from './table-core-page.component';
import { TableDemoFacade } from './table-demo.facade';
import { TablePlainPageComponent } from './table-plain-page.component';

export type TableDocsPreviewVariant =
  | 'plain'
  | 'custom'
  | 'server-driven'
  | 'renderer-swap';

@Component({
  selector: 'ng-orbit-table-query-flow-preview',
  standalone: true,
  imports: [OrbitTableDirective, OrbitTableRenderPlainComponent],
  providers: [TableDemoFacade],
  template: `
    <section
      class="ng-orbit-table-docs-panel"
      orbitTable
      #table="orbitTable"
      [rows]="facade.rows()"
      [columns]="facade.columns()"
      [total]="facade.total()"
      [loading]="facade.loading()"
      [error]="facade.error()"
      [query]="facade.query()"
      [getRowId]="facade.getRowId"
      (orbitTableQueryChange)="onQueryChange($event)"
      (orbitTableSelectionChange)="onSelectionChange($event)"
    >
      <header class="ng-orbit-table-docs-panel__meta">
        <div>
          <p class="ng-orbit-table-docs-panel__label">Latest query payload</p>
          <pre>{{ latestQuery() }}</pre>
        </div>
        <dl class="ng-orbit-table-docs-panel__stats">
          <div>
            <dt>Total</dt>
            <dd>{{ facade.total() }}</dd>
          </div>
          <div>
            <dt>Selected</dt>
            <dd>{{ facade.selectedCount() }}</dd>
          </div>
        </dl>
      </header>

      <orbit-table-render-plain [table]="table" />
    </section>
  `,
  styleUrl: './table-docs-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableQueryFlowPreviewComponent {
  protected readonly facade = inject(TableDemoFacade);
  protected readonly latestQuery = signal(formatQuery(this.facade.query()));

  protected onQueryChange(query: OrbitTableQuery): void {
    this.latestQuery.set(formatQuery(query));
    this.facade.onQueryChange(query);
  }

  protected onSelectionChange(selection: OrbitTableSelectionState): void {
    this.facade.onSelectionChange(selection);
  }
}

@Component({
  selector: 'ng-orbit-table-renderer-swap-preview',
  standalone: true,
  imports: [RemoteIframePageComponent, TablePlainPageComponent],
  template: `
    <section class="ng-orbit-table-swap">
      <header class="ng-orbit-table-swap__header">
        <div>
          <p class="ng-orbit-table-swap__label">Same controller contract</p>
          <h3>Swap the visual layer without changing your data flow</h3>
        </div>

        <div class="ng-orbit-table-swap__actions">
          @for (rendererOption of rendererOptions; track rendererOption.id) {
            <button
              type="button"
              [class.ng-orbit-table-swap__action--active]="activeRenderer() === rendererOption.id"
              (click)="activeRenderer.set(rendererOption.id)"
            >
              {{ rendererOption.label }}
            </button>
          }
        </div>
      </header>

      @if (activeRenderer() === 'plain') {
        <ng-orbit-table-plain-page />
      }

      @if (activeRenderer() === 'material') {
        <ng-orbit-remote-iframe-page
          remoteName="demo-material"
          remotePath="/table/material"
          lang="en"
          renderer="material"
          frameHeight="620px"
        />
      }

      @if (activeRenderer() === 'daisy') {
        <ng-orbit-remote-iframe-page
          remoteName="demo-daisy"
          remotePath="/table/daisy"
          lang="en"
          renderer="daisy"
          frameHeight="620px"
        />
      }
    </section>
  `,
  styleUrl: './table-docs-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableRendererSwapPreviewComponent {
  protected readonly rendererOptions = [
    { id: 'plain', label: 'Plain' },
    { id: 'material', label: 'Material' },
    { id: 'daisy', label: 'Daisy' }
  ] as const;
  protected readonly activeRenderer = signal<'plain' | 'material' | 'daisy'>('plain');
}

@Component({
  selector: 'ng-orbit-table-docs-preview',
  standalone: true,
  imports: [
    TableCorePageComponent,
    TablePlainPageComponent,
    TableQueryFlowPreviewComponent,
    TableRendererSwapPreviewComponent
  ],
  template: `
    <section class="ng-orbit-table-docs-preview">
      @switch (variant()) {
        @case ('plain') {
          <ng-orbit-table-plain-page />
        }

        @case ('custom') {
          <ng-orbit-table-core-page />
        }

        @case ('server-driven') {
          <ng-orbit-table-query-flow-preview />
        }

        @case ('renderer-swap') {
          <ng-orbit-table-renderer-swap-preview />
        }
      }
    </section>
  `,
  styleUrl: './table-docs-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDocsPreviewComponent {
  readonly variant = input<TableDocsPreviewVariant>('plain');
}

function formatQuery(query: OrbitTableQuery): string {
  return JSON.stringify(query, null, 2);
}
