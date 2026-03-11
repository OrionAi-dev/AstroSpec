import {
  validateChatOrchestrationAudit,
  validateExecTurn,
  validateGitHistorySummary,
  validatePlanTurn,
  validateRepoPack,
  validateRunLogEntry,
  validateToolCallRecord,
  validateToolPolicySpec,
} from '@astrospec/agent-contracts';
import {
  validateKnowledgeAssertion,
  validateMemoryRecord,
  validateRetrievalContract,
  validateRetrievalPlan,
  validateRetrievalRequest,
  validateRetrievalResponse,
  type KnowledgeAssertion,
  type MemoryRecord,
  type AstroSpecRetrievalContractKind,
  type RetrievalPlan,
  type RetrievalRequest,
  type RetrievalResponse,
} from '@astrospec/retrieval-profile';
import {
  validateTurn,
  verifyOutput,
  validateContextContainer,
  digestContextContainer,
  type AstroSpecContext,
  type AstroSpecTurn,
  type VerificationReport,
} from '@mcp-secure-context/openspec';
import type { ContextContainer } from '@mcp-secure-context/core';

export const ASTROSPEC_MCP_TOOL_NAMES = [
  'astrospec.plan_turn.generate',
  'astrospec.exec_turn.generate',
  'astrospec.turn.verify',
  'astrospec.contract.validate',
  'astrospec.retrieval.query',
  'astrospec.retrieval.plan',
  'astrospec.retrieval.verify',
  'astrospec.memory.read',
  'astrospec.memory.write',
  'astrospec.graph.query',
  'astrospec.graph.assert',
  'astrospec.governance.approval.challenge',
  'astrospec.governance.approval.commit',
] as const;

export type AstroSpecMcpToolName = (typeof ASTROSPEC_MCP_TOOL_NAMES)[number];

export const ASTROSPEC_MCP_ERROR_CODES = [
  'AS_MCP_INVALID_INPUT',
  'AS_MCP_CONTRACT_INVALID',
  'AS_MCP_VERIFICATION_FAILED',
  'AS_MCP_GOVERNANCE_REQUIRED',
  'AS_MCP_GOVERNANCE_INVALID',
  'AS_MCP_RETRIEVAL_INVALID',
  'AS_MCP_RETRIEVAL_UNAVAILABLE',
  'AS_MCP_GROUNDING_FAILED',
] as const;

export type AstroSpecMcpErrorCode = (typeof ASTROSPEC_MCP_ERROR_CODES)[number];

export type AstroSpecAgentContractKind =
  | 'plan-turn'
  | 'exec-turn'
  | 'tool-policy-spec'
  | 'tool-call-record'
  | 'repopack'
  | 'run-log-entry'
  | 'chat-orchestration-audit'
  | 'git-history-summary';

export type AstroSpecContractKind = AstroSpecAgentContractKind | AstroSpecRetrievalContractKind;

export type AstroSpecMcpError = {
  code: AstroSpecMcpErrorCode;
  message: string;
  details?: unknown;
};

export type AstroSpecMcpFailure = {
  ok: false;
  error: AstroSpecMcpError;
};

export type AstroSpecMcpSuccess<T> = {
  ok: true;
  result: T;
};

export type AstroSpecMcpResult<T> = AstroSpecMcpSuccess<T> | AstroSpecMcpFailure;

export type AstroSpecMcpResource = {
  uri: string;
  mimeType: 'application/json';
  text: string;
  annotations?: {
    audience?: readonly string[];
    priority?: number;
    lastModified?: string;
  };
};

export type AstroSpecMcpToolCall = {
  name: AstroSpecMcpToolName;
  arguments?: unknown;
};

export type AstroSpecMcpToolSpec = {
  name: AstroSpecMcpToolName;
  description: string;
};

