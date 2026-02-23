import {
  validateExecTurn,
  validatePlanTurn,
  validateRepoPack,
  validateRunLogEntry,
  validateToolCallRecord,
  validateToolPolicySpec,
} from '@orionai/mindscript-agent-contracts';
import {
  validateTurn,
  verifyOutput,
  type MindScriptContext,
  type MindScriptTurn,
  type VerificationReport,
} from '@mindscript/runtime';

export const MINDSCRIPT_MCP_TOOL_NAMES = [
  'mindscript.plan_turn.generate',
  'mindscript.exec_turn.generate',
  'mindscript.turn.verify',
  'mindscript.contract.validate',
  'mindscript.governance.approval.challenge',
  'mindscript.governance.approval.commit',
] as const;

export type MindscriptMcpToolName = (typeof MINDSCRIPT_MCP_TOOL_NAMES)[number];

export const MINDSCRIPT_MCP_ERROR_CODES = [
  'MS_MCP_INVALID_INPUT',
  'MS_MCP_CONTRACT_INVALID',
  'MS_MCP_VERIFICATION_FAILED',
  'MS_MCP_GOVERNANCE_REQUIRED',
  'MS_MCP_GOVERNANCE_INVALID',
] as const;

export type MindscriptMcpErrorCode = (typeof MINDSCRIPT_MCP_ERROR_CODES)[number];

export type MindscriptContractKind =
  | 'plan-turn'
  | 'exec-turn'
  | 'tool-policy-spec'
  | 'tool-call-record'
  | 'repopack'
  | 'run-log-entry';

export type MindscriptMcpError = {
  code: MindscriptMcpErrorCode;
  message: string;
  details?: unknown;
};

export type MindscriptMcpFailure = {
  ok: false;
  error: MindscriptMcpError;
};

export type MindscriptMcpSuccess<T> = {
  ok: true;
  result: T;
};

export type MindscriptMcpResult<T> = MindscriptMcpSuccess<T> | MindscriptMcpFailure;

export type MindscriptMcpResource = {
  uri: string;
  mimeType: 'application/json';
  text: string;
};

export type MindscriptMcpToolCall = {
  name: MindscriptMcpToolName;
  arguments?: unknown;
};

export type MindscriptMcpToolSpec = {
  name: MindscriptMcpToolName;
  description: string;
};

export type MindscriptMcpProfileServer = {
  listTools(): MindscriptMcpToolSpec[];
  callTool(input: MindscriptMcpToolCall): Promise<MindscriptMcpResult<unknown>>;
  setContext(context: MindScriptContext): void;
  setTurn(turn: MindScriptTurn): void;
  setVerification(id: string, report: VerificationReport): void;
  readResource(uri: string): MindscriptMcpResult<MindscriptMcpResource>;
};

type ContractValidationResult = {
  ok: boolean;
  errors: string[];
  issues?: unknown;
};

function fail(code: MindscriptMcpErrorCode, message: string, details?: unknown): MindscriptMcpFailure {
  return { ok: false, error: { code, message, details } };
}

function success<T>(result: T): MindscriptMcpSuccess<T> {
  return { ok: true, result };
}

