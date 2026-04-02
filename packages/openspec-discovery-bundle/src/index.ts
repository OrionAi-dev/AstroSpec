export * from '@openspec/reasoning';
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
} from '@openspec/graph-memory';
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
} from '@openspec/graph-memory';
export {
  OPENSPEC_STARBURST_CONTRACT_KINDS,
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
} from '@openspec/starburst-profile';
export type {
  AbstractionOutput,
  AnalogicalMapping,
  OpenSpecStarburstContractKind,
  DomainPattern,
  EvaluationRound,
  EvaluationScore,
  HypothesisCandidate,
  MappingCorrespondence,
  MutationLineage,
  RefinementHistory,
  SynthesisOutput,
} from '@openspec/starburst-profile';
export {
  runtimeInterfaceDescriptorSchema,
  validateRuntimeInterfaceDescriptor,
} from '@openspec/runtime-interfaces';
export type {
  ConstellationExecutor,
  ContractExecutionContext,
  ContractExecutionHook,
  DiscoveryWorkflowAdapter,
  GraphMemoryProvider,
  ReasoningRuntimeAdapter,
  RuntimeInterfaceDescriptor,
} from '@openspec/runtime-interfaces';

import type { ReasoningTask } from '@openspec/reasoning';
import { validateReasoningTask } from '@openspec/reasoning';
import type { StructuralGraphQuery } from '@openspec/graph-memory';
import { validateStructuralGraphQuery } from '@openspec/graph-memory';
import type { EvaluationScore } from '@openspec/starburst-profile';
import { validateEvaluationScore } from '@openspec/starburst-profile';
import type { RuntimeInterfaceDescriptor } from '@openspec/runtime-interfaces';
import { validateRuntimeInterfaceDescriptor } from '@openspec/runtime-interfaces';

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
  input: Partial<StructuralGraphQuery> & Pick<StructuralGraphQuery, 'abstractionSignature'>,
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

export function createSecurityModernizationExampleTask(): ReasoningTask {
  return buildReasoningTask({
    taskId: 'task_security_modernization',
    prompt: 'How should a security platform modernize long-lived protection workflows for new algorithm requirements?',
    objective: 'Produce structurally grounded migration candidates for evolving security architectures.',
    domainHints: ['security', 'systems', 'operations'],
    constraints: ['portable contracts', 'incremental deployment'],
    evaluationTargets: ['structural validity', 'feasibility', 'reusability'],
  });
}

export function createOperationalReviewExampleTask(): ReasoningTask {
  return buildReasoningTask({
    taskId: 'task_operational_review',
    prompt:
      'How should an operational review system organize tickets, logs, transcripts, decision records, and supporting evidence so incidents are easier to assess and replay?',
    objective: 'Produce reusable review graph, timeline, and evidence-linkage candidates.',
    domainHints: ['operations', 'evidence', 'review'],
    constraints: ['traceable citations', 'incremental replay'],
    evaluationTargets: ['usability', 'structural validity', 'reusability'],
  });
}

export function createLongitudinalInterpretationExampleTask(): ReasoningTask {
  return buildReasoningTask({
    taskId: 'task_longitudinal_interpretation',
    prompt:
      'How should an interpretation engine structure recurring observations, evolving themes, and event correlations so outputs are more consistent and reusable over time?',
    objective: 'Produce reusable interpretation memory and refinement lineage contracts.',
    domainHints: ['interpretation', 'patterns', 'analysis'],
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