export type AstroSpecMcpProfileServer = {
  listTools(): AstroSpecMcpToolSpec[];
  callTool(input: AstroSpecMcpToolCall): Promise<AstroSpecMcpResult<unknown>>;
  setContext(context: AstroSpecContext): void;
  setTurn(turn: AstroSpecTurn): void;
  setVerification(id: string, report: VerificationReport): void;
  setRetrievalRun(response: RetrievalResponse): void;
  setMemoryRecord(record: MemoryRecord): void;
  setKnowledgeAssertion(graph: string, nodeId: string, assertion: KnowledgeAssertion): void;
  readResource(uri: string): AstroSpecMcpResult<AstroSpecMcpResource>;
};

export const SECURE_CONTEXT_MCP_TOOL_NAMES = [
  'mcp_secure_context.container.validate',
  'mcp_secure_context.container.verify',
  'mcp_secure_context.container.share',
] as const;

export type SecureContextMcpToolName = (typeof SECURE_CONTEXT_MCP_TOOL_NAMES)[number];

export const SECURE_CONTEXT_MCP_ERROR_CODES = [
  'MSC_INVALID_INPUT',
  'MSC_CONTAINER_INVALID',
  'MSC_POLICY_VIOLATION',
  'MSC_NOT_FOUND',
] as const;

export type SecureContextMcpErrorCode = (typeof SECURE_CONTEXT_MCP_ERROR_CODES)[number];

export type SecureContextMcpError = {
  code: SecureContextMcpErrorCode;
  message: string;
  details?: unknown;
};

export type SecureContextMcpResult<T> =
  | { ok: true; result: T }
  | { ok: false; error: SecureContextMcpError };

export type SecureContextMcpToolCall = {
  name: SecureContextMcpToolName;
  arguments?: unknown;
};

export type SecureContextMcpToolSpec = {
  name: SecureContextMcpToolName;
  description: string;
};

export type SecureContextMcpServer = {
  listTools(): SecureContextMcpToolSpec[];
  callTool(input: SecureContextMcpToolCall): Promise<SecureContextMcpResult<unknown>>;
  setContainer(container: ContextContainer): void;
  readResource(uri: string): SecureContextMcpResult<AstroSpecMcpResource>;
};

type ContractValidationResult = {
  ok: boolean;
  errors: string[];
  issues?: unknown;
};

function fail(code: AstroSpecMcpErrorCode, message: string, details?: unknown): AstroSpecMcpFailure {
  return { ok: false, error: { code, message, details } };
}

function success<T>(result: T): AstroSpecMcpSuccess<T> {
  return { ok: true, result };
}

function secureFail(code: SecureContextMcpErrorCode, message: string, details?: unknown): SecureContextMcpResult<never> {
  return { ok: false, error: { code, message, details } };
}

function secureSuccess<T>(result: T): SecureContextMcpResult<T> {
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

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function encodeResource(resource: unknown, uri: string, annotations?: AstroSpecMcpResource['annotations']): AstroSpecMcpResource {
  return {
    uri,
    mimeType: 'application/json',
    text: JSON.stringify(resource, null, 2),
    annotations,
  };
}

export function serializeContextContainerResource(container: ContextContainer): AstroSpecMcpResource {
  return encodeResource(
    container,
    `mcp-secure-context://containers/${encodeURIComponent(container.containerType)}/${encodeURIComponent(container.id)}`,
    {
      audience: container.policy.audience,
      priority: 0.9,
      lastModified: container.provenance.createdAt,
    },
  );
}

export async function callSecureContextTool(input: SecureContextMcpToolCall): Promise<SecureContextMcpResult<unknown>> {
  const args = asObject(input.arguments) ?? {};
  const container = args.container;

  if (!SECURE_CONTEXT_MCP_TOOL_NAMES.includes(input.name)) {
    return secureFail('MSC_INVALID_INPUT', `unknown tool name: ${input.name}`);
  }

  const validation = validateContextContainer(container);
  if (!validation.ok) {
    return secureFail('MSC_CONTAINER_INVALID', 'context container validation failed', {
      errors: validation.errors,
    });
  }

  if (input.name === 'mcp_secure_context.container.validate') {
    return secureSuccess({
      containerId: validation.value.id,
      containerType: validation.value.containerType,
      valid: true,
    });
  }

  if (input.name === 'mcp_secure_context.container.verify') {
    return secureSuccess({
      containerId: validation.value.id,
      digest: digestContextContainer(validation.value),
      verification: validation.value.verification ?? null,
    });
  }

  const audience = validation.value.policy.audience ?? [];
  if (audience.length === 0) {
    return secureFail('MSC_POLICY_VIOLATION', 'shared containers must declare at least one audience');
  }

  return secureSuccess({
    containerId: validation.value.id,
    audience,
    expiresAt: validation.value.policy.expiresAt ?? null,
  });
}

function contractValidator(kind: AstroSpecContractKind, payload: unknown): ContractValidationResult {
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
    case 'chat-orchestration-audit':
      return validateChatOrchestrationAudit(payload);
    case 'git-history-summary':
      return validateGitHistorySummary(payload);
    case 'retrieval-request':
    case 'retrieval-response':
    case 'retrieval-plan':
    case 'memory-record':
    case 'knowledge-assertion':
    case 'retrieval-stream-event':
      return validateRetrievalContract(kind, payload);
  }
}

