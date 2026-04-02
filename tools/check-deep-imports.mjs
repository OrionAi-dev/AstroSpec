#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const publicPackageDirs = [
  'packages/mcp-secure-context-core',
  'packages/mcp-secure-context-openspec',
  'packages/mcp-secure-context-mcp-adapter',
  'packages/mcp-secure-context-sdk-typescript',
  'packages/mcp-secure-context-extensions-openspec',
  'packages/mcp-secure-context-cli',
  'packages/openspec-schema',
  'packages/openspec-runtime',
  'packages/openspec-retrieval-profile',
  'packages/openspec-reasoning',
  'packages/openspec-graph-memory',
  'packages/openspec-starburst-profile',
  'packages/openspec-runtime-interfaces',
  'packages/openspec-discovery-bundle',
  'packages/openspec-kit',
  'packages/openspec-cli',
  'packages/openspec-agent-contracts',
  'packages/integrations/mindql-core',
  'packages/integrations/mindgraphql-core',
  'packages/integrations/audio-openai',
  'packages/integrations/events',
];

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

function findDeepImports(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const out = [];
  const importRe = /(import\s+[^'"`]*from\s+['"]([^'"`]+)['"]|import\s*\(\s*['"]([^'"`]+)['"]\s*\)|require\(\s*['"]([^'"`]+)['"]\s*\))/g;
  let m;
  while ((m = importRe.exec(text))) {
    const spec = m[2] || m[3] || m[4] || '';
    if (!spec.startsWith('@openspec/') && !spec.startsWith('@mcp-secure-context/')) continue;
    const afterScope = spec.startsWith('@openspec/')
      ? spec.replace(/^@openspec\//, '')
      : spec.replace(/^@mcp-secure-context\//, '');
    if (!afterScope.includes('/')) continue;
    out.push(spec);
  }
  return out;
}

const failures = [];
for (const relDir of publicPackageDirs) {
  const absDir = path.join(repoRoot, relDir);
  for (const filePath of listSourceFiles(absDir)) {
    for (const spec of findDeepImports(filePath)) {
      failures.push(`${path.relative(repoRoot, filePath)} uses deep import: ${spec}`);
    }
  }
}

if (failures.length > 0) {
  console.error('[imports] deep import violations detected');
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  console.error('Use public package roots only (for example: @openspec/runtime).');
  process.exit(1);
}

console.log('[imports] deep import checks passed');
