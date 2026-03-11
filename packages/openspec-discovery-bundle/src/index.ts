export * from '@astrospec/reasoning';
export {
  STARBURST_GRAPH_NODE_TYPES,
  STARBURST_GRAPH_RELATIONSHIPS,
  graphMemoryDefsSchema,
  graphMemoryNodeSchema,
  memoryPromotionEnvelopeSchema,
  structuralGraphMatchSchema,
  structuralGraphQuerySchema,
  validateGraphMemoryNode,
  validateMemoryPromotionEnvelope,
  validateStructuralGraphMatch,
  validateStructuralGraphQuery,
} from '@astrospec/graph-memory';
export type {
  AbstractionNode,
  CandidateArchitectureNode,
  ConstraintNode,
  DomainNode,
  EvaluationNode,
  GraphMemoryNode,
  GraphMemoryNodeBase,
  GraphMemoryNodeType,
  GraphValidationStatus,
  MappingNode,
  MemoryPromotionEnvelope,
  OutcomeNode,
  PatternNode,
  PromptNode,
  StarburstGraphRelationship,
  StructuralGraphMatch,
  StructuralGraphQuery,
} from '@astrospec/graph-memory';
export {
  ASTROSPEC_STARBURST_CONTRACT_KINDS,
  abstractionOutputSchema,
  analogicalMappingSchema,
  domainPatternSchema,
  evaluationRoundSchema,
  evaluationScoreSchema,
  hypothesisCandidateSchema,
  mutationLineageSchema,
  refinementHistorySchema,
  starburstDefsSchema,
  synthesisOutputSchema,
  validateAbstractionOutput,
  validateAnalogicalMapping,
  validateDomainPattern,
  validateEvaluationRound,
  validateEvaluationScore,
  validateHypothesisCandidate,
  validateMutationLineage,
  validateRefinementHistory,
  validateStarburstContract,
  validateSynthesisOutput,
} from '@astrospec/starburst-profile';
export type {
  AbstractionOutput,
  AnalogicalMapping,
  AstroSpecStarburstContractKind,
  DomainPattern,
  EvaluationRound,
  EvaluationScore,
  HypothesisCandidate,
  MappingCorrespondence,
  MutationLineage,
  RefinementHistory,
  SynthesisOutput,
} from '@astrospec/starburst-profile';
export {
  runtimeInterfaceDescriptorSchema,
  validateRuntimeInterfaceDescriptor,
} from '@astrospec/runtime-interfaces';
export type {
  ConstellationExecutor,
  ContractExecutionContext,
  ContractExecutionHook,
  DiscoveryWorkflowAdapter,
  GraphMemoryProvider,
  ReasoningRuntimeAdapter,
  RuntimeInterfaceDescriptor,
} from '@astrospec/runtime-interfaces';

import type { ReasoningTask } from '@astrospec/reasoning';
import { validateReasoningTask } from '@astrospec/reasoning';
import type { StructuralGraphQuery } from '@astrospec/graph-memory';
import { validateStructuralGraphQuery } from '@astrospec/graph-memory';
import type { EvaluationScore } from '@astrospec/starburst-profile';
import { validateEvaluationScore } from '@astrospec/starburst-profile';
import type { RuntimeInterfaceDescriptor } from '@astrospec/runtime-interfaces';
import { validateRuntimeInterfaceDescriptor } from '@astrospec/runtime-interfaces';

export type DiscoveryBundleContractKind =
  | 'reasoning-task'
  | 'structural-graph-query'
  | 'evaluation-score'
  | 'runtime-interface-descriptor';

export function buildReasoningTask(input: Partial<ReasoningTask> & Pick<ReasoningTask, 'prompt'>): ReasoningTask {
  return {
    taskId: input.taskId ?? `task_${Date.now()}`,
    domainHints: [],
    constraints: [],
    evaluationTargets: [],
    mode: 'default',
    ...input,
  };
}

export function buildStructuralGraphQuery(
  input: Partial<StructuralGraphQuery> & Pick<StructuralGraphQuery, 'abstractionFingerprint'>,
): StructuralGraphQuery {
  return {
    queryId: input.queryId ?? `query_${Date.now()}`,
    topK: 5,
    maxDepth: 2,
    ...input,
  };
}

export function buildEvaluationScore(
  input: Pick<EvaluationScore, 'candidateId' | 'structuralValidity' | 'novelty' | 'feasibility' | 'reusability' | 'confidence'> &
    Partial<EvaluationScore>,
): EvaluationScore {
  return { notes: [], ...input };
}

export function createQuantumCryptoExampleTask(): ReasoningTask {
  return buildReasoningTask({
    taskId: 'task_quantum_crypto',
    prompt: 'How can cryptography be improved for the quantum computing era?',
    objective: 'Produce structurally grounded candidates for post-quantum transition architectures.',
    domainHints: ['security', 'systems', 'biology'],
    constraints: ['portable contracts', 'incremental deployment'],
    evaluationTargets: ['structural validity', 'feasibility', 'reusability'],
  });
}

export function createLegalEvidenceOrganizationExampleTask(): ReasoningTask {
  return buildReasoningTask({
    taskId: 'task_legal_evidence',
    prompt:
      'How should a legal evidence system organize call logs, transcripts, filings, witness statements, and procedural events so they are easier to use in court?',
    objective: 'Produce reusable evidence graph, timeline, and claim linkage candidates.',
    domainHints: ['legal', 'evidence', 'procedure'],
    constraints: ['traceable citations', 'procedural sequencing'],
    evaluationTargets: ['usability', 'structural validity', 'reusability'],
  });
}

export function createAstrologyInsightExampleTask(): ReasoningTask {
  return buildReasoningTask({
    taskId: 'task_astrology_insight',
    prompt:
      'How should an astrology insight engine structure natal chart data, transit analysis, symbolic themes, and event correlations so interpretations are more consistent and reusable over time?',
    objective: 'Produce reusable chart memory and interpretation lineage contracts.',
    domainHints: ['astrology', 'symbolic', 'interpretation'],
    constraints: ['public/private boundary', 'traceable observations'],
    evaluationTargets: ['consistency', 'reusability', 'structural validity'],
  });
}

export function validateDiscoveryContract(
  kind: DiscoveryBundleContractKind,
  value: unknown,
): ReturnType<
  | typeof validateReasoningTask
  | typeof validateStructuralGraphQuery
  | typeof validateEvaluationScore
  | typeof validateRuntimeInterfaceDescriptor
> {
  switch (kind) {
    case 'reasoning-task':
      return validateReasoningTask(value);
    case 'structural-graph-query':
      return validateStructuralGraphQuery(value);
    case 'evaluation-score':
      return validateEvaluationScore(value);
    case 'runtime-interface-descriptor':
      return validateRuntimeInterfaceDescriptor(value as RuntimeInterfaceDescriptor);
  }
}
