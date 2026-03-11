import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateGraphMemoryNode,
  validateMemoryPromotionEnvelope,
  validateStructuralGraphQuery,
} from '../src/index.js';

const conformanceDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'conformance',
  'graph-memory',
);

function readFixture(name: string) {
  return JSON.parse(fs.readFileSync(path.join(conformanceDir, name), 'utf8'));
}

test('conformance fixtures: valid payloads pass', () => {
  assert.equal(validateGraphMemoryNode(readFixture('graph-memory-node.valid.json')).ok, true);
  assert.equal(validateStructuralGraphQuery(readFixture('structural-graph-query.valid.json')).ok, true);
  assert.equal(validateMemoryPromotionEnvelope(readFixture('memory-promotion-envelope.valid.json')).ok, true);
});

test('conformance fixtures: invalid payloads fail deterministically', () => {
  const invalidPromotion = validateMemoryPromotionEnvelope(
    readFixture('memory-promotion-envelope.invalid.experimental-promote.json'),
  );
  assert.equal(invalidPromotion.ok, false);
  assert.ok(invalidPromotion.issues.some((issue) => issue.path === '/validationStatus'));
});
