import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validatePlanTurn,
  validateExecTurn,
  validateToolPolicySpec,
  validateToolCallRecord,
  validateChatOrchestrationAudit,
  validateGitHistorySummary,
} from '../src/index.js';

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'examples',
  'agent-turns',
);

function readFixture(name: string) {
  const file = path.join(fixturesDir, name);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

test('valid plan fixture passes', () => {
  const out = validatePlanTurn(readFixture('plan.valid.json'));
  assert.equal(out.ok, true);
});

test('invalid plan fixture fails', () => {
  const out = validatePlanTurn(readFixture('plan.invalid.missing-checks.json'));
  assert.equal(out.ok, false);
  assert.ok(out.issues.length > 0);
  assert.ok(out.issues.every((issue) => issue.code.startsWith('SCHEMA_')));
});

test('valid exec fixture passes', () => {
  const out = validateExecTurn(readFixture('exec.valid.json'));
  assert.equal(out.ok, true);
});

test('policy and tool-call fixtures pass', () => {
  const policy = validateToolPolicySpec(readFixture('tool-policy-spec.valid.json'));
  const call = validateToolCallRecord(readFixture('tool-call-record.valid.json'));
  assert.equal(policy.ok, true);
  assert.equal(call.ok, true);
});

test('invalid tool policy fixture returns deterministic issue code', () => {
  const out = validateToolPolicySpec(readFixture('tool-policy-spec.invalid.missing-required.json'));
  assert.equal(out.ok, false);
  assert.ok(out.issues.some((issue) => issue.code === 'SCHEMA_REQUIRED'));
});

test('invalid tool call fixture returns deterministic issue code', () => {
  const out = validateToolCallRecord(readFixture('tool-call-record.invalid.bad-status.json'));
  assert.equal(out.ok, false);
  assert.ok(out.issues.some((issue) => issue.code === 'SCHEMA_ENUM'));
});

test('chat orchestration audit fixtures validate deterministically', () => {
  const valid = validateChatOrchestrationAudit(readFixture('chat-orchestration-audit.valid.json'));
  assert.equal(valid.ok, true);

  const invalid = validateChatOrchestrationAudit(readFixture('chat-orchestration-audit.invalid.missing-trace.json'));
  assert.equal(invalid.ok, false);
  assert.ok(invalid.issues.some((issue) => issue.code === 'SCHEMA_REQUIRED'));
});

test('git history summary fixture validates', () => {
  const out = validateGitHistorySummary(readFixture('git-history-summary.valid.json'));
  assert.equal(out.ok, true);
});
