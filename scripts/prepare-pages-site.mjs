import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const workspaceRoot = process.cwd();
const distRoot = join(workspaceRoot, 'dist');
const coreBrowser = join(distRoot, 'demo-core', 'browser');
const materialBrowser = join(distRoot, 'demo-material', 'browser');
const daisyBrowser = join(distRoot, 'demo-daisy', 'browser');
const pagesRoot = join(distRoot, 'pages');
const siteRoot = join(pagesRoot, 'ng-orbit');

rmSync(pagesRoot, { force: true, recursive: true });
mkdirSync(siteRoot, { recursive: true });

copyBuild(coreBrowser, siteRoot);
copyBuild(materialBrowser, join(siteRoot, 'material'));
copyBuild(daisyBrowser, join(siteRoot, 'daisy'));

const manifest = JSON.stringify(
  {
    'demo-material': 'material/',
    'demo-daisy': 'daisy/'
  },
  null,
  2
);

writeFileSync(join(siteRoot, 'federation.manifest.json'), `${manifest}\n`);
mkdirSync(join(siteRoot, 'assets'), { recursive: true });
writeFileSync(join(siteRoot, 'assets', 'federation.manifest.json'), `${manifest}\n`);
writeFileSync(join(pagesRoot, '.nojekyll'), '');

function copyBuild(source, target) {
  if (!existsSync(source)) {
    throw new Error(`Missing build output: ${source}`);
  }

  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}
