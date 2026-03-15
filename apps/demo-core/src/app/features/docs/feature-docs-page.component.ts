import { toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocsCodeBlockComponent } from './docs-code-block.component';
import {
  DOCS_TABS,
  type DocsFeatureDefinition,
  type DocsHeroBlock,
  type DocsTabDefinition,
  type DocsTabId
} from './docs.models';
import { DocsPreviewHostComponent } from './docs-preview-host.component';

interface CanonicalQueryParams {
  readonly tab: DocsTabId;
  readonly renderer?: string;
  readonly example?: string;
}

@Component({
  selector: 'ng-orbit-feature-docs-page',
  standalone: true,
  imports: [DocsCodeBlockComponent, DocsPreviewHostComponent],
  templateUrl: './feature-docs-page.component.html',
  styleUrl: './feature-docs-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureDocsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly docs = input.required<DocsFeatureDefinition>();

  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap
  });
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });

  protected readonly tabs = computed<readonly DocsTabDefinition[]>(() =>
    DOCS_TABS.map((tab) => ({
      ...tab,
      label: this.docs().tabLabels?.[tab.id] ?? tab.label
    }))
  );
  protected readonly heroEyebrow = computed(
    () => this.docs().heroEyebrow ?? this.docs().packageName ?? this.docs().title
  );
  protected readonly heroBlocks = computed<readonly DocsHeroBlock[]>(() => {
    const docs = this.docs();

    if (docs.heroBlocks?.length) {
      return docs.heroBlocks;
    }

    if (!docs.packageName || !docs.installSnippet || !docs.importSnippet) {
      return [];
    }

    return [
      {
        title: `Install ${docs.packageName}`,
        code: docs.installSnippet,
        language: docs.installSnippetLanguage ?? 'bash'
      },
      {
        title: 'Import',
        code: docs.importSnippet,
        language: docs.importSnippetLanguage ?? 'typescript'
      }
    ];
  });
  protected readonly quickstartTitle = computed(() => this.docs().quickstartTitle ?? 'Quickstart');
  protected readonly quickstartLanguage = computed(
    () => this.docs().quickstartLanguage ?? 'typescript'
  );
  protected readonly overviewCodeSectionTitle = computed(() => this.docs().overviewCodeSectionTitle);
  protected readonly overviewCodeSectionLead = computed(() => this.docs().overviewCodeSectionLead);
  protected readonly overviewCodeBlocks = computed(
    () => this.docs().overviewCodeBlocks ?? []
  );
  protected readonly renderSelectorLabel = computed(
    () => this.docs().renderSelectorLabel ?? 'Render options'
  );
  protected readonly renderPreviewDescription = computed(
    () =>
      this.docs().renderPreviewDescription ??
      'Rendered inside the docs host using the real controller contract.'
  );
  protected readonly exampleSelectorLabel = computed(
    () => this.docs().exampleSelectorLabel ?? 'Example scenarios'
  );
  protected readonly exampleEyebrow = computed(
    () => this.docs().exampleEyebrow ?? 'Consumer example'
  );
  protected readonly examplePreviewDescription = computed(
    () =>
      this.docs().examplePreviewDescription ??
      'Try the interaction and compare it with the snippet on the right.'
  );
  protected readonly activeTab = computed<DocsTabId>(() =>
    this.resolveTab(this.queryParamMap().get('tab'))
  );
  protected readonly activeRendererId = computed(() =>
    this.resolveRenderer(this.queryParamMap().get('renderer'))
  );
  protected readonly activeExampleId = computed(() =>
    this.resolveExample(this.queryParamMap().get('example'))
  );
  protected readonly activeRenderer = computed(
    () => this.docs().renders.find((renderer) => renderer.id === this.activeRendererId()) ?? null
  );
  protected readonly activeRendererBadge = computed(
    () =>
      this.activeRenderer()?.badgeText ??
      this.activeRenderer()?.packageName ??
      this.heroEyebrow()
  );
  protected readonly activeExample = computed(
    () => this.docs().examples.find((example) => example.id === this.activeExampleId()) ?? null
  );

  constructor() {
    effect(() => {
      this.ensureCanonicalRoute();
    });
  }

  protected selectTab(tab: DocsTabId): void {
    void this.router.navigate([`/${this.docs().routePath}`], {
      queryParams: this.buildCanonicalQuery(tab, this.activeRendererId(), this.activeExampleId())
    });
  }

  protected selectRenderer(rendererId: string): void {
    void this.router.navigate([`/${this.docs().routePath}`], {
      queryParams: this.buildCanonicalQuery('renders', rendererId, this.activeExampleId())
    });
  }

  protected selectExample(exampleId: string): void {
    void this.router.navigate([`/${this.docs().routePath}`], {
      queryParams: this.buildCanonicalQuery('examples', this.activeRendererId(), exampleId)
    });
  }

  private resolveTab(rawTab: string | null): DocsTabId {
    if (rawTab && DOCS_TABS.some((tab) => tab.id === rawTab)) {
      return rawTab as DocsTabId;
    }

    const currentPath = this.route.snapshot.routeConfig?.path ?? '';
    return currentPath === this.docs().routePath ? 'overview' : 'renders';
  }

  private resolveRenderer(rawRenderer: string | null): string {
    const availableRendererIds = new Set(this.docs().renders.map((renderer) => renderer.id));

    if (rawRenderer && availableRendererIds.has(rawRenderer)) {
      return rawRenderer;
    }

    const legacyRenderer = this.mapLegacyRenderer(this.routeData()['renderer'] as string | undefined);
    if (legacyRenderer && availableRendererIds.has(legacyRenderer)) {
      return legacyRenderer;
    }

    return this.docs().renders[0]?.id ?? '';
  }

  private resolveExample(rawExample: string | null): string {
    const availableExampleIds = new Set(this.docs().examples.map((example) => example.id));
    if (rawExample && availableExampleIds.has(rawExample)) {
      return rawExample;
    }

    return this.docs().examples[0]?.id ?? '';
  }

  private mapLegacyRenderer(renderer: string | undefined): string {
    if (!renderer) {
      return '';
    }

    if (renderer === 'core') {
      return 'custom';
    }

    return renderer;
  }

  private buildCanonicalQuery(
    tab: DocsTabId,
    renderer: string,
    example: string
  ): CanonicalQueryParams {
    if (tab === 'renders') {
      return {
        tab,
        renderer
      };
    }

    if (tab === 'examples') {
      return {
        tab,
        example
      };
    }

    return { tab };
  }

  private ensureCanonicalRoute(): void {
    const currentPath = this.route.snapshot.routeConfig?.path ?? '';
    const currentParams = this.queryParamMap();
    const canonicalParams = this.buildCanonicalQuery(
      this.activeTab(),
      this.activeRendererId(),
      this.activeExampleId()
    );

    if (
      currentPath !== this.docs().routePath ||
      !areCanonicalQueryParamsEqual(currentParams, canonicalParams)
    ) {
      void this.router.navigate([`/${this.docs().routePath}`], {
        queryParams: canonicalParams,
        replaceUrl: true
      });
    }
  }
}

function areCanonicalQueryParamsEqual(
  currentParams: Pick<URLSearchParams, 'get'>,
  expectedParams: CanonicalQueryParams
): boolean {
  return (
    (currentParams.get('tab') ?? undefined) === expectedParams.tab &&
    (currentParams.get('renderer') ?? undefined) === expectedParams.renderer &&
    (currentParams.get('example') ?? undefined) === expectedParams.example
  );
}
