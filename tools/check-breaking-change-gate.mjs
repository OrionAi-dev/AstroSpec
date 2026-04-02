#!/usr/bin/env node
import { execSync } from 'node:child_process';

function lines(cmd) {
  try {
    return String(execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }))
      .split('\n')
      .map((v) => v.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const changed = lines('git diff --name-only --cached');
if (changed.length === 0) {
  console.log('[gate] no staged changes, skipping breaking-change gate');
  process.exit(0);
}

const contractTouched = changed.some((p) =>
  p.startsWith('packages/openspec-agent-contracts/schemas/')
  || p === 'packages/mcp-secure-context-mcp-adapter/src/index.ts'
);

if (!contractTouched) {
  console.log('[gate] no contract-surface changes detected');
  process.exit(0);
}

const hasRfcOrChangeset = changed.some((p) => p.startsWith('docs/governance/rfcs/'))
  || changed.some((p) => p.startsWith('.changeset/'));

if (!hasRfcOrChangeset) {
  console.error('[gate] breaking-change gate failed');
  console.error('Contract surface changed but no RFC/changeset is staged.');
  console.error('Add docs/governance/rfcs/<id>.md or a .changeset entry.');
  process.exit(1);
}

console.log('[gate] breaking-change gate passed');
