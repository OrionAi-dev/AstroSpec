import test from 'node:test';
import assert from 'node:assert/strict';

import {
  callSecureContext,
  createContextContainer,
  digestContextContainer,
  shareContainer,
  validateContainer,
  verifyContainer,
} from '@mcp-secure-context/sdk-typescript';

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

test('digestContextContainer returns a deterministic digest through the SDK surface', () => {
  const container = createContextContainer({
    containerType: 'task_state',
    id: 'task-2',
    payload: {
      taskId: 'task-2',
      goal: 'export a bounded handoff',
      status: 'blocked',
      blockingReasons: ['awaiting external approval'],
      recommendedAction: 'Request approval from the receiving operator',
      attentionState: 'needs_attention',
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

  const digest = digestContextContainer(container);
  assert.match(digest, /^sha256:/);
});

test('verifyContainer returns stable verification metadata', async () => {
  const container = createContextContainer({
    containerType: 'knowledge_object',
    id: 'ko-1',
    payload: {
      objectId: 'ko-1',
      kind: 'decision_summary',
      title: 'Draft review result',
      summary: 'The draft is ready for bounded handoff.',
      rationaleSummary: 'The supporting report and evidence references are attached.',
      evidenceRefs: ['evidence://source-1'],
      reportRefs: ['report://review-1'],
    },
    policy: {
      audience: ['agent'],
      allowedActions: ['read'],
    },
    provenance: {
      createdAt: new Date().toISOString(),
      createdBy: 'agent://reviewer',
    },
  });

  const out = await verifyContainer(container);
  assert.equal(out.ok, true);
  if (!out.ok) return;
  assert.equal(out.result.containerId, 'ko-1');
  assert.match(out.result.digest, /^sha256:/);
});

test('shareContainer returns share metadata for a validated container', async () => {
  const container = createContextContainer({
    containerType: 'task_state',
    id: 'task-3',
    payload: {
      taskId: 'task-3',
      goal: 'share workflow state',
      status: 'in_progress',
      artifactRefs: ['artifact://draft-1'],
      decisionRefs: ['decision://accept-1'],
      nextStepRefs: ['next://handoff-1'],
    },
    policy: {
      audience: ['agent'],
      allowedActions: ['read'],
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    },
    provenance: {
      createdAt: new Date().toISOString(),
      createdBy: 'agent://planner',
    },
  });

  const out = await shareContainer(container);
  assert.equal(out.ok, true);
  if (!out.ok) return;
  assert.equal(out.result.containerId, 'task-3');
  assert.match(out.result.uri, /^mcp-secure-context:\/\//);
});
