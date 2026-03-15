import type { Type } from '@angular/core';

export type DocsTabId = 'overview' | 'api' | 'renders' | 'examples';
export type DocsCodeLanguage = 'bash' | 'typescript' | 'markup' | 'scss' | 'text';

export interface DocsOverviewSection {
  readonly title: string;
  readonly body: string;
  readonly points?: readonly string[];
}

export interface DocsApiEntry {
  readonly name: string;
  readonly signature?: string;
  readonly description: string;
  readonly details?: readonly string[];
}

export interface DocsApiGroup {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly entries: readonly DocsApiEntry[];
}

export interface DocsHeroBlock {
  readonly title: string;
  readonly code: string;
  readonly language?: DocsCodeLanguage;
  readonly copyable?: boolean;
}

export interface DocsComponentPreview {
  readonly kind: 'component';
  readonly component: Type<unknown>;
  readonly inputs?: Readonly<Record<string, unknown>>;
}

export interface DocsIframePreview {
  readonly kind: 'iframe';
  readonly remoteName: string;
  readonly remotePath: string;
  readonly renderer?: string;
  readonly frameHeight?: string;
}

export type DocsPreviewConfig = DocsComponentPreview | DocsIframePreview;

export interface DocsRendererDefinition {
  readonly id: string;
  readonly label: string;
  readonly packageName?: string;
  readonly metaLabel?: string;
  readonly badgeText?: string;
  readonly summary: string;
  readonly description: string;
  readonly requirements?: readonly string[];
  readonly preview: DocsPreviewConfig;
  readonly snippetTitle: string;
  readonly snippet: string;
  readonly snippetLanguage?: DocsCodeLanguage;
}

export interface DocsExampleDefinition {
  readonly id: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly preview: DocsPreviewConfig;
  readonly snippetTitle: string;
  readonly snippet: string;
  readonly snippetLanguage?: DocsCodeLanguage;
  readonly notes?: readonly string[];
}

export interface DocsFeatureDefinition {
  readonly id: string;
  readonly routePath: string;
  readonly title: string;
  readonly packageName?: string;
  readonly heroEyebrow?: string;
  readonly heroBlocks?: readonly DocsHeroBlock[];
  readonly summary: string;
  readonly tagline: string;
  readonly installSnippet?: string;
  readonly installSnippetLanguage?: DocsCodeLanguage;
  readonly importSnippet?: string;
  readonly importSnippetLanguage?: DocsCodeLanguage;
  readonly quickstartTitle?: string;
  readonly quickstartSnippet: string;
  readonly quickstartLanguage?: DocsCodeLanguage;
  readonly overviewCodeSectionTitle?: string;
  readonly overviewCodeSectionLead?: string;
  readonly overviewCodeBlocks?: readonly DocsHeroBlock[];
  readonly overviewSections: readonly DocsOverviewSection[];
  readonly apiSummary: string;
  readonly apiGroups: readonly DocsApiGroup[];
  readonly renders: readonly DocsRendererDefinition[];
  readonly examples: readonly DocsExampleDefinition[];
  readonly tabLabels?: Partial<Record<DocsTabId, string>>;
  readonly tabRouteSegments?: Partial<Record<DocsTabId, string>>;
  readonly renderSelectorLabel?: string;
  readonly renderPreviewDescription?: string;
  readonly exampleSelectorLabel?: string;
  readonly exampleEyebrow?: string;
  readonly examplePreviewDescription?: string;
}

export interface DocsTabDefinition {
  readonly id: DocsTabId;
  readonly label: string;
}

export const DOCS_TABS: readonly DocsTabDefinition[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'api', label: 'API' },
  { id: 'renders', label: 'Renders' },
  { id: 'examples', label: 'Examples' }
];
