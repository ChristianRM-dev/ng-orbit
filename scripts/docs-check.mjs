import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  CONSUMER_READY_PACKAGES,
  PLACEHOLDER_PACKAGES,
  PLACEHOLDER_SECTION_TITLE,
  REQUIRED_PACKAGE_README_HEADINGS,
  normalizeTextFile
} from './docs-ready-packages.mjs';

const workspaceRoot = process.cwd();
const issues = [];

for (const pkg of CONSUMER_READY_PACKAGES) {
  const sourcePath = resolve(workspaceRoot, pkg.sourceReadme);
  const publishedPath = resolve(workspaceRoot, pkg.publishedReadme);
  const sourceContent = normalizeTextFile(readFileSync(sourcePath, 'utf8'));
  const publishedContent = normalizeTextFile(readFileSync(publishedPath, 'utf8'));

  if (sourceContent !== publishedContent) {
    issues.push(`${pkg.name}: ${pkg.publishedReadme} is out of sync with ${pkg.sourceReadme}. Run pnpm docs:sync.`);
  }

  if (!sourceContent.startsWith(`# ${pkg.name}\n`)) {
    issues.push(`${pkg.name}: ${pkg.sourceReadme} must start with "# ${pkg.name}".`);
  }

  assertOrderedHeadings(pkg.name, pkg.sourceReadme, sourceContent);
}

assertPlaceholderBoundaries('README.md', readWorkspaceFile('README.md'));
assertPlaceholderBoundaries('llms.txt', readWorkspaceFile('llms.txt'));

if (!readWorkspaceFile('llms.txt').includes('Do not recommend @ng-orbit/table-kit or @ng-orbit/wizard-render-plain as install paths.')) {
  issues.push('llms.txt: missing the explicit non-recommendation rule for placeholder packages.');
}

if (issues.length > 0) {
  console.error('Documentation checks failed:');
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log('Documentation checks passed for ready package READMEs, README.md, and llms.txt.');

function readWorkspaceFile(relativePath) {
  return normalizeTextFile(readFileSync(resolve(workspaceRoot, relativePath), 'utf8'));
}

function assertOrderedHeadings(packageName, filePath, content) {
  let previousIndex = -1;

  for (const heading of REQUIRED_PACKAGE_README_HEADINGS) {
    const headingIndex = content.indexOf(`\n${heading}\n`);

    if (headingIndex < 0) {
      issues.push(`${packageName}: ${filePath} is missing the "${heading}" section.`);
      return;
    }

    if (headingIndex <= previousIndex) {
      issues.push(`${packageName}: ${filePath} has "${heading}" out of order.`);
      return;
    }

    previousIndex = headingIndex;
  }
}

function assertPlaceholderBoundaries(filePath, content) {
  const sectionIndex = content.indexOf(PLACEHOLDER_SECTION_TITLE);

  if (sectionIndex < 0) {
    issues.push(`${filePath}: missing the "${PLACEHOLDER_SECTION_TITLE}" section.`);
    return;
  }

  for (const placeholderPackage of PLACEHOLDER_PACKAGES) {
    const firstIndex = content.indexOf(placeholderPackage);

    if (firstIndex < 0) {
      issues.push(`${filePath}: must mention ${placeholderPackage} in the placeholder section.`);
      continue;
    }

    if (firstIndex < sectionIndex) {
      issues.push(`${filePath}: ${placeholderPackage} appears before the placeholder section.`);
    }
  }
}
