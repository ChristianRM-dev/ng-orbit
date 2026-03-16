import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const version = process.argv[2];

if (!version) {
  throw new Error('Expected a version argument, for example: node scripts/extract-changelog-entry.mjs 0.1.0');
}

const changelogPath = resolve(process.cwd(), 'CHANGELOG.md');
const changelog = readFileSync(changelogPath, 'utf8');
const lines = changelog.split('\n');
const headingPattern = new RegExp(`^##?\\s+v?${version.replace(/\./g, '\\.')}\\b`);

const startIndex = lines.findIndex((line) => headingPattern.test(line.trim()));

if (startIndex === -1) {
  process.stdout.write(`Release v${version}`);
  process.exit(0);
}

let endIndex = lines.length;
for (let index = startIndex + 1; index < lines.length; index += 1) {
  if (/^##?\s+v?\d+\.\d+\.\d+\b/.test(lines[index].trim())) {
    endIndex = index;
    break;
  }
}

const entry = lines.slice(startIndex, endIndex).join('\n').trim();
process.stdout.write(entry.length > 0 ? `${entry}\n` : `Release v${version}\n`);
