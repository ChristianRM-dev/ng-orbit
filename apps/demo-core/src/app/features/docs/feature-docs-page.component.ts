import { isPlatformBrowser } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { DemoI18nService } from '../../core/i18n/demo-i18n.service';
import { DocsSeoService } from '../../core/seo/docs-seo.service';
import { buildDocsCanonicalPath } from './docs.catalog';
import { DocsCodeBlockComponent } from './docs-code-block.component';
import {
  DOCS_TABS,
  type DocsFeatureDefinition,
  type DocsHeroBlock,
  type DocsTabDefinition,
  type DocsTabId
} from './docs.models';
import { DocsPreviewHostComponent } from './docs-preview-host.component';

interface DocsRouteData {
  readonly docsTab?: DocsTabId;
  readonly renderer?: string;
  readonly example?: string;
  readonly legacy?: boolean;
}

@Component({
  selector: 'ng-orbit-feature-docs-page',
  standalone: true,
  imports: [DocsCodeBlockComponent, DocsPreviewHostComponent, TranslatePipe],
  templateUrl: './feature-docs-page.component.html',
  styleUrl: './feature-docs-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureDocsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly i18nService = inject(DemoI18nService);
  private readonly docsSeoService = inject(DocsSeoService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly docs = input.required<DocsFeatureDefinition>();

  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap
  });
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data
  });
  private readonly routerUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  protected readonly tabs = computed<readonly DocsTabDefinition[]>(() =>
    DOCS_TABS.map((tab) => ({
      ...tab,
      label: this.docs().tabLabels?.[tab.id] ?? tab.label
    }))
  );
  protected readonly activeLanguage = this.i18nService.language;
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
  protected readonly overviewCodeBlocks = computed(() => this.docs().overviewCodeBlocks ?? []);
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
    this.resolveTab((this.routeData() as DocsRouteData).docsTab, this.queryParamMap().get('tab'))
  );
  protected readonly activeRendererId = computed(() =>
    this.resolveRenderer(
      (this.routeData() as DocsRouteData).renderer ?? this.queryParamMap().get('renderer')
    )
  );
  protected readonly activeExampleId = computed(() =>
    this.resolveExample(
      (this.routeData() as DocsRouteData).example ?? this.queryParamMap().get('example')
    )
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

    effect(() => {
      this.updateSeoMetadata();
    });
  }

  protected selectTab(tab: DocsTabId): void {
    void this.router.navigateByUrl(this.buildCanonicalUrl(tab));
  }

  protected selectRenderer(rendererId: string): void {
    void this.router.navigateByUrl(this.buildCanonicalUrl('renders', rendererId));
  }

  protected selectExample(exampleId: string): void {
    void this.router.navigateByUrl(this.buildCanonicalUrl('examples', undefined, exampleId));
  }

  private resolveTab(routeTab: DocsTabId | undefined, rawTab: string | null): DocsTabId {
    if (routeTab && DOCS_TABS.some((tab) => tab.id === routeTab)) {
      return routeTab;
    }

    if (rawTab && DOCS_TABS.some((tab) => tab.id === rawTab)) {
      return rawTab as DocsTabId;
    }

    return 'overview';
  }

  private resolveRenderer(rawRenderer: string | null): string {
    const availableRendererIds = new Set(this.docs().renders.map((renderer) => renderer.id));

    if (rawRenderer && availableRendererIds.has(rawRenderer)) {
      return rawRenderer;
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

  private buildCanonicalUrl(
    tab: DocsTabId,
    renderer = this.activeRendererId(),
    example = this.activeExampleId()
  ): string {
    const path = buildDocsCanonicalPath(this.docs(), tab, {
      renderer: tab === 'renders' ? renderer : undefined,
      example: tab === 'examples' ? example : undefined
    });

    const query = new URLSearchParams();
    if (this.activeLanguage() === 'es') {
      query.set('lang', 'es');
    }

    const queryString = query.toString();
    return queryString ? `${path}?${queryString}` : path;
  }

  private ensureCanonicalRoute(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const currentPath = this.routerUrl().split('?')[0] || '/';
    const routeData = this.routeData() as DocsRouteData;
    const expectedUrl = this.buildCanonicalUrl(this.activeTab());
    const expectedPath = expectedUrl.split('?')[0];
    const currentQuery = this.queryParamMap();
    const expectedLang = this.activeLanguage() === 'es' ? 'es' : null;
    const currentLang = currentQuery.get('lang');
    const hasLegacyDocQueryParams =
      currentQuery.has('tab') || currentQuery.has('renderer') || currentQuery.has('example');

    if (
      currentPath !== expectedPath ||
      hasLegacyDocQueryParams ||
      !!routeData.legacy ||
      currentLang !== expectedLang
    ) {
      void this.router.navigateByUrl(expectedUrl, {
        replaceUrl: true
      });
    }
  }

  private updateSeoMetadata(): void {
    const docs = this.docs();
    const activeTab = this.activeTab();
    const canonicalPath = buildDocsCanonicalPath(docs, activeTab, {
      renderer: activeTab === 'renders' ? this.activeRendererId() : undefined,
      example: activeTab === 'examples' ? this.activeExampleId() : undefined
    });

    this.docsSeoService.update({
      title: this.buildSeoTitle(),
      description: this.buildSeoDescription(),
      path: canonicalPath,
      language: this.activeLanguage()
    });
  }

  private buildSeoTitle(): string {
    const docs = this.docs();
    const activeTab = this.activeTab();
    const overviewTabLabel = this.tabs().find((tab) => tab.id === 'overview')?.label ?? 'Overview';
    const apiTabLabel = this.tabs().find((tab) => tab.id === 'api')?.label ?? 'API';
    const renderTabLabel = this.tabs().find((tab) => tab.id === 'renders')?.label ?? 'Renders';
    const examplesTabLabel = this.tabs().find((tab) => tab.id === 'examples')?.label ?? 'Examples';

    switch (activeTab) {
      case 'overview':
        return `${docs.title} | ${overviewTabLabel} | ng-orbit`;
      case 'api':
        return `${docs.title} | ${apiTabLabel} | ng-orbit`;
      case 'renders':
        return `${this.activeRenderer()?.label ?? docs.title} ${renderTabLabel} | ${docs.title} | ng-orbit`;
      case 'examples':
        return `${this.activeExample()?.title ?? docs.title} | ${examplesTabLabel} | ng-orbit`;
    }
  }

  private buildSeoDescription(): string {
    switch (this.activeTab()) {
      case 'overview':
        return this.docs().summary;
      case 'api':
        return this.docs().apiSummary;
      case 'renders':
        return this.activeRenderer()?.summary ?? this.docs().summary;
      case 'examples':
        return this.activeExample()?.description ?? this.docs().summary;
    }
  }
}
