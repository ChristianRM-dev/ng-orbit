import { execSync } from 'node:child_process';

function hasReleaseTags() {
  try {
    const output = execSync("git tag --list 'v*'", {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit']
    }).trim();
    return output.length > 0;
  } catch {
    return false;
  }
}

const hasTags = hasReleaseTags();
const command = hasTags
  ? 'pnpm nx release --groups public-packages --dry-run --skip-publish'
  : 'pnpm nx release 0.1.0 --groups public-packages --dry-run --skip-publish --first-release';

execSync(command, {
  cwd: process.cwd(),
  stdio: 'inherit'
});