function maybeIssues(value: unknown): unknown {
  const asObj = asObject(value);
  return asObj?.issues;
}

function validateGovernanceChallenge(args: Record<string, unknown>): AstroSpecMcpResult<{
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
    return fail('AS_MCP_GOVERNANCE_INVALID', 'governance challenge payload missing required fields');
  }

  const iso = Date.parse(expiresAt);
  if (!Number.isFinite(iso)) {
    return fail('AS_MCP_GOVERNANCE_INVALID', 'expiresAt must be an ISO-8601 date-time string');
  }

  return success({ runId, challengeId, requestDigest, expiresAt });
}

function validateGovernanceCommit(args: Record<string, unknown>): AstroSpecMcpResult<{
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
    return fail('AS_MCP_GOVERNANCE_INVALID', 'governance commit payload missing required fields');
  }

  if (statusRaw !== 'approved' && statusRaw !== 'rejected') {
    return fail('AS_MCP_GOVERNANCE_INVALID', 'status must be approved or rejected');
  }

  return success({ approvalId, challengeId, status: statusRaw, approvedBy });
}

function validateMemoryRead(args: Record<string, unknown>): AstroSpecMcpResult<{
  namespace: string;
  key: string;
  uri: string;
}> {
  const namespace = asString(args.namespace);
  const key = asString(args.key);

  if (!namespace || !key) {
    return fail('AS_MCP_RETRIEVAL_INVALID', 'memory.read requires namespace and key');
  }

  return success({
    namespace,
    key,
    uri: `astrospec://memories/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`,
  });
}

function validateGraphQuery(args: Record<string, unknown>): AstroSpecMcpResult<{
  graph: string;
  query: string;
  topK?: number;
  scopes?: string[];
}> {
  const graph = asString(args.graph);
  const query = asString(args.query);
  const topK = asNumber(args.topK);
  const scopes = Array.isArray(args.scopes) ? args.scopes.filter((item): item is string => typeof item === 'string') : undefined;

  if (!graph || !query) {
    return fail('AS_MCP_RETRIEVAL_INVALID', 'graph.query requires graph and query');
  }

  return success({ graph, query, topK, scopes });
}

