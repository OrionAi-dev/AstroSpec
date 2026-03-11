import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function runCli(args, opts = {}) {
  const cliPath = join(process.cwd(), 'dist', 'cli.js');
  const res = spawnSync(process.execPath, [cliPath, ...args], {
    encoding: 'utf8',
    ...opts,
  });
  return res;
}

test('validate + lock + merge + verify smoke', () => {
  const dir = mkdtempSync(join(tmpdir(), 'astrospec-cli-'));
  const ctxPath = join(dir, 'context.json');
  const turnPath = join(dir, 'turn.json');
  const outPath = join(dir, 'output.json');
  const reportPath = join(dir, 'report.json');

  writeFileSync(
    ctxPath,
    JSON.stringify(
      {
        kind: 'context',
        id: 'ctx_test',
        intent: 'cli test',
        scope: { type: 'session' },
        lifespan: { mode: 'session' },
        fields: {},
        acceptanceCriteria: [],
        lockedAt: '2026-02-09T00:00:00.000Z',
      },
      null,
      2,
    ),
  );

  writeFileSync(
    turnPath,
    JSON.stringify(
      {
        kind: 'turn',
        id: 'turn_test',
        intent: 'cli test turn',
        inheritsFrom: 'ctx_test',
        fields: {},
        acceptanceCriteria: [
          {
            id: 'c1',
            description: 'equals object',
            verifier: 'equals',
            params: { value: { ok: true } },
          },
        ],
        lockedAt: '2026-02-09T00:00:00.000Z',
      },
      null,
      2,
    ),
  );

  writeFileSync(outPath, JSON.stringify({ ok: true }, null, 2));

  {
    const res = runCli(['validate', ctxPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
  }
  {
    const res = runCli(['validate', turnPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
  }

  {
    const res = runCli(['lock', turnPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
    const locked = JSON.parse(res.stdout);
    assert.ok(typeof locked.lockedAt === 'string' && locked.lockedAt.length > 0);
    assert.ok(typeof locked.signature === 'string' && locked.signature.startsWith('sha256:'));
  }

  {
    const res = runCli(['merge', '--context', ctxPath, '--turn', turnPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
    const merged = JSON.parse(res.stdout);
    assert.equal(merged.kind, 'turn');
    assert.equal(merged.inheritsFrom, 'ctx_test');
  }

  {
    const res = runCli(['verify', '--turn', turnPath, '--output', outPath, '--write', reportPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    assert.equal(report.overall, true);
    assert.equal(Array.isArray(report.results), true);
    assert.equal(report.results[0].criterionId, 'c1');
  }
});

test('validate-contract and doctor commands', () => {
  const dir = mkdtempSync(join(tmpdir(), 'astrospec-cli-contract-'));
  const planPath = join(dir, 'plan.json');
  const retrievalPath = join(dir, 'retrieval.json');
  writeFileSync(
    planPath,
    JSON.stringify(
      {
        schemaVersion: '1.0',
        intent: 'plan',
        objective: 'demo objective',
        constraints: ['read-only'],
        assumptions: [],
        steps: [
          {
            id: 's1',
            title: 'read repo',
            description: 'baseline',
            acceptanceCheck: 'repo read complete',
            toolIntents: [{ name: 'filesystem.read', mode: 'read' }],
          },
        ],
        riskRollback: [],
        completionChecks: ['done'],
      },
      null,
      2,
    ),
  );
  writeFileSync(
    retrievalPath,
    JSON.stringify(
      {
        query: 'What does the retention policy require?',
        techniques: ['pageindex', 'graph'],
      },
      null,
      2,
    ),
  );

  {
    const res = runCli(['validate-contract', '--kind', 'plan-turn', planPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
  }

  {
    const res = runCli(['validate-contract', '--kind', 'retrieval-request', retrievalPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
  }

  {
    const res = runCli(['validate', retrievalPath]);
    assert.equal(res.status, 0, res.stderr || res.stdout);
  }

  {
    const res = runCli(['doctor']);
    assert.equal(res.status, 0, res.stderr || res.stdout);
    const report = JSON.parse(res.stdout);
    assert.ok(Array.isArray(report.packageMap.core));
    assert.ok(report.packageMap.profiles.includes('@astrospec/retrieval-profile'));
  }
});
