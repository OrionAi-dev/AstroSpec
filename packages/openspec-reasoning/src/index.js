import * as Ajv2020Module from 'ajv/dist/2020.js';
import * as AjvFormatsModule from 'ajv-formats';
import { listSchemas, readSchema } from '@astrospec/schema';
import reasoningDefsSchema from '../schemas/reasoning-defs-0.1.json' with { type: 'json' };
import reasoningTaskSchema from '../schemas/reasoning-task-0.1.json' with { type: 'json' };
import reasoningRoleSchema from '../schemas/reasoning-role-0.1.json' with { type: 'json' };
import reasoningGraphSchema from '../schemas/reasoning-graph-0.1.json' with { type: 'json' };
import reasoningEvidenceSchema from '../schemas/reasoning-evidence-0.1.json' with { type: 'json' };
import reasoningResultSchema from '../schemas/reasoning-result-0.1.json' with { type: 'json' };
import reasoningWorkflowContractSchema from '../schemas/reasoning-workflow-contract-0.1.json' with { type: 'json' };
export { reasoningDefsSchema, reasoningTaskSchema, reasoningRoleSchema, reasoningGraphSchema, reasoningEvidenceSchema, reasoningResultSchema, reasoningWorkflowContractSchema, };
export const ASTROSPEC_REASONING_CONTRACT_KINDS = [
    'reasoning-task',
    'reasoning-role',
    'reasoning-graph',
    'reasoning-evidence',
    'reasoning-result',
    'reasoning-workflow-contract',
];
const Ajv2020 = Ajv2020Module.default;
const ajv = new Ajv2020({ allErrors: true, strict: false });
const addFormats = AjvFormatsModule.default
    ?? AjvFormatsModule;
addFormats(ajv);
for (const schemaName of listSchemas()) {
    ajv.addSchema(readSchema(schemaName));
}
ajv.addSchema(reasoningDefsSchema);
ajv.addSchema(reasoningTaskSchema);
ajv.addSchema(reasoningRoleSchema);
ajv.addSchema(reasoningGraphSchema);
ajv.addSchema(reasoningEvidenceSchema);
ajv.addSchema(reasoningResultSchema);
ajv.addSchema(reasoningWorkflowContractSchema);
const validators = {
    reasoningTask: ajv.compile(reasoningTaskSchema),
    reasoningRole: ajv.compile(reasoningRoleSchema),
    reasoningGraph: ajv.compile(reasoningGraphSchema),
    reasoningEvidence: ajv.compile(reasoningEvidenceSchema),
    reasoningResult: ajv.compile(reasoningResultSchema),
    reasoningWorkflowContract: ajv.compile(reasoningWorkflowContractSchema),
};
function issueCodeFromKeyword(keyword) {
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
function summarizeIssues(errors) {
    if (!errors)
        return [];
    return errors.map((err) => ({
        code: issueCodeFromKeyword(err.keyword),
        path: err.instancePath || '/',
        message: err.message || 'invalid',
        keyword: err.keyword,
        schemaPath: err.schemaPath,
    }));
}
function summarizeText(issues) {
    return issues.map((issue) => `${issue.path}: ${issue.message}`);
}
function runValidation(validator, value) {
    const ok = validator(value);
    const issues = summarizeIssues(validator.errors);
    return { ok: Boolean(ok), errors: summarizeText(issues), issues, value: ok ? value : undefined };
}
function makeIssue(path, message) {
    return {
        code: 'SCHEMA_OTHER',
        path,
        message,
        keyword: 'semantic',
        schemaPath: 'astrospec.reasoning.semantic',
    };
}
function validateRoleGraph(graph) {
    const issues = [];
    const roleIds = new Set();
    for (let i = 0; i < graph.roles.length; i++) {
        const role = graph.roles[i];
        if (roleIds.has(role.roleId)) {
            issues.push(makeIssue(`/roles/${i}/roleId`, `duplicate roleId: ${role.roleId}`));
        }
        roleIds.add(role.roleId);
    }
    for (let i = 0; i < (graph.edges ?? []).length; i++) {
        const edge = graph.edges[i];
        if (!roleIds.has(edge.from)) {
            issues.push(makeIssue(`/edges/${i}/from`, `unknown roleId: ${edge.from}`));
        }
        if (!roleIds.has(edge.to)) {
            issues.push(makeIssue(`/edges/${i}/to`, `unknown roleId: ${edge.to}`));
        }
    }
    return issues;
}
function validateWorkflowRoles(contract) {
    const issues = [];
    if (contract.phases.length === 0) {
        issues.push(makeIssue('/phases', 'workflow must declare at least one phase'));
    }
    const roleIds = new Set(contract.roles.map((role) => role.roleId));
    if (contract.task.graph) {
        for (let i = 0; i < contract.task.graph.roles.length; i++) {
            const role = contract.task.graph.roles[i];
            if (!roleIds.has(role.roleId)) {
                issues.push(makeIssue(`/task/graph/roles/${i}/roleId`, `roleId not declared in workflow roles: ${role.roleId}`));
            }
        }
    }
    return issues;
}
export function validateReasoningTask(value) {
    const result = runValidation(validators.reasoningTask, value);
    if (!result.ok || !result.value?.graph)
        return result;
    const graphIssues = validateRoleGraph(result.value.graph);
    if (graphIssues.length === 0)
        return result;
    return { ok: false, errors: summarizeText(graphIssues), issues: graphIssues };
}
export function validateReasoningRole(value) {
    return runValidation(validators.reasoningRole, value);
}
export function validateReasoningGraph(value) {
    const result = runValidation(validators.reasoningGraph, value);
    if (!result.ok || !result.value)
        return result;
    const graphIssues = validateRoleGraph(result.value);
    if (graphIssues.length === 0)
        return result;
    return { ok: false, errors: summarizeText(graphIssues), issues: graphIssues };
}
export function validateReasoningEvidence(value) {
    return runValidation(validators.reasoningEvidence, value);
}
export function validateReasoningResult(value) {
    return runValidation(validators.reasoningResult, value);
}
export function validateReasoningWorkflowContract(value) {
    const result = runValidation(validators.reasoningWorkflowContract, value);
    if (!result.ok || !result.value)
        return result;
    const graphIssues = result.value.task.graph ? validateRoleGraph(result.value.task.graph) : [];
    const workflowIssues = validateWorkflowRoles(result.value);
    const issues = [...graphIssues, ...workflowIssues];
    if (issues.length === 0)
        return result;
    return { ok: false, errors: summarizeText(issues), issues };
}
export function validateReasoningContract(kind, value) {
    switch (kind) {
        case 'reasoning-task':
            return validateReasoningTask(value);
        case 'reasoning-role':
            return validateReasoningRole(value);
        case 'reasoning-graph':
            return validateReasoningGraph(value);
        case 'reasoning-evidence':
            return validateReasoningEvidence(value);
        case 'reasoning-result':
            return validateReasoningResult(value);
        case 'reasoning-workflow-contract':
            return validateReasoningWorkflowContract(value);
    }
}
//# sourceMappingURL=index.js.map