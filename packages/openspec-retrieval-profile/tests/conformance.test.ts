import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateKnowledgeAssertion,
  validateMemoryRecord,
  validateRetrievalRequest,
  validateRetrievalResponse,
  validateRetrievalStreamEvent,
} from '../src/index.js';

const conformanceDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'conformance',
  'retrieval-profile',
);

function readFixture(name: string) {
  return JSON.parse(fs.readFileSync(path.join(conformanceDir, name), 'utf8'));
}

test('conformance fixtures: valid payloads pass', () => {
  assert.equal(validateRetrievalRequest(readFixture('retrieval-request.valid.json')).ok, true);
  assert.equal(validateRetrievalResponse(readFixture('retrieval-response.valid.json')).ok, true);
  assert.equal(validateMemoryRecord(readFixture('memory-record.valid.json')).ok, true);
  assert.equal(validateKnowledgeAssertion(readFixture('knowledge-assertion.valid.json')).ok, true);
  assert.equal(validateRetrievalStreamEvent(readFixture('retrieval-stream-event.valid.json')).ok, true);
});

test('conformance fixtures: invalid payloads fail deterministically', () => {
  const badRequest = validateRetrievalRequest(readFixture('retrieval-request.invalid.bad-technique.json'));
  const badResponse = validateRetrievalResponse(readFixture('retrieval-response.invalid.missing-candidate-id.json'));

  assert.equal(badRequest.ok, false);
  assert.ok(badRequest.issues.some((issue) => issue.code === 'SCHEMA_ENUM'));
  assert.equal(badResponse.ok, false);
  assert.ok(badResponse.issues.some((issue) => issue.path === '/citations/0/candidateId'));
});
