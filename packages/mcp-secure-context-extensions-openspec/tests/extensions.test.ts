import test from 'node:test';
import assert from 'node:assert/strict';

import { validate, validateRetrieval } from '@mcp-secure-context/extensions-astrospec';

test('validate returns deterministic hint for invalid plan-turn', () => {
  const out = validate('plan-turn', {});
  assert.equal(out.ok, false);
  assert.equal(typeof out.nextHint, 'string');
  assert.ok((out.nextHint ?? '').length > 0);
});

test('validateRetrieval returns deterministic hint for invalid retrieval-request', () => {
  const out = validateRetrieval('retrieval-request', {});
  assert.equal(out.ok, false);
  assert.equal(typeof out.nextHint, 'string');
  assert.ok((out.nextHint ?? '').includes('retrieval request'));
});
