import type { EvidenceSpan, JsonValue } from '@astrospec/runtime';
import reasoningDefsSchema from '../schemas/reasoning-defs-0.1.json';
import reasoningTaskSchema from '../schemas/reasoning-task-0.1.json';
import reasoningRoleSchema from '../schemas/reasoning-role-0.1.json';
import reasoningGraphSchema from '../schemas/reasoning-graph-0.1.json';
import reasoningEvidenceSchema from '../schemas/reasoning-evidence-0.1.json';
import reasoningResultSchema from '../schemas/reasoning-result-0.1.json';
import reasoningWorkflowContractSchema from '../schemas/reasoning-workflow-contract-0.1.json';
export { reasoningDefsSchema, reasoningTaskSchema, reasoningRoleSchema, reasoningGraphSchema, reasoningEvidenceSchema, reasoningResultSchema, reasoningWorkflowContractSchema, };
export declare const ASTROSPEC_REASONING_CONTRACT_KINDS: readonly ["reasoning-task", "reasoning-role", "reasoning-graph", "reasoning-evidence", "reasoning-result", "reasoning-workflow-contract"];
export type AstroSpecReasoningContractKind = (typeof ASTROSPEC_REASONING_CONTRACT_KINDS)[number];
export type ReasoningInteractionPattern = 'sequential' | 'parallel' | 'fanout' | 'review' | 'collapse' | 'optional';
export type ReasoningStatus = 'proposed' | 'running' | 'completed' | 'partial' | 'failed';
export type ReasoningMode = 'default' | 'supernova' | 'redshift' | 'event-horizon';
export type ReasoningEvidenceKind = 'citation' | 'memory' | 'observation' | 'assertion' | 'artifact';
export interface ReasoningRole {
    roleId: string;
    title: string;
    kind?: string;
    responsibilities?: string[];
    inputs?: string[];
    outputs?: string[];
    interactionPattern?: ReasoningInteractionPattern;
    ext?: Record<string, JsonValue>;
}
export interface ReasoningEdge {
    from: string;
    to: string;
    relation: 'depends_on' | 'informs' | 'critiques' | 'refines' | 'supports';
    note?: string;
}
export interface ReasoningEvidence {
    evidenceId: string;
    kind: ReasoningEvidenceKind;
    ref: string;
    sourceId?: string;
    span?: EvidenceSpan;
    relevance?: number;
    note?: string;
    ext?: Record<string, JsonValue>;
}
export interface ReasoningGraph {
    graphId: string;
    roles: ReasoningRole[];
    edges?: ReasoningEdge[];
    phases?: string[];
    ext?: Record<string, JsonValue>;
}
export interface ReasoningTask {
    taskId?: string;
    prompt: string;
    objective?: string;
    domainHints?: string[];
    constraints?: string[];
    evaluationTargets?: string[];
    evidence?: ReasoningEvidence[];
    graph?: ReasoningGraph;
    mode?: ReasoningMode;
    ext?: Record<string, JsonValue>;
}
export interface ReasoningOutputArtifact {
    artifactId: string;
    kind: string;
    title?: string;
    summary?: string;
    content?: JsonValue;
    refs?: string[];
    ext?: Record<string, JsonValue>;
}
export interface ReasoningScorecard {
    confidence?: number;
    completeness?: number;
    ext?: Record<string, JsonValue>;
}
export interface ReasoningResult {
    taskId: string;
    status: ReasoningStatus;
    summary: string;
    outputs?: ReasoningOutputArtifact[];
    evidence?: ReasoningEvidence[];
    scores?: ReasoningScorecard;
    ext?: Record<string, JsonValue>;
}
export interface ReasoningWorkflowContract {
    workflowId: string;
    task: ReasoningTask;
    roles: ReasoningRole[];
    phases: string[];
    expectedOutputs?: string[];
    ext?: Record<string, JsonValue>;
}
export type ValidationIssueCode = 'SCHEMA_REQUIRED' | 'SCHEMA_TYPE' | 'SCHEMA_ENUM' | 'SCHEMA_CONST' | 'SCHEMA_FORMAT' | 'SCHEMA_MIN_LENGTH' | 'SCHEMA_MIN_ITEMS' | 'SCHEMA_ADDITIONAL_PROPERTIES' | 'SCHEMA_OTHER';
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
export declare function validateReasoningTask(value: unknown): ValidationResult<ReasoningTask>;
export declare function validateReasoningRole(value: unknown): ValidationResult<ReasoningRole>;
export declare function validateReasoningGraph(value: unknown): ValidationResult<ReasoningGraph>;
export declare function validateReasoningEvidence(value: unknown): ValidationResult<ReasoningEvidence>;
export declare function validateReasoningResult(value: unknown): ValidationResult<ReasoningResult>;
export declare function validateReasoningWorkflowContract(value: unknown): ValidationResult<ReasoningWorkflowContract>;
export declare function validateReasoningContract(kind: AstroSpecReasoningContractKind, value: unknown): ValidationResult<ReasoningTask | ReasoningRole | ReasoningGraph | ReasoningEvidence | ReasoningResult | ReasoningWorkflowContract>;
//# sourceMappingURL=index.d.ts.map