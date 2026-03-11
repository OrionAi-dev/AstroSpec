import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateContext, validateTurn, validateWithSchema, SCHEMA_IDS } from '../dist/index.js';

const conformanceDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'conformance',
  'core',
);

function readFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(conformanceDir, name), 'utf8'));
}

test('core conformance fixtures validate', () => {
  assert.equal(validateContext(readFixture('context.valid.json')).ok, true);
  assert.equal(validateTurn(readFixture('turn.valid.json')).ok, true);
  assert.equal(validateWithSchema(SCHEMA_IDS.verificationReport, readFixture('verification-report.valid.json')).ok, true);
});
