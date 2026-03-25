import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONSUMER_READY_PACKAGES, normalizeTextFile } from './docs-ready-packages.mjs';

const workspaceRoot = process.cwd();
let syncedCount = 0;

for (const pkg of CONSUMER_READY_PACKAGES) {
  const sourcePath = resolve(workspaceRoot, pkg.sourceReadme);
  const publishedPath = resolve(workspaceRoot, pkg.publishedReadme);
  const nextContent = normalizeTextFile(readFileSync(sourcePath, 'utf8'));
  let previousContent = '';

  try {
    previousContent = normalizeTextFile(readFileSync(publishedPath, 'utf8'));
  } catch {
    previousContent = '';
  }

  if (previousContent === nextContent) {
    continue;
  }

  writeFileSync(publishedPath, nextContent);
  syncedCount += 1;
  console.log(`Synced ${pkg.publishedReadme} from ${pkg.sourceReadme}`);
}

if (syncedCount === 0) {
  console.log('Package READMEs are already synchronized.');
} else {
  console.log(`Synchronized ${syncedCount} package README${syncedCount === 1 ? '' : 's'}.`);
}