function asObject(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function encodeResource(resource: unknown, uri: string): MindscriptMcpResource {
  return {
    uri,
    mimeType: 'application/json',
    text: JSON.stringify(resource, null, 2),
  };
}

function contractValidator(kind: MindscriptContractKind, payload: unknown): ContractValidationResult {
  switch (kind) {
    case 'plan-turn':
      return validatePlanTurn(payload);
    case 'exec-turn':
      return validateExecTurn(payload);
    case 'tool-policy-spec':
      return validateToolPolicySpec(payload);
    case 'tool-call-record':
      return validateToolCallRecord(payload);
    case 'repopack':
      return validateRepoPack(payload);
    case 'run-log-entry':
      return validateRunLogEntry(payload);
  }
}

function maybeIssues(value: unknown): unknown {
  const asObj = asObject(value);
  return asObj?.issues;
}

function validateGovernanceChallenge(args: Record<string, unknown>): MindscriptMcpResult<{
  runId: string;
  challengeId: string;
  requestDigest: string;
  expiresAt: string;
}> {
  const runId = asString(args.runId);
  const challengeId = asString(args.challengeId);
  const requestDigest = asString(args.requestDigest);
  const expiresAt = asString(args.expiresAt);

  if (!runId || !challengeId || !requestDigest || !expiresAt) {
    return fail('MS_MCP_GOVERNANCE_INVALID', 'governance challenge payload missing required fields');
  }

  const iso = Date.parse(expiresAt);
  if (!Number.isFinite(iso)) {
    return fail('MS_MCP_GOVERNANCE_INVALID', 'expiresAt must be an ISO-8601 date-time string');
  }

  return success({ runId, challengeId, requestDigest, expiresAt });
}

function validateGovernanceCommit(args: Record<string, unknown>): MindscriptMcpResult<{
  approvalId: string;
  challengeId: string;
  status: 'approved' | 'rejected';
  approvedBy: string;
}> {
  const approvalId = asString(args.approvalId);
  const challengeId = asString(args.challengeId);
  const approvedBy = asString(args.approvedBy);
  const statusRaw = asString(args.status);

  if (!approvalId || !challengeId || !approvedBy || !statusRaw) {
    return fail('MS_MCP_GOVERNANCE_INVALID', 'governance commit payload missing required fields');
  }

  if (statusRaw !== 'approved' && statusRaw !== 'rejected') {
    return fail('MS_MCP_GOVERNANCE_INVALID', 'status must be approved or rejected');
  }

  return success({ approvalId, challengeId, status: statusRaw, approvedBy });
}

export async function callMindscriptMcpTool(input: MindscriptMcpToolCall): Promise<MindscriptMcpResult<unknown>> {
  const args = asObject(input.arguments) ?? {};

  if (!MINDSCRIPT_MCP_TOOL_NAMES.includes(input.name)) {
    return fail('MS_MCP_INVALID_INPUT', `unknown tool name: ${input.name}`);
  }

  if (input.name === 'mindscript.plan_turn.generate') {
    const planTurn = args.planTurn;
    const out = validatePlanTurn(planTurn);
    if (!out.ok) {
      return fail('MS_MCP_CONTRACT_INVALID', 'plan-turn validation failed', {
        issues: maybeIssues(out),
        errors: out.errors,
      });
    }
    return success({ planTurn });
  }

  if (input.name === 'mindscript.exec_turn.generate') {
    const execTurn = args.execTurn;
    const out = validateExecTurn(execTurn);
    if (!out.ok) {
      return fail('MS_MCP_CONTRACT_INVALID', 'exec-turn validation failed', {
        issues: maybeIssues(out),
        errors: out.errors,
      });
    }
    return success({ execTurn });
  }

  if (input.name === 'mindscript.contract.validate') {
    const kindRaw = asString(args.kind);
    if (!kindRaw) {
      return fail('MS_MCP_INVALID_INPUT', 'kind is required');
    }

    const kinds = new Set<MindscriptContractKind>([
      'plan-turn',
      'exec-turn',
      'tool-policy-spec',
      'tool-call-record',
      'repopack',
      'run-log-entry',
    ]);

    if (!kinds.has(kindRaw as MindscriptContractKind)) {
      return fail('MS_MCP_INVALID_INPUT', `unsupported kind: ${kindRaw}`);
    }

    const validation = contractValidator(kindRaw as MindscriptContractKind, args.payload);
    if (!validation.ok) {
      return fail('MS_MCP_CONTRACT_INVALID', `${kindRaw} validation failed`, {
        issues: maybeIssues(validation),
        errors: validation.errors,
      });
    }

    return success({ kind: kindRaw, valid: true });
  }

  if (input.name === 'mindscript.turn.verify') {
    const turnRaw = args.turn;
    const turnValidation = validateTurn(turnRaw);
    if (!turnValidation.ok) {
      return fail('MS_MCP_CONTRACT_INVALID', 'turn validation failed', { errors: turnValidation.errors });
    }

    const report = await verifyOutput({
      turn: turnValidation.value,
      output: args.output,
      criteria: turnValidation.value.acceptanceCriteria,
    });

    if (!report.overall) {
      return fail('MS_MCP_VERIFICATION_FAILED', 'turn verification failed', report);
    }

    return success({ report });
  }

  if (input.name === 'mindscript.governance.approval.challenge') {
    return validateGovernanceChallenge(args);
  }

  if (input.name === 'mindscript.governance.approval.commit') {
    return validateGovernanceCommit(args);
  }

  return fail('MS_MCP_INVALID_INPUT', `unsupported tool name: ${input.name}`);
}

export function serializeContextResource(context: MindScriptContext): MindscriptMcpResource {
  return encodeResource(context, `mindscript://context/${encodeURIComponent(context.id)}`);
}

export function serializeTurnResource(turn: MindScriptTurn): MindscriptMcpResource {
  return encodeResource(turn, `mindscript://turn/${encodeURIComponent(turn.id)}`);
}

export function serializeVerificationResource(id: string, report: VerificationReport): MindscriptMcpResource {
  return encodeResource(report, `mindscript://verification/${encodeURIComponent(id)}`);
}

export function createMindscriptMcpProfileServer(initial?: {
  contexts?: MindScriptContext[];
  turns?: MindScriptTurn[];
  verifications?: Array<{ id: string; report: VerificationReport }>;
}): MindscriptMcpProfileServer {
  const contexts = new Map<string, MindScriptContext>();
  const turns = new Map<string, MindScriptTurn>();
  const verifications = new Map<string, VerificationReport>();

  for (const context of initial?.contexts ?? []) {
    contexts.set(context.id, context);
  }
  for (const turn of initial?.turns ?? []) {
    turns.set(turn.id, turn);
  }
  for (const item of initial?.verifications ?? []) {
    verifications.set(item.id, item.report);
  }

  return {
    listTools() {
      return [
        { name: 'mindscript.plan_turn.generate', description: 'Validate and return PlanTurn payloads.' },
        { name: 'mindscript.exec_turn.generate', description: 'Validate and return ExecTurn payloads.' },
        { name: 'mindscript.turn.verify', description: 'Verify output against a MindScript Turn contract.' },
        { name: 'mindscript.contract.validate', description: 'Validate a specific contract kind by name.' },
        {
          name: 'mindscript.governance.approval.challenge',
          description: 'Normalize governance challenge envelopes for approval handshakes.',
        },
        {
          name: 'mindscript.governance.approval.commit',
          description: 'Normalize governance approval commit envelopes for audit/provenance.',
        },
      ];
    },

    callTool(input) {
      return callMindscriptMcpTool(input);
    },

    setContext(context) {
      contexts.set(context.id, context);
    },

    setTurn(turn) {
      turns.set(turn.id, turn);
    },

    setVerification(id, report) {
      verifications.set(id, report);
    },

    readResource(uri) {
      const parsed = asString(uri);
      if (!parsed) {
        return fail('MS_MCP_INVALID_INPUT', 'resource URI is required');
      }

      const contextPrefix = 'mindscript://context/';
      const turnPrefix = 'mindscript://turn/';
      const verificationPrefix = 'mindscript://verification/';

      if (parsed.startsWith(contextPrefix)) {
        const id = decodeURIComponent(parsed.slice(contextPrefix.length));
        const context = contexts.get(id);
        if (!context) return fail('MS_MCP_INVALID_INPUT', `context not found: ${id}`);
        return success(serializeContextResource(context));
      }

      if (parsed.startsWith(turnPrefix)) {
        const id = decodeURIComponent(parsed.slice(turnPrefix.length));
        const turn = turns.get(id);
        if (!turn) return fail('MS_MCP_INVALID_INPUT', `turn not found: ${id}`);
        return success(serializeTurnResource(turn));
      }

      if (parsed.startsWith(verificationPrefix)) {
        const id = decodeURIComponent(parsed.slice(verificationPrefix.length));
        const report = verifications.get(id);
        if (!report) return fail('MS_MCP_INVALID_INPUT', `verification not found: ${id}`);
        return success(serializeVerificationResource(id, report));
      }

      return fail('MS_MCP_INVALID_INPUT', `unsupported resource URI: ${parsed}`);
    },
  };
}
