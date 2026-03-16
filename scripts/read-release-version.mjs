import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const packageJsonPath = resolve(process.cwd(), 'packages/table/package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.version) {
  throw new Error(`No version found in ${packageJsonPath}`);
}

process.stdout.write(String(packageJson.version));
