import { Injectable, computed, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DemoI18nService } from '../../core/i18n/demo-i18n.service';
import { DOCS_FEATURES, type DocsFeatureId } from './docs.catalog';
import type {
  DocsApiEntry,
  DocsApiGroup,
  DocsExampleDefinition,
  DocsFeatureDefinition,
  DocsHeroBlock,
  DocsOverviewSection,
  DocsRendererDefinition,
  DocsTabId
} from './docs.models';

interface DocsHeroBlockCopy extends Partial<DocsHeroBlock> {}

interface DocsOverviewSectionCopy extends Partial<DocsOverviewSection> {}

interface DocsApiEntryCopy extends Partial<Pick<DocsApiEntry, 'description' | 'details'>> {}

interface DocsApiGroupCopy
  extends Partial<Pick<DocsApiGroup, 'title' | 'description'>> {
  readonly entries?: readonly DocsApiEntryCopy[];
}

interface DocsRendererCopy
  extends Partial<
    Pick<
      DocsRendererDefinition,
      | 'label'
      | 'packageName'
      | 'metaLabel'
      | 'badgeText'
      | 'summary'
      | 'description'
      | 'requirements'
      | 'snippetTitle'
    >
  > {}

interface DocsExampleCopy
  extends Partial<
    Pick<
      DocsExampleDefinition,
      'label' | 'title' | 'description' | 'snippetTitle' | 'notes'
    >
  > {}

interface DocsFeatureCopy
  extends Partial<
    Pick<
      DocsFeatureDefinition,
      | 'title'
      | 'packageName'
      | 'heroEyebrow'
      | 'summary'
      | 'tagline'
      | 'quickstartTitle'
      | 'overviewCodeSectionTitle'
      | 'overviewCodeSectionLead'
      | 'apiSummary'
      | 'renderSelectorLabel'
      | 'renderPreviewDescription'
      | 'exampleSelectorLabel'
      | 'exampleEyebrow'
      | 'examplePreviewDescription'
    >
  > {
  readonly heroBlocks?: readonly DocsHeroBlockCopy[];
  readonly overviewCodeBlocks?: readonly DocsHeroBlockCopy[];
  readonly overviewSections?: readonly DocsOverviewSectionCopy[];
  readonly apiGroups?: readonly DocsApiGroupCopy[];
  readonly renders?: readonly DocsRendererCopy[];
  readonly examples?: readonly DocsExampleCopy[];
  readonly tabLabels?: Partial<Record<DocsTabId, string>>;
}

@Injectable({ providedIn: 'root' })
export class DocsContentService {
  private readonly i18nService = inject(DemoI18nService);
  private readonly translateService = inject(TranslateService);

  readonly tableDocs = computed(() => this.buildDocs('table'));
  readonly wizardDocs = computed(() => this.buildDocs('wizard'));
  readonly notifyDocs = computed(() => this.buildDocs('notify'));
  readonly adaptersDocs = computed(() => this.buildDocs('adapters'));

  getDocs(featureId: DocsFeatureId): DocsFeatureDefinition {
    switch (featureId) {
      case 'table':
        return this.tableDocs();
      case 'wizard':
        return this.wizardDocs();
      case 'notify':
        return this.notifyDocs();
      case 'adapters':
        return this.adaptersDocs();
    }
  }

