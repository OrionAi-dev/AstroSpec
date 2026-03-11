import type { ErrorObject, ValidateFunction } from 'ajv';
import * as Ajv2020Module from 'ajv/dist/2020.js';
import * as AjvFormatsModule from 'ajv-formats';

import { listSchemas, readSchema } from '@astrospec/schema';
import type { JsonValue } from '@astrospec/runtime';
import type { ReasoningEvidence } from '@astrospec/reasoning';
import { reasoningDefsSchema, reasoningEvidenceSchema } from '@astrospec/reasoning';

import starburstDefsSchema from '../schemas/starburst-defs-0.1.json' with { type: 'json' };
import abstractionOutputSchema from '../schemas/abstraction-output-0.1.json' with { type: 'json' };
import domainPatternSchema from '../schemas/domain-pattern-0.1.json' with { type: 'json' };
import analogicalMappingSchema from '../schemas/analogical-mapping-0.1.json' with { type: 'json' };
import hypothesisCandidateSchema from '../schemas/hypothesis-candidate-0.1.json' with { type: 'json' };
import evaluationScoreSchema from '../schemas/evaluation-score-0.1.json' with { type: 'json' };
import synthesisOutputSchema from '../schemas/synthesis-output-0.1.json' with { type: 'json' };
import mutationLineageSchema from '../schemas/mutation-lineage-0.1.json' with { type: 'json' };
import evaluationRoundSchema from '../schemas/evaluation-round-0.1.json' with { type: 'json' };
import refinementHistorySchema from '../schemas/refinement-history-0.1.json' with { type: 'json' };

export {
  starburstDefsSchema,
  abstractionOutputSchema,
  domainPatternSchema,
  analogicalMappingSchema,
  hypothesisCandidateSchema,
  evaluationScoreSchema,
  synthesisOutputSchema,
  mutationLineageSchema,
  evaluationRoundSchema,
  refinementHistorySchema,
};

export const ASTROSPEC_STARBURST_CONTRACT_KINDS = [
  'abstraction-output',
  'domain-pattern',
  'analogical-mapping',
  'hypothesis-candidate',
  'evaluation-score',
  'synthesis-output',
  'mutation-lineage',
  'evaluation-round',
  'refinement-history',
] as const;

export type AstroSpecStarburstContractKind = (typeof ASTROSPEC_STARBURST_CONTRACT_KINDS)[number];

export interface AbstractionOutput {
  abstractionId: string;
  problemFrame: string;
  invariants?: string[];
  mechanisms?: string[];
  constraints?: string[];
  evaluationTargets?: string[];
  ext?: Record<string, JsonValue>;
}

export interface DomainPattern {
  patternId: string;
  domain: string;
  summary: string;
  structuralElements?: string[];
  observations?: string[];
  supportingEvidence?: ReadonlyArray<ReasoningEvidence>;
  ext?: Record<string, JsonValue>;
}

export interface MappingCorrespondence {
  sourceElement: string;
  targetElement: string;
  relation: string;
}

export interface AnalogicalMapping {
  mappingId: string;
  sourcePatternId: string;
  targetProblem: string;
  correspondences: MappingCorrespondence[];
  mismatchNotes?: string[];
  structuralValidity?: number;
  ext?: Record<string, JsonValue>;
}

export interface HypothesisCandidate {
  candidateId: string;
  title: string;
  description: string;
  mappingIds?: string[];
  constraints?: string[];
  discriminatingTests?: string[];
  ext?: Record<string, JsonValue>;
}

export interface EvaluationScore {
  candidateId: string;
  structuralValidity: number;
  novelty: number;
  feasibility: number;
  reusability: number;
  confidence: number;
  notes?: string[];
  ext?: Record<string, JsonValue>;
}

export interface SynthesisOutput {
  synthesisId: string;
  summary: string;
  selectedCandidateIds: string[];
  recommendedArchitecture?: string;
  unresolvedRisks?: string[];
  supportingEvidence?: ReadonlyArray<ReasoningEvidence>;
  ext?: Record<string, JsonValue>;
}

export interface MutationLineage {
  lineageId: string;
  parentCandidateIds: string[];
  childCandidateId: string;
  mutationNotes?: string[];
  ext?: Record<string, JsonValue>;
}

export interface EvaluationRound {
  roundId: string;
  candidateIds: string[];
  scores: EvaluationScore[];
  skepticNotes?: string[];
  ext?: Record<string, JsonValue>;
}