export async function callAstroSpecMcpTool(input: AstroSpecMcpToolCall): Promise<AstroSpecMcpResult<unknown>> {
  const args = asObject(input.arguments) ?? {};

  if (!ASTROSPEC_MCP_TOOL_NAMES.includes(input.name)) {
    return fail('AS_MCP_INVALID_INPUT', `unknown tool name: ${input.name}`);
  }

  if (input.name === 'astrospec.plan_turn.generate') {
    const planTurn = args.planTurn;
    const out = validatePlanTurn(planTurn);
    if (!out.ok) {
      return fail('AS_MCP_CONTRACT_INVALID', 'plan-turn validation failed', {
        issues: maybeIssues(out),
        errors: out.errors,
      });
    }
    return success({ planTurn });
  }

  if (input.name === 'astrospec.exec_turn.generate') {
    const execTurn = args.execTurn;
    const out = validateExecTurn(execTurn);
    if (!out.ok) {
      return fail('AS_MCP_CONTRACT_INVALID', 'exec-turn validation failed', {
        issues: maybeIssues(out),
        errors: out.errors,
      });
    }
    return success({ execTurn });
  }

  if (input.name === 'astrospec.contract.validate') {
    const kindRaw = asString(args.kind);
    if (!kindRaw) {
      return fail('AS_MCP_INVALID_INPUT', 'kind is required');
    }

    const kinds = new Set<AstroSpecContractKind>([
      'plan-turn',
      'exec-turn',
      'tool-policy-spec',
      'tool-call-record',
      'repopack',
      'run-log-entry',
      'chat-orchestration-audit',
      'git-history-summary',
      'retrieval-request',
      'retrieval-response',
      'retrieval-plan',
      'memory-record',
      'knowledge-assertion',
      'retrieval-stream-event',
    ]);

    if (!kinds.has(kindRaw as AstroSpecContractKind)) {
      return fail('AS_MCP_INVALID_INPUT', `unsupported kind: ${kindRaw}`);
    }

    const validation = contractValidator(kindRaw as AstroSpecContractKind, args.payload);
    if (!validation.ok) {
      return fail('AS_MCP_CONTRACT_INVALID', `${kindRaw} validation failed`, {
        issues: maybeIssues(validation),
        errors: validation.errors,
      });
    }

    return success({ kind: kindRaw, valid: true });
  }

  if (input.name === 'astrospec.turn.verify') {
    const turnRaw = args.turn;
    const turnValidation = validateTurn(turnRaw);
    if (!turnValidation.ok) {
      return fail('AS_MCP_CONTRACT_INVALID', 'turn validation failed', { errors: turnValidation.errors });
    }

    const report = await verifyOutput({
      turn: turnValidation.value,
      output: args.output,
      criteria: turnValidation.value.acceptanceCriteria,
    });

    if (!report.overall) {
      return fail('AS_MCP_VERIFICATION_FAILED', 'turn verification failed', report);
    }

    return success({ report });
  }

  if (input.name === 'astrospec.retrieval.query') {
    const request = args.request;
    const validation = validateRetrievalRequest(request);
    if (!validation.ok) {
      return fail('AS_MCP_RETRIEVAL_INVALID', 'retrieval request validation failed', {
        issues: validation.issues,
        errors: validation.errors,
      });
    }
    return success({ request });
  }

  if (input.name === 'astrospec.retrieval.plan') {
    const plan = args.plan;
    const validation = validateRetrievalPlan(plan);
    if (!validation.ok) {
      return fail('AS_MCP_RETRIEVAL_INVALID', 'retrieval plan validation failed', {
        issues: validation.issues,
        errors: validation.errors,
      });
    }
    return success({ plan });
  }

  if (input.name === 'astrospec.retrieval.verify') {
    const response = args.response;
    const validation = validateRetrievalResponse(response);
    if (!validation.ok) {
      return fail('AS_MCP_RETRIEVAL_INVALID', 'retrieval response validation failed', {
        issues: validation.issues,
        errors: validation.errors,
      });
    }
    if (validation.value?.grounding && validation.value.grounding.supported === false) {
      return fail('AS_MCP_GROUNDING_FAILED', 'retrieval grounding assessment failed', validation.value.grounding);
    }
    return success({ response });
  }

  if (input.name === 'astrospec.memory.read') {
    return validateMemoryRead(args);
  }

  if (input.name === 'astrospec.memory.write') {
    const record = args.record;
    const validation = validateMemoryRecord(record);
    if (!validation.ok) {
      return fail('AS_MCP_RETRIEVAL_INVALID', 'memory record validation failed', {
        issues: validation.issues,
        errors: validation.errors,
      });
    }
    return success({ record });
  }

  if (input.name === 'astrospec.graph.query') {
    return validateGraphQuery(args);
  }

  if (input.name === 'astrospec.graph.assert') {
    const graph = asString(args.graph);
    const nodeId = asString(args.nodeId) || asString(args.subject);
    const assertion = args.assertion;
    const validation = validateKnowledgeAssertion(assertion);
    if (!validation.ok) {
      return fail('AS_MCP_RETRIEVAL_INVALID', 'knowledge assertion validation failed', {
        issues: validation.issues,
        errors: validation.errors,
      });
    }
    return success({
      graph: graph ?? 'default',
      nodeId: nodeId ?? validation.value?.subject,
      assertion,
    });
  }

  if (input.name === 'astrospec.governance.approval.challenge') {
    return validateGovernanceChallenge(args);
  }

  if (input.name === 'astrospec.governance.approval.commit') {
    return validateGovernanceCommit(args);
  }

  return fail('AS_MCP_INVALID_INPUT', `unsupported tool name: ${input.name}`);
}

