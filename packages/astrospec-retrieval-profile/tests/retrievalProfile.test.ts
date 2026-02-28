import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ASTROSPEC_RETRIEVAL_ERROR_CODES,
  validateKnowledgeAssertion,
  validateMemoryRecord,
  validateRetrievalContract,
  validateRetrievalRequest,
  validateRetrievalResponse,
  validateRetrievalStreamEvent,
} from '../src/index.js';

const request = {
  requestId: 'req_1',
  query: 'What does the policy say about retention?',
  topK: 5,
  techniques: ['pageindex', 'graph'],
  memoryNamespaces: ['policy'],
  graphScopes: ['compliance'],
  plan: {
    strategy: 'adaptive',
    steps: [
      { id: 'step_1', technique: 'pageindex', purpose: 'find canonical pages', topK: 8 },
      { id: 'step_2', technique: 'graph_expand', purpose: 'expand related obligations', dependsOn: ['step_1'] },
    ],
  },
};

const response = {
  ok: true,
  requestId: 'req_1',
  techniqueRequested: ['pageindex', 'graph'],
  techniqueUsed: ['pageindex', 'graph_expand'],
  results: [
    {
      candidateId: 'cand_1',
      sourceId: 'src_policy_v2',
      ref: 'astrospec://sources/src_policy_v2',
      kind: 'document',
      snippet: 'Records must be retained for seven years.',
      span: { page: 12, start: 0, end: 41 },
      score: 0.92,
      rank: 1,
      stage: 'retrieve',
    },
  ],
  citations: [
    {
      citationId: 'cit_1',
      candidateId: 'cand_1',
      claimId: 'claim_1',
      span: { page: 12, start: 0, end: 41 },
      quote: 'Records must be retained for seven years.',
      confidence: 0.95,
    },
  ],
  grounding: {
    supported: true,
    confidence: 0.95,
  },
  diagnostics: [
    { stage: 'retrieve', technique: 'pageindex', durationMs: 12, inputCount: 1, outputCount: 3 },
    { stage: 'expand', technique: 'graph_expand', durationMs: 7, inputCount: 3, outputCount: 5 },
  ],
};

test('exports deterministic retrieval error codes', () => {
  assert.ok(ASTROSPEC_RETRIEVAL_ERROR_CODES.includes('AS_RETRIEVAL_TIMEOUT'));
  assert.ok(ASTROSPEC_RETRIEVAL_ERROR_CODES.includes('AS_RETRIEVAL_GROUNDING_LOW'));
});

test('valid retrieval request and response pass', () => {
  assert.equal(validateRetrievalRequest(request).ok, true);
  assert.equal(validateRetrievalResponse(response).ok, true);
  assert.equal(validateRetrievalContract('retrieval-request', request).ok, true);
});

test('memory record and knowledge assertion validate', () => {
  const memory = {
    namespace: 'policy',
    key: 'retention.default',
    kind: 'semantic',
    content: { years: 7 },
    updatedAt: '2026-02-28T00:00:00.000Z',
    confidence: 0.88,
    sourceIds: ['src_policy_v2'],
  };
  const assertion = {
    subject: 'policy:retention',
    predicate: 'requiresYears',
    object: 7,
    assertedAt: '2026-02-28T00:00:00.000Z',
    evidence: [
      {
        ref: 'astrospec://sources/src_policy_v2',
        sourceId: 'src_policy_v2',
        span: { page: 12, start: 0, end: 41 },
      },
    ],
  };

  assert.equal(validateMemoryRecord(memory).ok, true);
  assert.equal(validateKnowledgeAssertion(assertion).ok, true);
});

test('invalid technique and invalid citation linkage fail deterministically', () => {
  const badRequest = { ...request, techniques: ['pageindex', 'bogus-technique'] };
  const badResponse = {
    ...response,
    citations: [{ citationId: 'cit_bad', candidateId: 'cand_missing' }],
  };

  const req = validateRetrievalRequest(badRequest);
  const res = validateRetrievalResponse(badResponse);

  assert.equal(req.ok, false);
  assert.ok(req.issues.some((issue) => issue.code === 'SCHEMA_ENUM'));
  assert.equal(res.ok, false);
  assert.ok(res.issues.some((issue) => issue.path === '/citations/0/candidateId'));
});

test('retrieval stream event validates', () => {
  const streamEvent = {
    kind: 'final',
    requestId: 'req_1',
    response,
  };

  assert.equal(validateRetrievalStreamEvent(streamEvent).ok, true);
});
