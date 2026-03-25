import { ADAPTERS_DOCS } from './adapters-docs.data';
import type { DocsFeatureDefinition, DocsTabId } from './docs.models';
import { NOTIFY_DOCS } from './notify-docs.data';
import { TABLE_DOCS } from './table-docs.data';
import { WIZARD_DOCS } from './wizard-docs.data';

export type DocsFeatureId = 'table' | 'wizard' | 'notify' | 'adapters';

export interface DocsFeatureCatalogEntry {
  readonly feature: DocsFeatureDefinition;
  readonly renderIds: readonly string[];
  readonly exampleIds: readonly string[];
  readonly legacyRenderAliases?: Readonly<Record<string, string>>;
}

export const DOCS_FEATURES: Record<DocsFeatureId, DocsFeatureCatalogEntry> = {
  table: {
    feature: TABLE_DOCS,
    renderIds: TABLE_DOCS.renders.map((renderer) => renderer.id),
    exampleIds: TABLE_DOCS.examples.map((example) => example.id),
    legacyRenderAliases: {
      core: 'custom',
      plain: 'plain',
      material: 'material',
      daisy: 'daisy'
    }
  },
  wizard: {
    feature: WIZARD_DOCS,
    renderIds: WIZARD_DOCS.renders.map((renderer) => renderer.id),
    exampleIds: WIZARD_DOCS.examples.map((example) => example.id),
    legacyRenderAliases: {
      core: 'custom',
      material: 'material',
      daisy: 'daisy'
    }
  },
  notify: {
    feature: NOTIFY_DOCS,
    renderIds: NOTIFY_DOCS.renders.map((renderer) => renderer.id),
    exampleIds: NOTIFY_DOCS.examples.map((example) => example.id),
    legacyRenderAliases: {
      plain: 'plain'
    }
  },
  adapters: {
    feature: ADAPTERS_DOCS,
    renderIds: ADAPTERS_DOCS.renders.map((renderer) => renderer.id),
    exampleIds: ADAPTERS_DOCS.examples.map((example) => example.id)
  }
};

export function getTabRouteSegment(
  docs: Pick<DocsFeatureDefinition, 'tabRouteSegments'>,
  tab: DocsTabId
): string {
  return docs.tabRouteSegments?.[tab] ?? tab;
}

export function buildDocsCanonicalPath(
  docs: Pick<DocsFeatureDefinition, 'routePath' | 'tabRouteSegments'>,
  tab: DocsTabId,
  options: {
    readonly renderer?: string;
    readonly example?: string;
  } = {}
): string {
  const segment = getTabRouteSegment(docs, tab);

  if (tab === 'renders') {
    return `/${docs.routePath}/${segment}/${options.renderer ?? ''}`.replace(/\/+$/, '');
  }

  if (tab === 'examples') {
    return `/${docs.routePath}/${segment}/${options.example ?? ''}`.replace(/\/+$/, '');
  }

  return `/${docs.routePath}/${segment}`;
}