export function serializeContextResource(context: AstroSpecContext): AstroSpecMcpResource {
  return encodeResource(context, `astrospec://context/${encodeURIComponent(context.id)}`, {
    audience: ['human', 'agent'],
    priority: 0.8,
    lastModified: context.lockedAt,
  });
}

export function serializeTurnResource(turn: AstroSpecTurn): AstroSpecMcpResource {
  return encodeResource(turn, `astrospec://turn/${encodeURIComponent(turn.id)}`, {
    audience: ['agent'],
    priority: 0.8,
    lastModified: turn.lockedAt,
  });
}

export function serializeVerificationResource(id: string, report: VerificationReport): AstroSpecMcpResource {
  return encodeResource(report, `astrospec://verification/${encodeURIComponent(id)}`, {
    audience: ['agent'],
    priority: 0.7,
    lastModified: report.at,
  });
}

export function serializeSourceResource(sourceId: string, resource: unknown, lastModified?: string): AstroSpecMcpResource {
  return encodeResource(resource, `astrospec://sources/${encodeURIComponent(sourceId)}`, {
    audience: ['agent'],
    priority: 0.9,
    lastModified,
  });
}

export function serializeRetrievalRunResource(response: RetrievalResponse): AstroSpecMcpResource {
  return encodeResource(response, `astrospec://retrieval-runs/${encodeURIComponent(response.requestId)}`, {
    audience: ['agent'],
    priority: 0.9,
    lastModified: undefined,
  });
}

export function serializeMemoryResource(record: MemoryRecord): AstroSpecMcpResource {
  return encodeResource(
    record,
    `astrospec://memories/${encodeURIComponent(record.namespace)}/${encodeURIComponent(record.key)}`,
    {
      audience: ['agent'],
      priority: 0.75,
      lastModified: record.updatedAt,
    },
  );
}

export function serializeGraphAssertionResource(
  graph: string,
  nodeId: string,
  assertion: KnowledgeAssertion,
): AstroSpecMcpResource {
  return encodeResource(assertion, `astrospec://graphs/${encodeURIComponent(graph)}/${encodeURIComponent(nodeId)}`, {
    audience: ['agent'],
    priority: 0.75,
    lastModified: assertion.assertedAt,
  });
}

