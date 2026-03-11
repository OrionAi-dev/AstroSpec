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
} from '@astrospec/agent-contracts';
import {
  validateRetrievalContract,
  type AstroSpecRetrievalContractKind,
  type ValidationResult as RetrievalValidationResult,
} from '@astrospec/retrieval-profile';
import {
  callAstroSpecMcpTool,
  callSecureContextTool,
  type AstroSpecContractKind,
  type AstroSpecMcpResult,
  type AstroSpecMcpToolName,
  type SecureContextMcpResult,
  type SecureContextMcpToolName,
} from '@mcp-secure-context/mcp-adapter';
import {
  type ContextContainer,
  type ContainerType,
  type ContextPayloadMap,
  type PolicyMetadata,
  type ProvenanceEnvelope,
} from '@mcp-secure-context/core';
import { validateContextContainer } from '@mcp-secure-context/openspec';

export type AstroSpecKitKind = AstroSpecContractKind;

export type AstroSpecKitValidationResult = (ValidationResult | RetrievalValidationResult) & {
  nextHint?: string;
};

function nextHintFor(kind: AstroSpecKitKind, result: ValidationResult | RetrievalValidationResult): string | undefined {
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

export function validate(kind: AstroSpecKitKind, payload: unknown): AstroSpecKitValidationResult {
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
                    : validateRetrievalContract(kind as AstroSpecRetrievalContractKind, payload);

  return {
    ...result,
    nextHint: nextHintFor(kind, result),
  };
}

export function validateRetrieval(kind: AstroSpecRetrievalContractKind, payload: unknown): AstroSpecKitValidationResult {
  const result = validateRetrievalContract(kind, payload);
  return {
    ...result,
    nextHint: nextHintFor(kind, result),
  };
}

export async function callTool(name: AstroSpecMcpToolName, args?: unknown): Promise<AstroSpecMcpResult<unknown>> {
  return callAstroSpecMcpTool({ name, arguments: args });
}

export function createContextContainer<TType extends ContainerType>(input: {
  containerType: TType;
  id: string;
  version?: string;
  payload: ContextPayloadMap[TType];
  policy: PolicyMetadata;
  provenance: ProvenanceEnvelope;
  verification?: ContextContainer<ContextPayloadMap[TType]>['verification'];
  ext?: ContextContainer<ContextPayloadMap[TType]>['ext'];
}): ContextContainer<ContextPayloadMap[TType]> {
  return {
    schema: 'mcp-secure-context.container.v0.1',
    containerType: input.containerType,
    id: input.id,
    version: input.version ?? '0.1.0',
    payload: input.payload,
    policy: input.policy,
    provenance: input.provenance,
    ...(input.verification ? { verification: input.verification } : {}),
    ...(input.ext ? { ext: input.ext } : {}),
  };
}

export function validateContainer(payload: unknown) {
  return validateContextContainer(payload);
}

export async function callSecureContext(
  name: SecureContextMcpToolName,
  args?: unknown,
): Promise<SecureContextMcpResult<unknown>> {
  return callSecureContextTool({ name, arguments: args });
}
