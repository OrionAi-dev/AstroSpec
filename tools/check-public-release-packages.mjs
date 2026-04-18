#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const packagesDir = path.join(repoRoot, 'packages');
const integrationsDir = path.join(packagesDir, 'integrations');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function readManifest(manifestPath) {
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function publicManifestPaths() {
  const rootPaths = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(packagesDir, entry.name, 'package.json'))
    .filter((manifestPath) => fs.existsSync(manifestPath));

  const integrationPaths = fs.existsSync(integrationsDir)
    ? fs
        .readdirSync(integrationsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(integrationsDir, entry.name, 'package.json'))
        .filter((manifestPath) => fs.existsSync(manifestPath))
    : [];

  return [...rootPaths, ...integrationPaths]
    .map((manifestPath) => ({ manifestPath, manifest: readManifest(manifestPath) }))
    .filter(({ manifest }) => manifest.private !== true)
    .sort((left, right) => String(left.manifest.name).localeCompare(String(right.manifest.name)));
}

const publicPackages = publicManifestPaths();

for (const { manifest } of publicPackages) {
  if (!manifest.name) {
    console.error('[release] encountered a public package without a name');
    process.exit(1);
  }
  console.log(`[release] verifying public package ${manifest.name}`);
  run('node', ['tools/run-package-check.mjs', manifest.name]);
}