export function createAstroSpecMcpProfileServer(initial?: {
  contexts?: AstroSpecContext[];
  turns?: AstroSpecTurn[];
  verifications?: Array<{ id: string; report: VerificationReport }>;
  retrievalRuns?: RetrievalResponse[];
  memories?: MemoryRecord[];
  graphAssertions?: Array<{ graph: string; nodeId: string; assertion: KnowledgeAssertion }>;
}): AstroSpecMcpProfileServer {
  const contexts = new Map<string, AstroSpecContext>();
  const turns = new Map<string, AstroSpecTurn>();
  const verifications = new Map<string, VerificationReport>();
  const retrievalRuns = new Map<string, RetrievalResponse>();
  const memories = new Map<string, MemoryRecord>();
  const graphAssertions = new Map<string, KnowledgeAssertion>();

  for (const context of initial?.contexts ?? []) {
    contexts.set(context.id, context);
  }
  for (const turn of initial?.turns ?? []) {
    turns.set(turn.id, turn);
  }
  for (const item of initial?.verifications ?? []) {
    verifications.set(item.id, item.report);
  }
  for (const response of initial?.retrievalRuns ?? []) {
    retrievalRuns.set(response.requestId, response);
  }
  for (const record of initial?.memories ?? []) {
    memories.set(`${record.namespace}/${record.key}`, record);
  }
  for (const item of initial?.graphAssertions ?? []) {
    graphAssertions.set(`${item.graph}/${item.nodeId}`, item.assertion);
  }

  return {
    listTools() {
      return [
        { name: 'astrospec.plan_turn.generate', description: 'Validate and return PlanTurn payloads.' },
        { name: 'astrospec.exec_turn.generate', description: 'Validate and return ExecTurn payloads.' },
        { name: 'astrospec.turn.verify', description: 'Verify output against a AstroSpec Turn contract.' },
        { name: 'astrospec.contract.validate', description: 'Validate a specific contract kind by name.' },
        { name: 'astrospec.retrieval.query', description: 'Validate and normalize retrieval request envelopes.' },
        { name: 'astrospec.retrieval.plan', description: 'Validate portable retrieval plans.' },
        { name: 'astrospec.retrieval.verify', description: 'Validate retrieval responses and grounding summaries.' },
        { name: 'astrospec.memory.read', description: 'Normalize memory lookup requests.' },
        { name: 'astrospec.memory.write', description: 'Validate persistent memory records.' },
        { name: 'astrospec.graph.query', description: 'Normalize graph query envelopes.' },
        { name: 'astrospec.graph.assert', description: 'Validate knowledge graph assertions.' },
        {
          name: 'astrospec.governance.approval.challenge',
          description: 'Normalize governance challenge envelopes for approval handshakes.',
        },
        {
          name: 'astrospec.governance.approval.commit',
          description: 'Normalize governance approval commit envelopes for audit/provenance.',
        },
      ];
    },

    callTool(input) {
      return callAstroSpecMcpTool(input);
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

    setRetrievalRun(response) {
      retrievalRuns.set(response.requestId, response);
    },

    setMemoryRecord(record) {
      memories.set(`${record.namespace}/${record.key}`, record);
    },

    setKnowledgeAssertion(graph, nodeId, assertion) {
      graphAssertions.set(`${graph}/${nodeId}`, assertion);
    },

    readResource(uri) {
      const parsed = asString(uri);
      if (!parsed) {
        return fail('AS_MCP_INVALID_INPUT', 'resource URI is required');
      }

      const contextPrefix = 'astrospec://context/';
      const turnPrefix = 'astrospec://turn/';
      const verificationPrefix = 'astrospec://verification/';
      const sourcePrefix = 'astrospec://sources/';
      const retrievalRunPrefix = 'astrospec://retrieval-runs/';
      const memoryPrefix = 'astrospec://memories/';
      const graphPrefix = 'astrospec://graphs/';

      if (parsed.startsWith(contextPrefix)) {
        const id = decodeURIComponent(parsed.slice(contextPrefix.length));
        const context = contexts.get(id);
        if (!context) return fail('AS_MCP_INVALID_INPUT', `context not found: ${id}`);
        return success(serializeContextResource(context));
      }

      if (parsed.startsWith(turnPrefix)) {
        const id = decodeURIComponent(parsed.slice(turnPrefix.length));
        const turn = turns.get(id);
        if (!turn) return fail('AS_MCP_INVALID_INPUT', `turn not found: ${id}`);
        return success(serializeTurnResource(turn));
      }

      if (parsed.startsWith(verificationPrefix)) {
        const id = decodeURIComponent(parsed.slice(verificationPrefix.length));
        const report = verifications.get(id);
        if (!report) return fail('AS_MCP_INVALID_INPUT', `verification not found: ${id}`);
        return success(serializeVerificationResource(id, report));
      }

      if (parsed.startsWith(sourcePrefix)) {
        const id = decodeURIComponent(parsed.slice(sourcePrefix.length));
        const matches = [...retrievalRuns.values()].flatMap((response) =>
          response.results.filter((candidate) => candidate.sourceId === id),
        );
        if (matches.length === 0) return fail('AS_MCP_RETRIEVAL_UNAVAILABLE', `source not found: ${id}`);
        return success(serializeSourceResource(id, { sourceId: id, candidates: matches }));
      }

      if (parsed.startsWith(retrievalRunPrefix)) {
        const id = decodeURIComponent(parsed.slice(retrievalRunPrefix.length));
        const response = retrievalRuns.get(id);
        if (!response) return fail('AS_MCP_RETRIEVAL_UNAVAILABLE', `retrieval run not found: ${id}`);
        return success(serializeRetrievalRunResource(response));
      }

      if (parsed.startsWith(memoryPrefix)) {
        const path = parsed.slice(memoryPrefix.length);
        const [namespaceRaw, keyRaw] = path.split('/');
        const memory = memories.get(`${decodeURIComponent(namespaceRaw ?? '')}/${decodeURIComponent(keyRaw ?? '')}`);
        if (!memory) return fail('AS_MCP_RETRIEVAL_UNAVAILABLE', `memory not found: ${path}`);
        return success(serializeMemoryResource(memory));
      }

      if (parsed.startsWith(graphPrefix)) {
        const path = parsed.slice(graphPrefix.length);
        const [graphRaw, nodeRaw] = path.split('/');
        const key = `${decodeURIComponent(graphRaw ?? '')}/${decodeURIComponent(nodeRaw ?? '')}`;
        const assertion = graphAssertions.get(key);
        if (!assertion) return fail('AS_MCP_RETRIEVAL_UNAVAILABLE', `graph assertion not found: ${path}`);
        return success(serializeGraphAssertionResource(decodeURIComponent(graphRaw ?? ''), decodeURIComponent(nodeRaw ?? ''), assertion));
      }

      return fail('AS_MCP_INVALID_INPUT', `unsupported resource URI: ${parsed}`);
    },
  };
}

export function createSecureContextMcpServer(initial?: {
  containers?: ContextContainer[];
}): SecureContextMcpServer {
  const containers = new Map<string, ContextContainer>();

  for (const container of initial?.containers ?? []) {
    containers.set(`${container.containerType}/${container.id}`, container);
  }

  return {
    listTools() {
      return [
        {
          name: 'mcp_secure_context.container.validate',
          description: 'Validate a portable secure context container.',
        },
        {
          name: 'mcp_secure_context.container.verify',
          description: 'Validate a container and compute its verification digest.',
        },
        {
          name: 'mcp_secure_context.container.share',
          description: 'Validate a container for scoped sharing and return normalized share metadata.',
        },
      ];
    },

    callTool(input) {
      return callSecureContextTool(input);
    },

    setContainer(container) {
      containers.set(`${container.containerType}/${container.id}`, container);
    },

    readResource(uri) {
      const parsed = asString(uri);
      if (!parsed) return secureFail('MSC_INVALID_INPUT', 'resource URI is required');
      const prefix = 'mcp-secure-context://containers/';
      if (!parsed.startsWith(prefix)) {
        return secureFail('MSC_INVALID_INPUT', `unsupported resource URI: ${parsed}`);
      }

      const path = parsed.slice(prefix.length);
      const [typeRaw, idRaw] = path.split('/');
      const key = `${decodeURIComponent(typeRaw ?? '')}/${decodeURIComponent(idRaw ?? '')}`;
      const container = containers.get(key);
      if (!container) {
        return secureFail('MSC_NOT_FOUND', `container not found: ${key}`);
      }
      return secureSuccess(serializeContextContainerResource(container));
    },
  };
}
