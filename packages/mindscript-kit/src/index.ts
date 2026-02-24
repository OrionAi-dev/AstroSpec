import {
  validateChatOrchestrationAudit,
  validateExecTurn,
  validateGitHistorySummary,
  validatePlanTurn,
  validateRepoPack,
  validateRunLogEntry,
  validateToolCallRecord,
  validateToolPolicySpec,
  type ValidationResult,
} from '@mindscript/agent-contracts';
import {
  callMindscriptMcpTool,
  type MindscriptContractKind,
  type MindscriptMcpResult,
  type MindscriptMcpToolName,
} from '@mindscript/mcp-profile';

export type MindscriptKitKind = MindscriptContractKind;

export type MindscriptKitValidationResult = ValidationResult & {
  nextHint?: string;
};

function nextHintFor(kind: MindscriptKitKind, result: ValidationResult): string | undefined {
  if (result.ok) return undefined;
  const first = result.errors[0] ?? 'payload is invalid';
  switch (kind) {
    case 'plan-turn':
      return `Fix PlanTurn fields first: ${first}`;
    case 'exec-turn':
      return `Fix ExecTurn fields first: ${first}`;
    case 'tool-policy-spec':
      return `Update tool policy structure: ${first}`;
    case 'tool-call-record':
      return `Normalize tool call record: ${first}`;
    case 'repopack':
      return `Repair RepoPack schema shape: ${first}`;
    case 'run-log-entry':
      return `Repair run-log entry schema: ${first}`;
    case 'chat-orchestration-audit':
      return `Repair chat orchestration audit schema: ${first}`;
    case 'git-history-summary':
      return `Repair git-history summary schema: ${first}`;
  }
}

export function validate(kind: MindscriptKitKind, payload: unknown): MindscriptKitValidationResult {
  const result =
    kind === 'plan-turn'
      ? validatePlanTurn(payload)
      : kind === 'exec-turn'
        ? validateExecTurn(payload)
        : kind === 'tool-policy-spec'
          ? validateToolPolicySpec(payload)
          : kind === 'tool-call-record'
            ? validateToolCallRecord(payload)
            : kind === 'repopack'
              ? validateRepoPack(payload)
              : kind === 'run-log-entry'
                ? validateRunLogEntry(payload)
                : kind === 'chat-orchestration-audit'
                  ? validateChatOrchestrationAudit(payload)
                  : validateGitHistorySummary(payload);

  return {
    ...result,
    nextHint: nextHintFor(kind, result),
  };
}

export async function callTool(name: MindscriptMcpToolName, args?: unknown): Promise<MindscriptMcpResult<unknown>> {
  return callMindscriptMcpTool({ name, arguments: args });
}
