import test from 'node:test';
import assert from 'node:assert/strict';

import {
  STARBURST_GRAPH_RELATIONSHIPS,
  validateGraphMemoryNode,
  validateMemoryPromotionEnvelope,
  validateStructuralGraphMatch,
  validateStructuralGraphQuery,
} from '../src/index.js';

const node = {
  nodeId: 'node_1',
  nodeType: 'Abstraction',
  namespace: 'starburst',
  title: 'Legal Evidence Organization',
  validationStatus: 'validated',
};

test('exports deterministic graph relationships', () => {
  assert.ok(STARBURST_GRAPH_RELATIONSHIPS.includes('MAPPED_TO'));
  assert.ok(STARBURST_GRAPH_RELATIONSHIPS.includes('SUPPORTED_BY'));
});

test('valid graph node and structural query pass', () => {
  assert.equal(validateGraphMemoryNode(node).ok, true);
  assert.equal(
    validateStructuralGraphQuery({
      abstractionFingerprint: 'timeline-linked-claim-graph',
      relationMotifs: ['ABSTRACTED_TO', 'SUPPORTED_BY'],
      topK: 3,
    }).ok,
    true,
  );
});

test('promotion rejects non-validated nodes for promotion', () => {
  const validation = validateMemoryPromotionEnvelope({
    promotionId: 'promotion_1',
    nodeId: 'node_1',
    decision: 'promote',
    validationStatus: 'experimental',
  });

  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((issue) => issue.path === '/validationStatus'));
});

test('match schema rejects impossible similarity scores', () => {
  const validation = validateStructuralGraphMatch({
    nodeId: 'node_1',
    nodeType: 'Pattern',
    structuralSimilarity: 1.2,
  });
  assert.equal(validation.ok, false);
  assert.ok(validation.issues.length > 0);
});
