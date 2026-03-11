import test from 'node:test';
import assert from 'node:assert/strict';

import { callSecureContext, createContextContainer, validate, validateContainer, validateRetrieval } from '@astrospec/kit';

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

test('createContextContainer builds a valid task-state container', () => {
  const container = createContextContainer({
    containerType: 'task_state',
    id: 'task-1',
    payload: {
      taskId: 'task-1',
      goal: 'handoff context',
      status: 'in_progress',
    },
    policy: {
      audience: ['agent'],
      allowedActions: ['read'],
    },
    provenance: {
      createdAt: new Date().toISOString(),
      createdBy: 'agent://planner',
    },
  });

  const result = validateContainer(container);
  assert.equal(result.ok, true);
});

test('callSecureContext validates portable containers', async () => {
  const container = createContextContainer({
    containerType: 'user_context',
    id: 'user-1',
    payload: {
      userId: 'user-1',
    },
    policy: {
      audience: ['agent'],
      allowedActions: ['read'],
    },
    provenance: {
      createdAt: new Date().toISOString(),
      createdBy: 'agent://planner',
    },
  });

  const out = await callSecureContext('mcp_secure_context.container.validate', { container });
  assert.equal(out.ok, true);
});