  private buildDocs(featureId: DocsFeatureId): DocsFeatureDefinition {
    this.i18nService.language();

    const { feature } = DOCS_FEATURES[featureId];
    const copy = this.getTranslationObject<DocsFeatureCopy>(`docs.${featureId}`);
    const sharedTabs = this.getTranslationObject<{ readonly tabs?: Partial<Record<DocsTabId, string>> }>(
      'docs.shared'
    ).tabs;

    return {
      ...feature,
      title: copy.title ?? feature.title,
      packageName: copy.packageName ?? feature.packageName,
      heroEyebrow: copy.heroEyebrow ?? feature.heroEyebrow,
      heroBlocks: mergeHeroBlocks(feature.heroBlocks, copy.heroBlocks),
      summary: copy.summary ?? feature.summary,
      tagline: copy.tagline ?? feature.tagline,
      quickstartTitle: copy.quickstartTitle ?? feature.quickstartTitle,
      overviewCodeSectionTitle:
        copy.overviewCodeSectionTitle ?? feature.overviewCodeSectionTitle,
      overviewCodeSectionLead:
        copy.overviewCodeSectionLead ?? feature.overviewCodeSectionLead,
      overviewCodeBlocks: mergeHeroBlocks(feature.overviewCodeBlocks, copy.overviewCodeBlocks),
      overviewSections: mergeOverviewSections(feature.overviewSections, copy.overviewSections),
      apiSummary: copy.apiSummary ?? feature.apiSummary,
      apiGroups: mergeApiGroups(feature.apiGroups, copy.apiGroups),
      renders: mergeRenders(feature.renders, copy.renders),
      examples: mergeExamples(feature.examples, copy.examples),
      tabLabels: {
        ...(sharedTabs ?? {}),
        ...(feature.tabLabels ?? {}),
        ...(copy.tabLabels ?? {})
      },
      renderSelectorLabel: copy.renderSelectorLabel ?? feature.renderSelectorLabel,
      renderPreviewDescription:
        copy.renderPreviewDescription ?? feature.renderPreviewDescription,
      exampleSelectorLabel: copy.exampleSelectorLabel ?? feature.exampleSelectorLabel,
      exampleEyebrow: copy.exampleEyebrow ?? feature.exampleEyebrow,
      examplePreviewDescription:
        copy.examplePreviewDescription ?? feature.examplePreviewDescription
    };
  }

  private getTranslationObject<T extends object>(key: string): Partial<T> {
    const value = this.translateService.instant(key);
    return typeof value === 'string' ? {} : (value as Partial<T>);
  }
}

function mergeHeroBlocks(
  baseBlocks: readonly DocsHeroBlock[] | undefined,
  copyBlocks: readonly DocsHeroBlockCopy[] | undefined
): readonly DocsHeroBlock[] | undefined {
  if (!baseBlocks?.length) {
    return baseBlocks;
  }

  return baseBlocks.map((block, index) => ({
    ...block,
    ...(copyBlocks?.[index] ?? {})
  }));
}

function mergeOverviewSections(
  baseSections: readonly DocsOverviewSection[],
  copySections: readonly DocsOverviewSectionCopy[] | undefined
): readonly DocsOverviewSection[] {
  return baseSections.map((section, index) => ({
    ...section,
    ...(copySections?.[index] ?? {})
  }));
}

function mergeApiGroups(
  baseGroups: readonly DocsApiGroup[],
  copyGroups: readonly DocsApiGroupCopy[] | undefined
): readonly DocsApiGroup[] {
  return baseGroups.map((group, groupIndex) => ({
    ...group,
    ...(copyGroups?.[groupIndex] ?? {}),
    entries: group.entries.map((entry, entryIndex) => ({
      ...entry,
      ...(copyGroups?.[groupIndex]?.entries?.[entryIndex] ?? {})
    }))
  }));
}

function mergeRenders(
  baseRenders: readonly DocsRendererDefinition[],
  copyRenders: readonly DocsRendererCopy[] | undefined
): readonly DocsRendererDefinition[] {
  return baseRenders.map((renderer, index) => ({
    ...renderer,
    ...(copyRenders?.[index] ?? {})
  }));
}

function mergeExamples(
  baseExamples: readonly DocsExampleDefinition[],
  copyExamples: readonly DocsExampleCopy[] | undefined
): readonly DocsExampleDefinition[] {
  return baseExamples.map((example, index) => ({
    ...example,
    ...(copyExamples?.[index] ?? {})
  }));
}
