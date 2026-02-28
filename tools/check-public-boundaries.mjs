#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const publicPackages = [
  { name: '@astrospec/schema', dir: 'packages/astrospec-schema' },
  { name: '@astrospec/runtime', dir: 'packages/astrospec-runtime' },
  { name: '@astrospec/mcp-profile', dir: 'packages/astrospec-mcp-profile' },
  { name: '@astrospec/retrieval-profile', dir: 'packages/astrospec-retrieval-profile' },
  { name: '@astrospec/kit', dir: 'packages/astrospec-kit' },
  { name: '@astrospec/cli', dir: 'packages/astrospec-cli' },
  { name: '@astrospec/agent-contracts', dir: 'packages/astrospec-agent-contracts' },
];

const forbiddenScopes = ['@orionai/', '@stardrive/', '@telescope/'];

function listSourceFiles(absDir) {
  const srcDir = path.join(absDir, 'src');
  if (!fs.existsSync(srcDir)) return [];
  const out = [];
  const stack = [srcDir];
  while (stack.length) {
    const dir = stack.pop();
    if (!dir) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(abs);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!/\.(ts|tsx|mts|cts|js|mjs|cjs)$/.test(entry.name)) continue;
      out.push(abs);
    }
  }
  return out;
}

function findForbiddenImports(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const hits = [];
  const importRe = /(import\s+[^'"`]*from\s+['"]([^'"`]+)['"]|import\s*\(\s*['"]([^'"`]+)['"]\s*\)|require\(\s*['"]([^'"`]+)['"]\s*\))/g;
  let m;
  while ((m = importRe.exec(text))) {
    const spec = m[2] || m[3] || m[4] || '';
    if (forbiddenScopes.some((scope) => spec.startsWith(scope))) {
      hits.push(spec);
    }
  }
  return hits;
}

const failures = [];
for (const pkg of publicPackages) {
  const absDir = path.join(repoRoot, pkg.dir);
  const files = listSourceFiles(absDir);
  for (const filePath of files) {
    const hits = findForbiddenImports(filePath);
    for (const spec of hits) {
      failures.push(`${path.relative(repoRoot, filePath)} imports forbidden scope dependency: ${spec}`);
    }
  }
}

if (failures.length > 0) {
  console.error('[boundaries] public package boundary violations detected');
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log('[boundaries] public package boundary checks passed');
