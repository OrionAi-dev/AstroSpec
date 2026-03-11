import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ASTROSPEC_STARBURST_CONTRACT_KINDS,
  validateEvaluationRound,
  validateStarburstContract,
  validateSynthesisOutput,
} from '../src/index.js';

const synthesis = {
  synthesisId: 'synthesis_1',
  summary: 'Claim graphs and timelines converge into a reusable legal evidence architecture.',
  selectedCandidateIds: ['candidate_evidence_graph'],
};

test('exports deterministic starburst contract kinds', () => {
  assert.ok(ASTROSPEC_STARBURST_CONTRACT_KINDS.includes('synthesis-output'));
  assert.ok(ASTROSPEC_STARBURST_CONTRACT_KINDS.includes('evaluation-round'));
});

test('valid synthesis output and contract switch pass', () => {
  assert.equal(validateSynthesisOutput(synthesis).ok, true);
  assert.equal(validateStarburstContract('synthesis-output', synthesis).ok, true);
});

test('evaluation round rejects score entries that do not belong to the round', () => {
  const validation = validateEvaluationRound({
    roundId: 'round_1',
    candidateIds: ['candidate_1'],
    scores: [
      {
        candidateId: 'candidate_2',
        structuralValidity: 0.9,
        novelty: 0.5,
        feasibility: 0.7,
        reusability: 0.8,
        confidence: 0.9,
      },
    ],
  });

  assert.equal(validation.ok, false);
  assert.ok(validation.issues.some((issue) => issue.path === '/scores/0/candidateId'));
});
