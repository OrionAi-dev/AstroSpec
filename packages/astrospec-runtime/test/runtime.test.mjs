import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateContext,
  validateTurn,
  mergeContextIntoTurn,
  lockSpec,
  verifyOutput,
} from '../dist/index.js';

test('schema validation: context/turn pass for minimal objects', async () => {
  const ctx = {
    kind: 'context',
    id: 'ctx:demo',
    intent: 'demo',
    scope: { type: 'session' },
    lifespan: { mode: 'session' },
    fields: {
      tone: { type: 'string', value: 'concise', source: 'user' },
    },
    acceptanceCriteria: [
      {
        id: 'c1',
        description: 'Has status ok',
        verifier: 'equals',
        params: { value: { status: 'ok' } },
        evidence: [
          {
            ref: 'docs/status.json',
            sourceId: 'src:status-doc',
            span: { page: 1, start: 0, end: 12 },
            retrieval: { technique: 'hybrid', stage: 'retrieve', score: 0.98, rank: 1 },
          },
        ],
      },
    ],
    provenance: [
      {
        source: 'user',
        at: '2026-02-09T00:00:00.000Z',
        actor: 'user:demo',
        entityId: 'entity:status',
        activityId: 'activity:collect',
        agentId: 'agent:user',
        role: 'author',
        derivedFrom: ['note:source-1'],
      },
    ],
    lockedAt: '2026-02-09T00:00:00.000Z',
  };

  const turn = {
    kind: 'turn',
    id: 'turn:1',
    intent: 'demo_turn',
    inheritsFrom: ctx.id,
    fields: {
      tone: { type: 'string', value: 'verbose', source: 'user' },
    },
    acceptanceCriteria: [],
    lockedAt: '2026-02-09T00:00:00.000Z',
  };

  assert.equal(validateContext(ctx).ok, true);
  assert.equal(validateTurn(turn).ok, true);

  const merged = mergeContextIntoTurn(ctx, turn);
  assert.equal(merged.fields.tone.value, 'verbose');

  const locked = lockSpec(turn);
  assert.ok(typeof locked.signature === 'string' && locked.signature.startsWith('sha256:'));

  const report = await verifyOutput({
    output: { status: 'ok' },
    criteria: ctx.acceptanceCriteria,
    context: ctx,
    turn,
  });
  assert.equal(report.overall, true);
});
