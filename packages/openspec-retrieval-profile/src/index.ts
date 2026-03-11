import type { ErrorObject, ValidateFunction } from 'ajv';
import * as Ajv2020Module from 'ajv/dist/2020.js';
import * as AjvFormatsModule from 'ajv-formats';

import { listSchemas, readSchema } from '@astrospec/schema';
import type { EvidenceRef, EvidenceSpan, JsonValue, ProvenanceEntry } from '@astrospec/runtime';

import retrievalDefsSchema from '../schemas/retrieval-defs-0.1.json' with { type: 'json' };
import retrievalRequestSchema from '../schemas/retrieval-request-0.1.json' with { type: 'json' };
import retrievalResponseSchema from '../schemas/retrieval-response-0.1.json' with { type: 'json' };
import retrievalPlanSchema from '../schemas/retrieval-plan-0.1.json' with { type: 'json' };
import memoryRecordSchema from '../schemas/memory-record-0.1.json' with { type: 'json' };
import knowledgeAssertionSchema from '../schemas/knowledge-assertion-0.1.json' with { type: 'json' };
import retrievalStreamEventSchema from '../schemas/retrieval-stream-event-0.1.json' with { type: 'json' };

export {
  retrievalDefsSchema,
  retrievalRequestSchema,
  retrievalResponseSchema,
  retrievalPlanSchema,
  memoryRecordSchema,
  knowledgeAssertionSchema,
  retrievalStreamEventSchema,
};

export const ASTROSPEC_RETRIEVAL_ERROR_CODES = [
  'AS_RETRIEVAL_INVALID_INPUT',
  'AS_RETRIEVAL_UNSUPPORTED_TECHNIQUE',
  'AS_RETRIEVAL_INDEX_UNAVAILABLE',
  'AS_RETRIEVAL_MEMORY_UNAVAILABLE',
  'AS_RETRIEVAL_NO_EVIDENCE',
  'AS_RETRIEVAL_GROUNDING_LOW',
  'AS_RETRIEVAL_VERIFICATION_FAILED',
  'AS_RETRIEVAL_TIMEOUT',
  'AS_RETRIEVAL_NOT_AUTHORIZED',
] as const;

export type RetrievalReasonCode = (typeof ASTROSPEC_RETRIEVAL_ERROR_CODES)[number];

export const ASTROSPEC_RETRIEVAL_CONTRACT_KINDS = [
  'retrieval-request',
  'retrieval-response',
  'retrieval-plan',
  'memory-record',
  'knowledge-assertion',
  'retrieval-stream-event',
] as const;

export type AstroSpecRetrievalContractKind = (typeof ASTROSPEC_RETRIEVAL_CONTRACT_KINDS)[number];

export type RetrievalTechniqueId =
  | 'keyword'
  | 'vector'
  | 'hybrid'
  | 'pageindex'
  | 'graph'
  | 'graph_expand'
  | 'rerank'
  | 'compress'
  | 'decompose'
  | 'verify'
  | 'multimodal'
  | 'agentic';

export type MemoryKind = 'semantic' | 'episodic' | 'procedural';
export type RetrievalCandidateKind = 'document' | 'memory' | 'graph-node' | 'graph-edge' | 'artifact' | 'table' | 'image';
export type RetrievalCandidateStage = 'retrieve' | 'expand' | 'rerank' | 'compress' | 'verify';

export interface RetrievalPlanStep {
  id: string;
  technique: RetrievalTechniqueId;
  purpose?: string;
  topK?: number;
  filters?: Record<string, JsonValue>;
  dependsOn?: string[];
}

export interface RetrievalPlan {
  strategy?: 'parallel' | 'sequential' | 'adaptive';
  notes?: string;
  steps: RetrievalPlanStep[];
}

export interface RetrievalStageTrace {
  stage: RetrievalCandidateStage;
  technique?: RetrievalTechniqueId;
  durationMs?: number;
  inputCount?: number;
  outputCount?: number;
  notes?: string;
}

export interface RetrievalCandidate {
  candidateId: string;
  sourceId: string;
  ref: string;
  kind: RetrievalCandidateKind;
  title?: string;
  mimeType?: string;
  snippet?: string;
  span?: EvidenceSpan;
  score?: number;
  rank?: number;
  stage: RetrievalCandidateStage;
  metadata?: Record<string, JsonValue>;
  provenance?: ProvenanceEntry[];
}

export interface RetrievalCitation {
  citationId: string;
  candidateId: string;
  claimId?: string;
  label?: string;
  span?: EvidenceSpan;
  quote?: string;
  confidence?: number;
}

export interface GroundingAssessment {
  supported: boolean;
  confidence?: number;
  missingEvidence?: string[];
  unsupportedClaims?: string[];
}

export interface RetrievalFallback {
  applied: boolean;
  from?: string;
  to?: string;
  reason?: string;
}

export interface RetrievalError {
  code: RetrievalReasonCode;
  message: string;
  details?: Record<string, JsonValue>;
}

export interface RetrievalRequest {
  requestId?: string;
  query: string;
  topK?: number;
  techniques?: RetrievalTechniqueId[];
  filters?: Record<string, JsonValue>;
  contextRef?: string;
  memoryNamespaces?: string[];
  graphScopes?: string[];
  plan?: RetrievalPlan;
  stream?: boolean;
  meta?: Record<string, JsonValue>;
}

export interface RetrievalResponse {
  ok: boolean;
  requestId: string;
  techniqueRequested?: RetrievalTechniqueId[];
  techniqueUsed: RetrievalTechniqueId[];
  fallback?: RetrievalFallback;
  results: RetrievalCandidate[];
  citations: RetrievalCitation[];
  grounding?: GroundingAssessment;
  diagnostics?: RetrievalStageTrace[];
  error?: RetrievalError;
}

