import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateAbstractionOutput,
  validateEvaluationRound,
  validateSynthesisOutput,
} from '../src/index.js';

const conformanceDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'conformance',
  'starburst-profile',
);

function readFixture(name: string) {
  return JSON.parse(fs.readFileSync(path.join(conformanceDir, name), 'utf8'));
}

test('conformance fixtures: valid payloads pass', () => {
  assert.equal(validateAbstractionOutput(readFixture('abstraction-output.valid.json')).ok, true);
  assert.equal(validateEvaluationRound(readFixture('evaluation-round.valid.json')).ok, true);
  assert.equal(validateSynthesisOutput(readFixture('synthesis-output.valid.json')).ok, true);
});

test('conformance fixtures: invalid payloads fail deterministically', () => {
  const invalidRound = validateEvaluationRound(readFixture('evaluation-round.invalid.unknown-candidate.json'));
  assert.equal(invalidRound.ok, false);
  assert.ok(invalidRound.issues.some((issue) => issue.path === '/scores/0/candidateId'));
});
