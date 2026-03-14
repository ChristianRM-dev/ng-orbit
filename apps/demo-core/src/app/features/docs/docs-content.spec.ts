import { DOCS_TABS } from './docs.models';
import { TABLE_DOCS } from './table-docs.data';
import { WIZARD_DOCS } from './wizard-docs.data';

describe('docs content', () => {
  it('exposes the primary docs tabs', () => {
    expect(DOCS_TABS.map((tab) => tab.id)).toEqual([
      'overview',
      'api',
      'renders',
      'examples'
    ]);
  });

  it('ships unique render and example ids for each feature', () => {
    for (const docsDefinition of [TABLE_DOCS, WIZARD_DOCS]) {
      expect(new Set(docsDefinition.renders.map((renderer) => renderer.id)).size).toBe(
        docsDefinition.renders.length
      );
      expect(new Set(docsDefinition.examples.map((example) => example.id)).size).toBe(
        docsDefinition.examples.length
      );
      expect(docsDefinition.renders.length).toBeGreaterThan(0);
      expect(docsDefinition.examples.length).toBeGreaterThan(0);
    }
  });
});
