import type { ErrorObject, ValidateFunction } from 'ajv';
import * as Ajv2020Module from 'ajv/dist/2020.js';
import * as AjvFormatsModule from 'ajv-formats';

import { listSchemas, readSchema } from '@astrospec/schema';
import {
  knowledgeAssertionSchema,
  memoryRecordSchema,
  retrievalDefsSchema,
} from '@astrospec/retrieval-profile';
import type { KnowledgeAssertion, MemoryRecord } from '@astrospec/retrieval-profile';

import graphMemoryDefsSchema from '../schemas/graph-memory-defs-0.1.json' with { type: 'json' };
import graphMemoryNodeSchema from '../schemas/graph-memory-node-0.1.json' with { type: 'json' };
import structuralGraphQuerySchema from '../schemas/structural-graph-query-0.1.json' with { type: 'json' };
import structuralGraphMatchSchema from '../schemas/structural-graph-match-0.1.json' with { type: 'json' };
import memoryPromotionEnvelopeSchema from '../schemas/memory-promotion-envelope-0.1.json' with { type: 'json' };

export {
  graphMemoryDefsSchema,
  graphMemoryNodeSchema,
  structuralGraphQuerySchema,
  structuralGraphMatchSchema,
  memoryPromotionEnvelopeSchema,
};

export const STARBURST_GRAPH_RELATIONSHIPS = [
  'ABSTRACTED_TO',
  'EXPLORED_BY',
  'CONTRIBUTES_PATTERN',
  'MAPPED_TO',
  'COMBINED_INTO',
  'TESTED_AGAINST',
  'REFINED_INTO',
  'REJECTED_FOR',
  'SUPPORTED_BY',
] as const;

export type StarburstGraphRelationship = (typeof STARBURST_GRAPH_RELATIONSHIPS)[number];

export const STARBURST_GRAPH_NODE_TYPES = [
  'Prompt',
  'Abstraction',
  'Domain',
  'Pattern',
  'Mapping',
  'CandidateArchitecture',
  'Evaluation',
  'Constraint',
  'Outcome',
] as const;

export type GraphMemoryNodeType = (typeof STARBURST_GRAPH_NODE_TYPES)[number];
export type GraphValidationStatus = 'experimental' | 'validated' | 'rejected';

export interface GraphMemoryNodeBase {
  nodeId: string;
  nodeType: GraphMemoryNodeType;
  namespace: string;
  title?: string;
  summary?: string;
  structuralSignature?: string;
  mechanismTags?: string[];
  relationMotifs?: string[];
  validationStatus?: GraphValidationStatus;
  supportingAssertions?: ReadonlyArray<KnowledgeAssertion>;
  memoryRecord?: MemoryRecord;
  refs?: string[];
  ext?: Record<string, unknown>;
}

export interface PromptNode extends GraphMemoryNodeBase {
  nodeType: 'Prompt';
}

export interface AbstractionNode extends GraphMemoryNodeBase {
  nodeType: 'Abstraction';
}

export interface DomainNode extends GraphMemoryNodeBase {
  nodeType: 'Domain';
}

export interface PatternNode extends GraphMemoryNodeBase {
  nodeType: 'Pattern';
}

export interface MappingNode extends GraphMemoryNodeBase {
  nodeType: 'Mapping';
}

export interface CandidateArchitectureNode extends GraphMemoryNodeBase {
  nodeType: 'CandidateArchitecture';
}

export interface EvaluationNode extends GraphMemoryNodeBase {
  nodeType: 'Evaluation';
}

export interface ConstraintNode extends GraphMemoryNodeBase {
  nodeType: 'Constraint';
}

export interface OutcomeNode extends GraphMemoryNodeBase {
  nodeType: 'Outcome';
}

export type GraphMemoryNode =
  | PromptNode
  | AbstractionNode
  | DomainNode
  | PatternNode
  | MappingNode
  | CandidateArchitectureNode
  | EvaluationNode
  | ConstraintNode
  | OutcomeNode;

export interface StructuralGraphQuery {
  queryId?: string;
  abstractionFingerprint: string;
  mechanismTags?: string[];
  topologySignature?: string;
  constraintVector?: string[];
  relationMotifs?: StarburstGraphRelationship[];
  domainHints?: string[];
  maxDepth?: number;
  topK?: number;
  ext?: Record<string, unknown>;
}

export interface StructuralGraphMatch {
  nodeId: string;
  nodeType: GraphMemoryNodeType;
  structuralSimilarity: number;
  motifOverlap?: number;
  reusableConstraints?: string[];
  matchedRelationships?: StarburstGraphRelationship[];
  provenanceRefs?: string[];
  ext?: Record<string, unknown>;
}

export interface MemoryPromotionEnvelope {
  promotionId: string;
  nodeId: string;
  decision: 'promote' | 'hold' | 'reject';
  validationStatus: GraphValidationStatus;
  rationale?: string;
  supportingMatchIds?: string[];
  promotedAt?: string;
  ext?: Record<string, unknown>;
}

