#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-secure-context-artifacts-'));

const packagesToPack = [
  '@openspec/schema',
  '@openspec/runtime',
  '@mcp-secure-context/core',
  '@mcp-secure-context/openspec',
  '@mcp-secure-context/mcp-adapter',
  '@mcp-secure-context/sdk-typescript',
];

function run(cmd, args, cwd = repoRoot, env = process.env) {
  const result = spawnSync(cmd, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
    throw new Error(`${cmd} ${args.join(' ')} failed with status ${result.status ?? 1}`);
  }
  return result.stdout.trim();
}

function cleanup() {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

try {
  const tarballsDir = path.join(tempRoot, 'tarballs');
  const consumerDir = path.join(tempRoot, 'consumer');
  fs.mkdirSync(tarballsDir, { recursive: true });
  fs.mkdirSync(consumerDir, { recursive: true });

  for (const pkg of packagesToPack) {
    run('pnpm', ['--filter', pkg, 'pack', '--pack-destination', tarballsDir]);
  }

  const dependencyMap = Object.fromEntries(
    fs
      .readdirSync(tarballsDir)
      .filter((entry) => entry.endsWith('.tgz'))
      .map((entry) => {
        const normalized = entry.replace(/-0\.1\.0\.tgz$/, '');
        const pkgName = normalized.startsWith('openspec-')
          ? `@openspec/${normalized.replace(/^openspec-/, '')}`
          : `@mcp-secure-context/${normalized.replace(/^mcp-secure-context-/, '')}`;
        return [pkgName, `file:${path.join(tarballsDir, entry)}`];
      }),
  );

  fs.writeFileSync(
    path.join(consumerDir, 'package.json'),
    JSON.stringify(
      {
        name: 'secure-context-artifact-smoke',
        private: true,
        type: 'module',
        dependencies: dependencyMap,
        pnpm: {
          overrides: dependencyMap,
        },
      },
      null,
      2,
    ),
  );

  run('pnpm', ['install'], consumerDir);

  const smokeScript = `
    import {
      createContextContainer,
      validateContainer,
      digestContextContainer,
      verifyContainer,
      shareContainer
    } from '@mcp-secure-context/sdk-typescript';
    import { digestContextContainer as digestFromOpenSpec } from '@mcp-secure-context/openspec';

    const container = createContextContainer({
      containerType: 'task_state',
      id: 'task-smoke',
      payload: {
        taskId: 'task-smoke',
        goal: 'prove the packed SDK is consumable',
        status: 'blocked',
        blockingReasons: ['awaiting external confirmation'],
        recommendedAction: 'handoff to the receiving tool',
        attentionState: 'needs_attention',
        artifactRefs: ['artifact://draft-1'],
        decisionRefs: ['decision://review-1'],
        nextStepRefs: ['next://handoff-1']
      },
      policy: {
        audience: ['agent'],
        allowedActions: ['read']
      },
      provenance: {
        createdAt: '2026-04-17T00:00:00.000Z',
        createdBy: 'agent://smoke'
      }
    });

    const validation = validateContainer(container);
    if (!validation.ok) {
      throw new Error('validation failed');
    }

    const digestA = digestContextContainer(container);
    const digestB = digestFromOpenSpec(container);
    if (digestA !== digestB || !digestA.startsWith('sha256:')) {
      throw new Error('digest mismatch');
    }

    const verification = await verifyContainer(container);
    if (!verification.ok || verification.result.containerId !== 'task-smoke') {
      throw new Error('verification failed');
    }

    const share = await shareContainer(container);
    if (!share.ok || !String(share.result.uri).startsWith('mcp-secure-context://')) {
      throw new Error('share failed');
    }

    console.log('secure-context packed artifact smoke ok');
  `;

  run('node', ['--input-type=module', '--eval', smokeScript], consumerDir, {
    ...process.env,
    NODE_ENV: 'test',
  });
} finally {
  cleanup();
}
