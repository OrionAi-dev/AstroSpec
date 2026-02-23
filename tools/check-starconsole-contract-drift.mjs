#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repoRoot = process.cwd();
const localSchemasDir = path.join(repoRoot, 'packages', 'mindscript-agent-contracts', 'schemas');
const externalSchemasDir =
  process.env.STARCONSOLE_CONTRACTS_DIR ||
  path.resolve(repoRoot, '..', 'stardrive-monorepo', 'packages', 'starconsole-contracts', 'src', 'contracts', 'schemas');

const pairs = [
  ['plan-turn.schema.json', 'plan-turn.schema.json'],
  ['exec-turn.schema.json', 'exec-turn.schema.json'],
  ['repopack.schema.json', 'repopack.schema.json'],
  ['run-log-entry.schema.json', 'run-log-entry.schema.json'],
];

function digest(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

if (!fs.existsSync(localSchemasDir)) {
  console.error('[contracts] local schema dir missing:', localSchemasDir);
  process.exit(1);
}

if (!fs.existsSync(externalSchemasDir)) {
  console.warn('[contracts] external Starconsole schema dir missing, skipping:', externalSchemasDir);
  process.exit(0);
}

const failures = [];
for (const [localName, extName] of pairs) {
  const localPath = path.join(localSchemasDir, localName);
  const extPath = path.join(externalSchemasDir, extName);
  if (!fs.existsSync(localPath) || !fs.existsSync(extPath)) {
    failures.push(`missing file pair ${localName} <-> ${extName}`);
    continue;
  }
  if (digest(localPath) !== digest(extPath)) {
    failures.push(`${localName} drifted from ${extName}`);
  }
}

if (failures.length > 0) {
  console.error('[contracts] drift detected');
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log('[contracts] no drift detected between mindscript-agent-contracts and starconsole-contracts');
