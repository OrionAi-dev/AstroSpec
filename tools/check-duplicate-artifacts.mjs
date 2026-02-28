#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const ignoredDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  '.turbo',
  '.next',
  'site',
  'coverage',
]);

const offenders = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs);
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name.includes(' 2.') || entry.name.includes(' 3.')) {
      offenders.push(path.relative(repoRoot, abs));
    }
  }
}

walk(repoRoot);

if (offenders.length > 0) {
  console.error('[hygiene] duplicate artifact filenames detected');
  for (const offender of offenders) {
    console.error(` - ${offender}`);
  }
  process.exit(1);
}

console.log('[hygiene] duplicate artifact filename check passed');