export interface RefinementHistory {
  historyId: string;
  rounds: EvaluationRound[];
  preservedMotifs?: string[];
  discardedPatterns?: string[];
  ext?: Record<string, JsonValue>;
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
ajv.addSchema(reasoningDefsSchema);
ajv.addSchema(reasoningEvidenceSchema);
ajv.addSchema(starburstDefsSchema);
ajv.addSchema(abstractionOutputSchema);
ajv.addSchema(domainPatternSchema);
ajv.addSchema(analogicalMappingSchema);
ajv.addSchema(hypothesisCandidateSchema);
ajv.addSchema(evaluationScoreSchema);
ajv.addSchema(synthesisOutputSchema);
ajv.addSchema(mutationLineageSchema);
ajv.addSchema(evaluationRoundSchema);
ajv.addSchema(refinementHistorySchema);

const validators = {
  abstractionOutput: ajv.compile(abstractionOutputSchema),
  domainPattern: ajv.compile(domainPatternSchema),
  analogicalMapping: ajv.compile(analogicalMappingSchema),
  hypothesisCandidate: ajv.compile(hypothesisCandidateSchema),
  evaluationScore: ajv.compile(evaluationScoreSchema),
  synthesisOutput: ajv.compile(synthesisOutputSchema),
  mutationLineage: ajv.compile(mutationLineageSchema),
  evaluationRound: ajv.compile(evaluationRoundSchema),
  refinementHistory: ajv.compile(refinementHistorySchema),
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
    schemaPath: 'astrospec.starburst.semantic',
  };
}

function validateEvaluationRoundSemantics(round: EvaluationRound): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const candidateIds = new Set(round.candidateIds);
  for (let i = 0; i < round.scores.length; i++) {
    const score = round.scores[i];
    if (!candidateIds.has(score.candidateId)) {
      issues.push(makeIssue(`/scores/${i}/candidateId`, `unknown candidateId in round: ${score.candidateId}`));
    }
  }
  return issues;
}

export function validateAbstractionOutput(value: unknown): ValidationResult<AbstractionOutput> {
  return runValidation<AbstractionOutput>(validators.abstractionOutput, value);
}

export function validateDomainPattern(value: unknown): ValidationResult<DomainPattern> {
  return runValidation<DomainPattern>(validators.domainPattern, value);
}

export function validateAnalogicalMapping(value: unknown): ValidationResult<AnalogicalMapping> {
  return runValidation<AnalogicalMapping>(validators.analogicalMapping, value);
}

export function validateHypothesisCandidate(value: unknown): ValidationResult<HypothesisCandidate> {
  return runValidation<HypothesisCandidate>(validators.hypothesisCandidate, value);
}

export function validateEvaluationScore(value: unknown): ValidationResult<EvaluationScore> {
  return runValidation<EvaluationScore>(validators.evaluationScore, value);
}

export function validateSynthesisOutput(value: unknown): ValidationResult<SynthesisOutput> {
  return runValidation<SynthesisOutput>(validators.synthesisOutput, value);
}

export function validateMutationLineage(value: unknown): ValidationResult<MutationLineage> {
  return runValidation<MutationLineage>(validators.mutationLineage, value);
}

export function validateEvaluationRound(value: unknown): ValidationResult<EvaluationRound> {
  const result = runValidation<EvaluationRound>(validators.evaluationRound, value);
  if (!result.ok || !result.value) return result;
  const semanticIssues = validateEvaluationRoundSemantics(result.value);
  if (semanticIssues.length === 0) return result;
  return { ok: false, errors: summarizeText(semanticIssues), issues: semanticIssues };
}

export function validateRefinementHistory(value: unknown): ValidationResult<RefinementHistory> {
  return runValidation<RefinementHistory>(validators.refinementHistory, value);
}

export function validateStarburstContract(
  kind: AstroSpecStarburstContractKind,
  value: unknown,
): ValidationResult<
  | AbstractionOutput
  | DomainPattern
  | AnalogicalMapping
  | HypothesisCandidate
  | EvaluationScore
  | SynthesisOutput
  | MutationLineage
  | EvaluationRound
  | RefinementHistory
> {
  switch (kind) {
    case 'abstraction-output':
      return validateAbstractionOutput(value);
    case 'domain-pattern':
      return validateDomainPattern(value);
    case 'analogical-mapping':
      return validateAnalogicalMapping(value);
    case 'hypothesis-candidate':
      return validateHypothesisCandidate(value);
    case 'evaluation-score':
      return validateEvaluationScore(value);
    case 'synthesis-output':
      return validateSynthesisOutput(value);
    case 'mutation-lineage':
      return validateMutationLineage(value);
    case 'evaluation-round':
      return validateEvaluationRound(value);
    case 'refinement-history':
      return validateRefinementHistory(value);
  }
}
