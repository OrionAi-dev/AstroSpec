#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const publicPackages = [
  { name: '@mcp-secure-context/core', dir: 'packages/mcp-secure-context-core' },
  { name: '@mcp-secure-context/openspec', dir: 'packages/mcp-secure-context-openspec' },
  { name: '@mcp-secure-context/mcp-adapter', dir: 'packages/mcp-secure-context-mcp-adapter' },
  { name: '@mcp-secure-context/sdk-typescript', dir: 'packages/mcp-secure-context-sdk-typescript' },
  { name: '@mcp-secure-context/extensions-openspec', dir: 'packages/mcp-secure-context-extensions-openspec' },
  { name: '@mcp-secure-context/cli', dir: 'packages/mcp-secure-context-cli' },
  { name: '@openspec/schema', dir: 'packages/openspec-schema' },
  { name: '@openspec/runtime', dir: 'packages/openspec-runtime' },
  { name: '@openspec/retrieval-profile', dir: 'packages/openspec-retrieval-profile' },
  { name: '@openspec/reasoning', dir: 'packages/openspec-reasoning' },
  { name: '@openspec/graph-memory', dir: 'packages/openspec-graph-memory' },
  { name: '@openspec/starburst-profile', dir: 'packages/openspec-starburst-profile' },
  { name: '@openspec/runtime-interfaces', dir: 'packages/openspec-runtime-interfaces' },
  { name: '@openspec/discovery-bundle', dir: 'packages/openspec-discovery-bundle' },
  { name: '@openspec/kit', dir: 'packages/openspec-kit' },
  { name: '@openspec/cli', dir: 'packages/openspec-cli' },
  { name: '@openspec/agent-contracts', dir: 'packages/openspec-agent-contracts' },
  { name: '@openspec/mindql-core', dir: 'packages/integrations/mindql-core' },
  { name: '@openspec/mindgraphql-core', dir: 'packages/integrations/mindgraphql-core' },
  { name: '@openspec/integration-audio-openai', dir: 'packages/integrations/audio-openai' },
  { name: '@openspec/integration-events', dir: 'packages/integrations/events' },
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
