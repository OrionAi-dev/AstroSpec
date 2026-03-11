import type { ErrorObject, ValidateFunction } from 'ajv';
import * as Ajv2020Module from 'ajv/dist/2020.js';
import * as AjvFormatsModule from 'ajv-formats';

import { listSchemas, readSchema } from '@astrospec/schema';
import type { JsonValue } from '@astrospec/runtime';
import type { GraphMemoryNode, MemoryPromotionEnvelope, StructuralGraphMatch, StructuralGraphQuery } from '@astrospec/graph-memory';
import type { ReasoningResult, ReasoningTask, ReasoningWorkflowContract } from '@astrospec/reasoning';
import type {
  EvaluationRound,
  HypothesisCandidate,
  RefinementHistory,
  SynthesisOutput,
} from '@astrospec/starburst-profile';

import runtimeInterfaceDescriptorSchema from '../schemas/runtime-interface-descriptor-0.1.json' with { type: 'json' };

export { runtimeInterfaceDescriptorSchema };

export interface ContractExecutionContext {
  runId: string;
  projectId?: string;
  tenantId?: string;
  tags?: string[];
  ext?: Record<string, JsonValue>;
}

export interface ContractExecutionHook {
  onRunCreated?(context: ContractExecutionContext): Promise<void> | void;
  onPhaseStarted?(phase: string, context: ContractExecutionContext): Promise<void> | void;
  onArtifactProduced?(artifact: JsonValue, context: ContractExecutionContext): Promise<void> | void;
  onRunCompleted?(result: ReasoningResult | SynthesisOutput, context: ContractExecutionContext): Promise<void> | void;
  onRunFailed?(error: Error, context: ContractExecutionContext): Promise<void> | void;
}

export interface ReasoningRuntimeAdapter {
  readonly adapterId: string;
  validateTask(task: ReasoningTask): Promise<boolean> | boolean;
  runTask(task: ReasoningTask, context?: ContractExecutionContext): Promise<ReasoningResult>;
}

export interface DiscoveryWorkflowAdapter {
  readonly workflowId: string;
  runDiscovery(
    task: ReasoningTask,
    context?: ContractExecutionContext,
  ): Promise<{
    synthesis: SynthesisOutput;
    candidates?: HypothesisCandidate[];
    evaluationRounds?: EvaluationRound[];
    refinementHistory?: RefinementHistory;
  }>;
}

export interface GraphMemoryProvider {
  retrieveStructural(
    query: StructuralGraphQuery,
    context?: ContractExecutionContext,
  ): Promise<StructuralGraphMatch[]>;
  writeNode(node: GraphMemoryNode, context?: ContractExecutionContext): Promise<void>;
  promote(envelope: MemoryPromotionEnvelope, context?: ContractExecutionContext): Promise<void>;
}

export interface ConstellationExecutor {
  readonly executorId: string;
  execute(
    contract: ReasoningWorkflowContract,
    hooks?: ContractExecutionHook[],
    context?: ContractExecutionContext,
  ): Promise<ReasoningResult>;
  listConstellations?(): Promise<string[]> | string[];
}

export interface RuntimeInterfaceDescriptor {
  descriptorId: string;
  name: string;
  interfaceKind:
    | 'reasoning-runtime-adapter'
    | 'discovery-workflow-adapter'
    | 'graph-memory-provider'
    | 'constellation-executor'
    | 'contract-execution-hook';
  version: string;
  contractKinds?: string[];
  capabilities?: string[];
  transport?: string;
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
ajv.addSchema(runtimeInterfaceDescriptorSchema);

const validator = ajv.compile(runtimeInterfaceDescriptorSchema);

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

export function validateRuntimeInterfaceDescriptor(value: unknown): ValidationResult<RuntimeInterfaceDescriptor> {
  const ok = validator(value);
  const issues = summarizeIssues(validator.errors);
  return {
    ok: Boolean(ok),
    errors: summarizeText(issues),
    issues,
    value: ok ? (value as RuntimeInterfaceDescriptor) : undefined,
  };
}
