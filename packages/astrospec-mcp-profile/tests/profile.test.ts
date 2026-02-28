import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  callAstroSpecMcpTool,
  createAstroSpecMcpProfileServer,
  ASTROSPEC_MCP_ERROR_CODES,
  ASTROSPEC_MCP_TOOL_NAMES,
  serializeMemoryResource,
  serializeRetrievalRunResource,
  type AstroSpecContractKind,
} from '../src/index.js';
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
  validateRetrievalRequest,
  validateRetrievalResponse,
  type RetrievalRequest,
  type RetrievalResponse,
} from '@astrospec/retrieval-profile';
import type { AstroSpecTurn } from '@astrospec/runtime';

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'astrospec-agent-contracts',
  'examples',
  'agent-turns',
);

function readFixture(name: string) {
  const file = path.join(fixturesDir, name);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

const retrievalRequest: RetrievalRequest = {
  requestId: 'req_1',
  query: 'Find the retention policy',
  techniques: ['pageindex', 'graph'],
};

const retrievalResponse: RetrievalResponse = {
  ok: true,
  requestId: 'req_1',
  techniqueRequested: ['pageindex', 'graph'],
  techniqueUsed: ['pageindex', 'graph_expand'],
  results: [
    {
      candidateId: 'cand_1',
      sourceId: 'src_policy_v2',
      ref: 'astrospec://sources/src_policy_v2',
      kind: 'document',
      stage: 'retrieve',
    },
  ],
  citations: [
    {
      citationId: 'cit_1',
      candidateId: 'cand_1',
    },
  ],
  grounding: {
    supported: true,
    confidence: 0.9,
  },
};

test('exports canonical MCP tool names and error codes', () => {
  assert.deepEqual(ASTROSPEC_MCP_TOOL_NAMES, [
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
  ]);

  assert.ok(ASTROSPEC_MCP_ERROR_CODES.includes('AS_MCP_INVALID_INPUT'));
  assert.ok(ASTROSPEC_MCP_ERROR_CODES.includes('AS_MCP_CONTRACT_INVALID'));
  assert.ok(ASTROSPEC_MCP_ERROR_CODES.includes('AS_MCP_VERIFICATION_FAILED'));
  assert.ok(ASTROSPEC_MCP_ERROR_CODES.includes('AS_MCP_GOVERNANCE_INVALID'));
  assert.ok(ASTROSPEC_MCP_ERROR_CODES.includes('AS_MCP_RETRIEVAL_INVALID'));
  assert.ok(ASTROSPEC_MCP_ERROR_CODES.includes('AS_MCP_GROUNDING_FAILED'));
});

test('plan-turn MCP tool parity with direct validator', async () => {
  const plan = readFixture('plan.valid.json');
  const direct = validatePlanTurn(plan);
  const viaMcp = await callAstroSpecMcpTool({
    name: 'astrospec.plan_turn.generate',
    arguments: { planTurn: plan },
  });

  assert.equal(direct.ok, true);
  assert.equal(viaMcp.ok, true);
  if (viaMcp.ok) {
    assert.deepEqual(viaMcp.result, { planTurn: plan });
  }
});

test('contract.validate parity with direct validators for supported kinds', async () => {
  const now = new Date().toISOString();

  const validCases: Array<{
    kind: AstroSpecContractKind;
    payload: unknown;
    direct: (value: unknown) => { ok: boolean; errors: string[] };
  }> = [
    { kind: 'plan-turn', payload: readFixture('plan.valid.json'), direct: validatePlanTurn },
    { kind: 'exec-turn', payload: readFixture('exec.valid.json'), direct: validateExecTurn },
    { kind: 'tool-policy-spec', payload: readFixture('tool-policy-spec.valid.json'), direct: validateToolPolicySpec },
    { kind: 'tool-call-record', payload: readFixture('tool-call-record.valid.json'), direct: validateToolCallRecord },
    {
      kind: 'repopack',
      payload: {
        repoRoot: '/tmp/repo',
        generatedAt: now,
        files: [{ path: 'README.md', rationale: 'entrypoint context', content: '# demo' }],
      },
      direct: validateRepoPack,
    },
    {
      kind: 'run-log-entry',
      payload: { id: 'log_1', runId: 'run_1', phase: 'run.start', createdAt: now, status: 'ok' },
      direct: validateRunLogEntry,
    },
    { kind: 'chat-orchestration-audit', payload: readFixture('chat-orchestration-audit.valid.json'), direct: validateChatOrchestrationAudit },
    { kind: 'git-history-summary', payload: readFixture('git-history-summary.valid.json'), direct: validateGitHistorySummary },
    { kind: 'retrieval-request', payload: retrievalRequest, direct: validateRetrievalRequest },
    { kind: 'retrieval-response', payload: retrievalResponse, direct: validateRetrievalResponse },
  ];

  for (const c of validCases) {
    const direct = c.direct(c.payload);
    const viaMcp = await callAstroSpecMcpTool({
      name: 'astrospec.contract.validate',
      arguments: { kind: c.kind, payload: c.payload },
    });

    assert.equal(direct.ok, true, `direct validation should pass for kind=${c.kind}`);
    assert.equal(viaMcp.ok, true, `mcp validation should pass for kind=${c.kind}`);
  }
});

test('turn.verify returns verification failure code when criterion fails', async () => {
  const turn: AstroSpecTurn = {
    kind: 'turn',
    id: 'turn:mcp-test',
    intent: 'check-output',
    inheritsFrom: 'ctx:mcp-test',
    fields: {},
    acceptanceCriteria: [
      {
        id: 'is_ok_true',
        description: 'Output must have ok=true',
        verifier: 'equals',
        params: { value: { ok: true } },
      },
    ],
    lockedAt: '2026-02-28T00:00:00.000Z' as AstroSpecTurn['lockedAt'],
  };

  const out = await callAstroSpecMcpTool({
    name: 'astrospec.turn.verify',
    arguments: { turn, output: { ok: false } },
  });

  assert.equal(out.ok, false);
  if (!out.ok) {
    assert.equal(out.error.code, 'AS_MCP_VERIFICATION_FAILED');
  }
});

test('retrieval tools validate requests and grounding results', async () => {
  const query = await callAstroSpecMcpTool({
    name: 'astrospec.retrieval.query',
    arguments: { request: retrievalRequest },
  });
  assert.equal(query.ok, true);

  const verifyOk = await callAstroSpecMcpTool({
    name: 'astrospec.retrieval.verify',
    arguments: { response: retrievalResponse },
  });
  assert.equal(verifyOk.ok, true);

  const verifyFail = await callAstroSpecMcpTool({
    name: 'astrospec.retrieval.verify',
    arguments: {
      response: {
        ...retrievalResponse,
        grounding: {
          supported: false,
          unsupportedClaims: ['claim_1'],
        },
      },
    },
  });
  assert.equal(verifyFail.ok, false);
  if (!verifyFail.ok) {
    assert.equal(verifyFail.error.code, 'AS_MCP_GROUNDING_FAILED');
  }
});

test('memory and graph tools normalize request envelopes', async () => {
  const memoryRead = await callAstroSpecMcpTool({
    name: 'astrospec.memory.read',
    arguments: { namespace: 'policy', key: 'retention.default' },
  });
  assert.equal(memoryRead.ok, true);

  const memoryWrite = await callAstroSpecMcpTool({
    name: 'astrospec.memory.write',
    arguments: {
      record: {
        namespace: 'policy',
        key: 'retention.default',
        kind: 'semantic',
        content: { years: 7 },
        updatedAt: '2026-02-28T00:00:00.000Z',
      },
    },
  });
  assert.equal(memoryWrite.ok, true);

  const graphQuery = await callAstroSpecMcpTool({
    name: 'astrospec.graph.query',
    arguments: { graph: 'compliance', query: 'retention obligations', topK: 5 },
  });
  assert.equal(graphQuery.ok, true);

  const graphAssert = await callAstroSpecMcpTool({
    name: 'astrospec.graph.assert',
    arguments: {
      graph: 'compliance',
      nodeId: 'policy:retention',
      assertion: {
        subject: 'policy:retention',
        predicate: 'requiresYears',
        object: 7,
        assertedAt: '2026-02-28T00:00:00.000Z',
      },
    },
  });
  assert.equal(graphAssert.ok, true);
});

test('server can read retrieval and memory resources', () => {
  const server = createAstroSpecMcpProfileServer({
    retrievalRuns: [retrievalResponse],
    memories: [
      {
        namespace: 'policy',
        key: 'retention.default',
        kind: 'semantic',
        content: { years: 7 },
        updatedAt: '2026-02-28T00:00:00.000Z',
      },
    ],
    graphAssertions: [
      {
        graph: 'compliance',
        nodeId: 'policy:retention',
        assertion: {
          subject: 'policy:retention',
          predicate: 'requiresYears',
          object: 7,
          assertedAt: '2026-02-28T00:00:00.000Z',
        },
      },
    ],
  });

  const retrievalResource = server.readResource('astrospec://retrieval-runs/req_1');
  const memoryResource = server.readResource('astrospec://memories/policy/retention.default');
  const graphResource = server.readResource('astrospec://graphs/compliance/policy%3Aretention');

  assert.equal(retrievalResource.ok, true);
  assert.equal(memoryResource.ok, true);
  assert.equal(graphResource.ok, true);

  const retrievalUri = serializeRetrievalRunResource(retrievalResponse).uri;
  const memoryUri = serializeMemoryResource({
    namespace: 'policy',
    key: 'retention.default',
    kind: 'semantic',
    content: { years: 7 },
    updatedAt: '2026-02-28T00:00:00.000Z',
  }).uri;

  assert.equal(retrievalUri, 'astrospec://retrieval-runs/req_1');
  assert.equal(memoryUri, 'astrospec://memories/policy/retention.default');
});
