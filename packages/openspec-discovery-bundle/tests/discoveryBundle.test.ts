import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildEvaluationScore,
  buildReasoningTask,
  buildStructuralGraphQuery,
  createOperationalReviewExampleTask,
  createSecurityModernizationExampleTask,
  validateDiscoveryContract,
} from '../src/index.js';

test('builders produce valid defaults', () => {
  const task = buildReasoningTask({ prompt: 'How should a reasoning system store reusable analogies?' });
  const query = buildStructuralGraphQuery({ abstractionSignature: 'reusable-analogy-memory' });
  const score = buildEvaluationScore({
    candidateId: 'candidate_1',
    structuralValidity: 0.9,
    novelty: 0.5,
    feasibility: 0.7,
    reusability: 0.8,
    confidence: 0.85,
  });

  assert.equal(validateDiscoveryContract('reasoning-task', task).ok, true);
  assert.equal(validateDiscoveryContract('structural-graph-query', query).ok, true);
  assert.equal(validateDiscoveryContract('evaluation-score', score).ok, true);
});

test('example tasks are populated and portable', () => {
  assert.equal(createSecurityModernizationExampleTask().taskId, 'task_security_modernization');
  assert.equal(createOperationalReviewExampleTask().domainHints?.includes('operations'), true);
});
