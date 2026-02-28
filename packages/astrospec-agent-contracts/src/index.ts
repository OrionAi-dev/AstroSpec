import type { ErrorObject, ValidateFunction } from 'ajv';
import * as Ajv2020Module from 'ajv/dist/2020.js';
import * as AjvFormatsModule from 'ajv-formats';

import planTurnSchema from '../schemas/plan-turn.schema.json' with { type: 'json' };
import execTurnSchema from '../schemas/exec-turn.schema.json' with { type: 'json' };
import toolPolicySpecSchema from '../schemas/tool-policy-spec.schema.json' with { type: 'json' };
import toolCallRecordSchema from '../schemas/tool-call-record.schema.json' with { type: 'json' };
import repoPackSchema from '../schemas/repopack.schema.json' with { type: 'json' };
import runLogEntrySchema from '../schemas/run-log-entry.schema.json' with { type: 'json' };
import chatOrchestrationAuditSchema from '../schemas/chat-orchestration-audit.schema.json' with { type: 'json' };
import gitHistorySummarySchema from '../schemas/git-history-summary.schema.json' with { type: 'json' };

export {
  planTurnSchema,
  execTurnSchema,
  toolPolicySpecSchema,
  toolCallRecordSchema,
  repoPackSchema,
  runLogEntrySchema,
  chatOrchestrationAuditSchema,
  gitHistorySummarySchema,
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

export type ValidationResult = {
  ok: boolean;
  errors: string[];
  issues: ValidationIssue[];
};

const Ajv2020 = (Ajv2020Module as unknown as { default: new (opts?: unknown) => any }).default;
const ajv = new Ajv2020({ allErrors: true, strict: false });
const addFormats = (AjvFormatsModule as unknown as { default?: (ajv: unknown) => void }).default
  ?? (AjvFormatsModule as unknown as (ajv: unknown) => void);
addFormats(ajv);

  const validators = {
  planTurn: ajv.compile(planTurnSchema),
  execTurn: ajv.compile(execTurnSchema),
  toolPolicySpec: ajv.compile(toolPolicySpecSchema),
  toolCallRecord: ajv.compile(toolCallRecordSchema),
  repoPack: ajv.compile(repoPackSchema),
  runLogEntry: ajv.compile(runLogEntrySchema),
  chatOrchestrationAudit: ajv.compile(chatOrchestrationAuditSchema),
  gitHistorySummary: ajv.compile(gitHistorySummarySchema),
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

function runValidation(validator: ValidateFunction, value: unknown): ValidationResult {
  const ok = validator(value);
  const issues = summarizeIssues(validator.errors);
  return { ok: Boolean(ok), errors: summarizeText(issues), issues };
}

export function validatePlanTurn(value: unknown): ValidationResult {
  return runValidation(validators.planTurn, value);
}

export function validateExecTurn(value: unknown): ValidationResult {
  return runValidation(validators.execTurn, value);
}

export function validateToolPolicySpec(value: unknown): ValidationResult {
  return runValidation(validators.toolPolicySpec, value);
}

export function validateToolCallRecord(value: unknown): ValidationResult {
  return runValidation(validators.toolCallRecord, value);
}

export function validateRepoPack(value: unknown): ValidationResult {
  return runValidation(validators.repoPack, value);
}

export function validateRunLogEntry(value: unknown): ValidationResult {
  return runValidation(validators.runLogEntry, value);
}

export function validateChatOrchestrationAudit(value: unknown): ValidationResult {
  return runValidation(validators.chatOrchestrationAudit, value);
}

export function validateGitHistorySummary(value: unknown): ValidationResult {
  return runValidation(validators.gitHistorySummary, value);
}