export type ValidationIssueCode =
  | 'SCHEMA_REQUIRED'
  | 'SCHEMA_TYPE'
  | 'SCHEMA_ENUM'
  | 'SCHEMA_CONST'
  | 'SCHEMA_FORMAT'
  | 'SCHEMA_MIN_LENGTH'
  | 'SCHEMA_MIN_ITEMS'
  | 'SCHEMA_ADDITIONAL_PROPERTIES'
  | 'SCHEMA_OTHER';

export interface ValidationIssue {
  code: ValidationIssueCode;
  path: string;
  message: string;
  keyword: string;
  schemaPath: string;
}

export interface ValidationResult<T = unknown> {
  ok: boolean;
  errors: string[];
  issues: ValidationIssue[];
  value?: T;
}

const Ajv2020 = (Ajv2020Module as unknown as { default: new (opts?: unknown) => any }).default;
const ajv = new Ajv2020({ allErrors: true, strict: false });
const addFormats = (AjvFormatsModule as unknown as { default?: (ajv: unknown) => void }).default
  ?? (AjvFormatsModule as unknown as (ajv: unknown) => void);
addFormats(ajv);

for (const schemaName of listSchemas()) {
  ajv.addSchema(readSchema(schemaName));
}
ajv.addSchema(retrievalDefsSchema);
ajv.addSchema(memoryRecordSchema);
ajv.addSchema(knowledgeAssertionSchema);
ajv.addSchema(graphMemoryDefsSchema);
ajv.addSchema(graphMemoryNodeSchema);
ajv.addSchema(structuralGraphQuerySchema);
ajv.addSchema(structuralGraphMatchSchema);
ajv.addSchema(memoryPromotionEnvelopeSchema);

const validators = {
  graphMemoryNode: ajv.compile(graphMemoryNodeSchema),
  structuralGraphQuery: ajv.compile(structuralGraphQuerySchema),
  structuralGraphMatch: ajv.compile(structuralGraphMatchSchema),
  memoryPromotionEnvelope: ajv.compile(memoryPromotionEnvelopeSchema),
};

function issueCodeFromKeyword(keyword: string): ValidationIssueCode {
  switch (keyword) {
    case 'required':
      return 'SCHEMA_REQUIRED';
    case 'type':
      return 'SCHEMA_TYPE';
    case 'enum':
      return 'SCHEMA_ENUM';
    case 'const':
      return 'SCHEMA_CONST';
    case 'format':
      return 'SCHEMA_FORMAT';
    case 'minLength':
      return 'SCHEMA_MIN_LENGTH';
    case 'minItems':
      return 'SCHEMA_MIN_ITEMS';
    case 'additionalProperties':
      return 'SCHEMA_ADDITIONAL_PROPERTIES';
    default:
      return 'SCHEMA_OTHER';
  }
}

function summarizeIssues(errors: ErrorObject[] | null | undefined): ValidationIssue[] {
  if (!errors) return [];
  return errors.map((err) => ({
    code: issueCodeFromKeyword(err.keyword),
    path: err.instancePath || '/',
    message: err.message || 'invalid',
    keyword: err.keyword,
    schemaPath: err.schemaPath,
  }));
}

function summarizeText(issues: ValidationIssue[]): string[] {
  return issues.map((issue) => `${issue.path}: ${issue.message}`);
}

function runValidation<T>(validator: ValidateFunction, value: unknown): ValidationResult<T> {
  const ok = validator(value);
  const issues = summarizeIssues(validator.errors);
  return { ok: Boolean(ok), errors: summarizeText(issues), issues, value: ok ? (value as T) : undefined };
}

function makeIssue(path: string, message: string): ValidationIssue {
  return {
    code: 'SCHEMA_OTHER',
    path,
    message,
    keyword: 'semantic',
    schemaPath: 'astrospec.graph_memory.semantic',
  };
}

export function validateGraphMemoryNode(value: unknown): ValidationResult<GraphMemoryNode> {
  return runValidation<GraphMemoryNode>(validators.graphMemoryNode, value);
}

export function validateStructuralGraphQuery(value: unknown): ValidationResult<StructuralGraphQuery> {
  return runValidation<StructuralGraphQuery>(validators.structuralGraphQuery, value);
}

export function validateStructuralGraphMatch(value: unknown): ValidationResult<StructuralGraphMatch> {
  return runValidation<StructuralGraphMatch>(validators.structuralGraphMatch, value);
}

export function validateMemoryPromotionEnvelope(value: unknown): ValidationResult<MemoryPromotionEnvelope> {
  const result = runValidation<MemoryPromotionEnvelope>(validators.memoryPromotionEnvelope, value);
  if (!result.ok || !result.value) return result;
  if (result.value.decision === 'promote' && result.value.validationStatus !== 'validated') {
    const issues = [
      makeIssue(
        '/validationStatus',
        'promotion decision "promote" requires validationStatus to be "validated"',
      ),
    ];
    return { ok: false, errors: summarizeText(issues), issues };
  }
  return result;
}
