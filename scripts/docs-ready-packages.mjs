export const CONSUMER_READY_PACKAGES = [
  {
    name: '@ng-orbit/notify',
    directory: 'packages/notify',
    sourceReadme: 'packages/notify/src/README.md',
    publishedReadme: 'packages/notify/README.md'
  },
  {
    name: '@ng-orbit/notify-render-plain',
    directory: 'packages/notify-render-plain',
    sourceReadme: 'packages/notify-render-plain/src/README.md',
    publishedReadme: 'packages/notify-render-plain/README.md'
  },
  {
    name: '@ng-orbit/table',
    directory: 'packages/table',
    sourceReadme: 'packages/table/src/README.md',
    publishedReadme: 'packages/table/README.md'
  },
  {
    name: '@ng-orbit/wizard',
    directory: 'packages/wizard',
    sourceReadme: 'packages/wizard/src/README.md',
    publishedReadme: 'packages/wizard/README.md'
  },
  {
    name: '@ng-orbit/wizard-kit',
    directory: 'packages/wizard-kit',
    sourceReadme: 'packages/wizard-kit/src/README.md',
    publishedReadme: 'packages/wizard-kit/README.md'
  },
  {
    name: '@ng-orbit/table-render-plain',
    directory: 'packages/table-render-plain',
    sourceReadme: 'packages/table-render-plain/src/README.md',
    publishedReadme: 'packages/table-render-plain/README.md'
  },
  {
    name: '@ng-orbit/table-render-material',
    directory: 'packages/table-render-material',
    sourceReadme: 'packages/table-render-material/src/README.md',
    publishedReadme: 'packages/table-render-material/README.md'
  },
  {
    name: '@ng-orbit/table-render-daisy',
    directory: 'packages/table-render-daisy',
    sourceReadme: 'packages/table-render-daisy/src/README.md',
    publishedReadme: 'packages/table-render-daisy/README.md'
  },
  {
    name: '@ng-orbit/wizard-render-material',
    directory: 'packages/wizard-render-material',
    sourceReadme: 'packages/wizard-render-material/src/README.md',
    publishedReadme: 'packages/wizard-render-material/README.md'
  },
  {
    name: '@ng-orbit/wizard-render-daisy',
    directory: 'packages/wizard-render-daisy',
    sourceReadme: 'packages/wizard-render-daisy/src/README.md',
    publishedReadme: 'packages/wizard-render-daisy/README.md'
  }
];

export const PLACEHOLDER_PACKAGES = ['@ng-orbit/table-kit', '@ng-orbit/wizard-render-plain'];

export const REQUIRED_PACKAGE_README_HEADINGS = [
  '## AI Quick Map',
  '## What it is',
  '## Install',
  '## Use this when',
  '## Do not use this when',
  '## Library owns',
  '## Consumer owns',
  '## Primary exports',
  '## Smallest working example',
  '## Related packages',
  '## Docs links'
];

export const PLACEHOLDER_SECTION_TITLE = 'Placeholders in the repo, not consumer-ready';

export function normalizeTextFile(content) {
  return content.replace(/\r\n/g, '\n').trimEnd() + '\n';
}
