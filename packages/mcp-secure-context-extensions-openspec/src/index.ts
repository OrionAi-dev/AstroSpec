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
} from '@openspec/agent-contracts';
import {
  validateRetrievalContract,
  type OpenSpecRetrievalContractKind,
  type ValidationResult as RetrievalValidationResult,
} from '@openspec/retrieval-profile';

export type OpenSpecAgentContractKind =
  | 'plan-turn'
  | 'exec-turn'
  | 'tool-policy-spec'
  | 'tool-call-record'
  | 'repopack'
  | 'run-log-entry'
  | 'chat-orchestration-audit'
  | 'git-history-summary';

export type OpenSpecKitKind = OpenSpecAgentContractKind | OpenSpecRetrievalContractKind;

export type OpenSpecKitValidationResult = (ValidationResult | RetrievalValidationResult) & {
  nextHint?: string;
};

function nextHintFor(kind: OpenSpecKitKind, result: ValidationResult | RetrievalValidationResult): string | undefined {
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
    case 'retrieval-request':
      return `Normalize the retrieval request envelope: ${first}`;
    case 'retrieval-response':
      return `Repair retrieval results/citations before interoperability checks: ${first}`;
    case 'retrieval-plan':
      return `Fix retrieval plan step sequencing first: ${first}`;
    case 'memory-record':
      return `Repair memory namespace/key/kind fields: ${first}`;
    case 'knowledge-assertion':
      return `Repair subject/predicate/object assertion shape: ${first}`;
    case 'retrieval-stream-event':
      return `Normalize the retrieval streaming event envelope: ${first}`;
  }
}

export function validate(kind: OpenSpecKitKind, payload: unknown): OpenSpecKitValidationResult {
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
                  : kind === 'git-history-summary'
                    ? validateGitHistorySummary(payload)
                    : validateRetrievalContract(kind as OpenSpecRetrievalContractKind, payload);

  return {
    ...result,
    nextHint: nextHintFor(kind, result),
  };
}

export function validateRetrieval(kind: OpenSpecRetrievalContractKind, payload: unknown): OpenSpecKitValidationResult {
  const result = validateRetrievalContract(kind, payload);
  return {
    ...result,
    nextHint: nextHintFor(kind, result),
  };
}
