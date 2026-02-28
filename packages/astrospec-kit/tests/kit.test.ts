import test from 'node:test';
import assert from 'node:assert/strict';

import { callTool, validate, validateRetrieval } from '@astrospec/kit';

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

test('callTool forwards to MCP contract validate tool', async () => {
  const out = await callTool('astrospec.contract.validate', {
    kind: 'run-log-entry',
    payload: {
      id: 'log_1',
      runId: 'run_1',
      phase: 'run.start',
      createdAt: new Date().toISOString(),
      status: 'ok',
    },
  });

  assert.equal(out.ok, true);
});

test('callTool forwards retrieval query tool', async () => {
  const out = await callTool('astrospec.retrieval.query', {
    request: {
      query: 'Find the retention policy',
      techniques: ['pageindex'],
    },
  });

  assert.equal(out.ok, true);
});