export interface MemoryRecord {
  namespace: string;
  key: string;
  kind: MemoryKind;
  content: JsonValue;
  updatedAt: string;
  confidence?: number;
  sourceIds?: string[];
}

export interface KnowledgeAssertion {
  subject: string;
  predicate: string;
  object: JsonValue;
  confidence?: number;
  assertedAt: string;
  evidence?: ReadonlyArray<EvidenceRef>;
}

export type RetrievalStreamEvent =
  | {
      kind: 'status-update';
      requestId: string;
      status: {
        state: 'submitted' | 'working' | 'input-required' | 'completed' | 'failed';
        message?: string;
        timestamp: string;
      };
      final?: boolean;
    }
  | {
      kind: 'candidate-update';
      requestId: string;
      candidate: RetrievalCandidate;
      append?: boolean;
      lastChunk?: boolean;
    }
  | {
      kind: 'final';
      requestId: string;
      response: RetrievalResponse;
    };

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

export type ValidationIssue = {
  code: ValidationIssueCode;
  path: string;
  message: string;
  keyword: string;
  schemaPath: string;
};

export type ValidationResult<T = unknown> = {
  ok: boolean;
  errors: string[];
  issues: ValidationIssue[];
  value?: T;
};

const Ajv2020 = (Ajv2020Module as unknown as { default: new (opts?: unknown) => any }).default;
const ajv = new Ajv2020({ allErrors: true, strict: false });
const addFormats = (AjvFormatsModule as unknown as { default?: (ajv: unknown) => void }).default
  ?? (AjvFormatsModule as unknown as (ajv: unknown) => void);
addFormats(ajv);

for (const schemaName of listSchemas()) {
  ajv.addSchema(readSchema(schemaName));
}
ajv.addSchema(retrievalDefsSchema);
ajv.addSchema(retrievalRequestSchema);
ajv.addSchema(retrievalResponseSchema);
ajv.addSchema(retrievalPlanSchema);
ajv.addSchema(memoryRecordSchema);
ajv.addSchema(knowledgeAssertionSchema);
ajv.addSchema(retrievalStreamEventSchema);

const validators = {
  retrievalRequest: ajv.compile(retrievalRequestSchema),
  retrievalResponse: ajv.compile(retrievalResponseSchema),
  retrievalPlan: ajv.compile(retrievalPlanSchema),
  memoryRecord: ajv.compile(memoryRecordSchema),
  knowledgeAssertion: ajv.compile(knowledgeAssertionSchema),
  retrievalStreamEvent: ajv.compile(retrievalStreamEventSchema),
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
    schemaPath: 'astrospec.retrieval.semantic',
  };
}

function validateCitationLinkage(response: RetrievalResponse): ValidationIssue[] {
  const candidateIds = new Set(response.results.map((candidate) => candidate.candidateId));
  const issues: ValidationIssue[] = [];
  for (let i = 0; i < response.citations.length; i++) {
    const citation = response.citations[i];
    if (!candidateIds.has(citation.candidateId)) {
      issues.push(
        makeIssue(
          `/citations/${i}/candidateId`,
          `citation references unknown candidateId: ${citation.candidateId}`,
        ),
      );
    }
  }
  return issues;
}

export function validateRetrievalRequest(value: unknown): ValidationResult<RetrievalRequest> {
  return runValidation<RetrievalRequest>(validators.retrievalRequest, value);
}

export function validateRetrievalResponse(value: unknown): ValidationResult<RetrievalResponse> {
  const result = runValidation<RetrievalResponse>(validators.retrievalResponse, value);
  if (!result.ok || !result.value) return result;
  const linkageIssues = validateCitationLinkage(result.value);
  if (linkageIssues.length === 0) return result;
  return {
    ok: false,
    errors: summarizeText(linkageIssues),
    issues: linkageIssues,
  };
}

export function validateRetrievalPlan(value: unknown): ValidationResult<RetrievalPlan> {
  return runValidation<RetrievalPlan>(validators.retrievalPlan, value);
}

export function validateMemoryRecord(value: unknown): ValidationResult<MemoryRecord> {
  return runValidation<MemoryRecord>(validators.memoryRecord, value);
}

export function validateKnowledgeAssertion(value: unknown): ValidationResult<KnowledgeAssertion> {
  return runValidation<KnowledgeAssertion>(validators.knowledgeAssertion, value);
}

export function validateRetrievalStreamEvent(value: unknown): ValidationResult<RetrievalStreamEvent> {
  const result = runValidation<RetrievalStreamEvent>(validators.retrievalStreamEvent, value);
  if (!result.ok || !result.value) return result;
  if (result.value.kind !== 'final') return result;
  const responseValidation = validateRetrievalResponse(result.value.response);
  if (responseValidation.ok) return result;
  return {
    ok: false,
    errors: responseValidation.errors,
    issues: responseValidation.issues,
  };
}

export function validateRetrievalContract(
  kind: AstroSpecRetrievalContractKind,
  value: unknown,
): ValidationResult<
  RetrievalRequest | RetrievalResponse | RetrievalPlan | MemoryRecord | KnowledgeAssertion | RetrievalStreamEvent
> {
  switch (kind) {
    case 'retrieval-request':
      return validateRetrievalRequest(value);
    case 'retrieval-response':
      return validateRetrievalResponse(value);
    case 'retrieval-plan':
      return validateRetrievalPlan(value);
    case 'memory-record':
      return validateMemoryRecord(value);
    case 'knowledge-assertion':
      return validateKnowledgeAssertion(value);
    case 'retrieval-stream-event':
      return validateRetrievalStreamEvent(value);
  }
}
