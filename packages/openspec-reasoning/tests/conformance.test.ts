import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateReasoningResult,
  validateReasoningTask,
  validateReasoningWorkflowContract,
} from '../src/index.js';

const conformanceDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'conformance',
  'reasoning',
);

function readFixture(name: string) {
  return JSON.parse(fs.readFileSync(path.join(conformanceDir, name), 'utf8'));
}

test('conformance fixtures: valid payloads pass', () => {
  assert.equal(validateReasoningTask(readFixture('reasoning-task.valid.json')).ok, true);
  assert.equal(validateReasoningWorkflowContract(readFixture('reasoning-workflow-contract.valid.json')).ok, true);
  assert.equal(validateReasoningResult(readFixture('reasoning-result.valid.json')).ok, true);
});

test('conformance fixtures: invalid payloads fail deterministically', () => {
  const badTask = validateReasoningTask(readFixture('reasoning-task.invalid.missing-prompt.json'));
  assert.equal(badTask.ok, false);
  assert.ok(badTask.issues.some((issue) => issue.code === 'SCHEMA_REQUIRED'));
});
