import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

const workspaceRoot = process.cwd();
const distRoot = join(workspaceRoot, 'dist');
const coreBrowser = join(distRoot, 'demo-core', 'browser');
const materialBrowser = join(distRoot, 'demo-material', 'browser');
const daisyBrowser = join(distRoot, 'demo-daisy', 'browser');
const pagesRoot = join(distRoot, 'pages');
const siteRoot = pagesRoot;

rmSync(pagesRoot, { force: true, recursive: true });
mkdirSync(siteRoot, { recursive: true });

copyBuild(coreBrowser, siteRoot);
postProcessHtml(siteRoot, '/ng-orbit/');

copyBuild(materialBrowser, join(siteRoot, 'material'));
postProcessHtml(join(siteRoot, 'material'), '/ng-orbit/material/');

copyBuild(daisyBrowser, join(siteRoot, 'daisy'));
postProcessHtml(join(siteRoot, 'daisy'), '/ng-orbit/daisy/');

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
writeFileSync(join(siteRoot, '.nojekyll'), '');

function copyBuild(source, target) {
  if (!existsSync(source)) {
    throw new Error(`Missing build output: ${source}`);
  }

  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

function postProcessHtml(root, basePath) {
  for (const filePath of walkFiles(root)) {
    if (!filePath.endsWith('.html')) {
      continue;
    }

    const original = readFileSync(filePath, 'utf8');
    const updated = original
      .replace(
        /(href|src|content)="\/(?!\/)([^"]*)"/g,
        (_match, attribute, value) => `${attribute}="${prefixPath(basePath, value)}"`
      )
      .replace(
        /content="([^"]*?\burl=)\/(?!\/)([^"]*)"/g,
        (_match, prefix, value) => `content="${prefix}${prefixPath(basePath, value)}"`
      )
      .replace(/<base href="[^"]*">/g, `<base href="${ensureTrailingSlash(basePath)}">`);

    if (updated !== original) {
      writeFileSync(filePath, updated);
    }
  }
}

function walkFiles(root) {
  const entries = readdirSync(root);
  const results = [];

  for (const entry of entries) {
    const entryPath = join(root, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      results.push(...walkFiles(entryPath));
      continue;
    }

    results.push(entryPath);
  }

  return results;
}

function prefixPath(basePath, value) {
  return `${ensureTrailingSlash(basePath)}${value}`.replace(/\/{2,}/g, '/');
}

function ensureTrailingSlash(value) {
  return value.endsWith('/') ? value : `${value}/`;
}
