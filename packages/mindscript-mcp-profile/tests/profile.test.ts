import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  callMindscriptMcpTool,
  createMindscriptMcpProfileServer,
  MINDSCRIPT_MCP_ERROR_CODES,
  MINDSCRIPT_MCP_TOOL_NAMES,
  type MindscriptContractKind,
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
} from '@mindscript/agent-contracts';
import type { MindScriptTurn } from '@mindscript/runtime';

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'mindscript-agent-contracts',
  'examples',
  'agent-turns',
);

function readFixture(name: string) {
  const file = path.join(fixturesDir, name);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

test('exports canonical MCP tool names and error codes', () => {
  assert.deepEqual(MINDSCRIPT_MCP_TOOL_NAMES, [
    'mindscript.plan_turn.generate',
    'mindscript.exec_turn.generate',
    'mindscript.turn.verify',
    'mindscript.contract.validate',
    'mindscript.governance.approval.challenge',
    'mindscript.governance.approval.commit',
  ]);

  assert.ok(MINDSCRIPT_MCP_ERROR_CODES.includes('MS_MCP_INVALID_INPUT'));
  assert.ok(MINDSCRIPT_MCP_ERROR_CODES.includes('MS_MCP_CONTRACT_INVALID'));
  assert.ok(MINDSCRIPT_MCP_ERROR_CODES.includes('MS_MCP_VERIFICATION_FAILED'));
  assert.ok(MINDSCRIPT_MCP_ERROR_CODES.includes('MS_MCP_GOVERNANCE_INVALID'));
});

test('plan-turn MCP tool parity with direct validator', async () => {
  const plan = readFixture('plan.valid.json');
  const direct = validatePlanTurn(plan);
  const viaMcp = await callMindscriptMcpTool({
    name: 'mindscript.plan_turn.generate',
    arguments: { planTurn: plan },
  });

  assert.equal(direct.ok, true);
  assert.equal(viaMcp.ok, true);
  if (viaMcp.ok) {
    assert.deepEqual(viaMcp.result, { planTurn: plan });
  }
});

test('exec-turn MCP tool parity with direct validator', async () => {
  const exec = readFixture('exec.valid.json');
  const direct = validateExecTurn(exec);
  const viaMcp = await callMindscriptMcpTool({
    name: 'mindscript.exec_turn.generate',
    arguments: { execTurn: exec },
  });

  assert.equal(direct.ok, true);
  assert.equal(viaMcp.ok, true);
  if (viaMcp.ok) {
    assert.deepEqual(viaMcp.result, { execTurn: exec });
  }
});

test('contract.validate parity with direct validators for all supported kinds (valid payloads)', async () => {
  const now = new Date().toISOString();

  const validCases: Array<{
    kind: MindscriptContractKind;
    payload: unknown;
    direct: (value: unknown) => { ok: boolean; errors: string[] };
  }> = [
    {
      kind: 'plan-turn',
      payload: readFixture('plan.valid.json'),
      direct: validatePlanTurn,
    },
    {
      kind: 'exec-turn',
      payload: readFixture('exec.valid.json'),
      direct: validateExecTurn,
    },
    {
      kind: 'tool-policy-spec',
      payload: readFixture('tool-policy-spec.valid.json'),
      direct: validateToolPolicySpec,
    },
    {
      kind: 'tool-call-record',
      payload: readFixture('tool-call-record.valid.json'),
      direct: validateToolCallRecord,
    },
    {
      kind: 'repopack',
      payload: {
        repoRoot: '/tmp/repo',
        generatedAt: now,
        files: [
          {
            path: 'README.md',
            rationale: 'entrypoint context',
            content: '# demo',
          },
        ],
      },
      direct: validateRepoPack,
    },
    {
      kind: 'run-log-entry',
      payload: {
        id: 'log_1',
        runId: 'run_1',
        phase: 'run.start',
        createdAt: now,
        status: 'ok',
      },
      direct: validateRunLogEntry,
    },
    {
      kind: 'chat-orchestration-audit',
      payload: readFixture('chat-orchestration-audit.valid.json'),
      direct: validateChatOrchestrationAudit,
    },
    {
      kind: 'git-history-summary',
      payload: readFixture('git-history-summary.valid.json'),
      direct: validateGitHistorySummary,
    },
  ];

  for (const c of validCases) {
    const direct = c.direct(c.payload);
    const viaMcp = await callMindscriptMcpTool({
      name: 'mindscript.contract.validate',
      arguments: {
        kind: c.kind,
        payload: c.payload,
      },
    });

    assert.equal(direct.ok, true, `direct validation should pass for kind=${c.kind}`);
    assert.equal(viaMcp.ok, true, `mcp validation should pass for kind=${c.kind}`);

    if (viaMcp.ok) {
      assert.deepEqual(viaMcp.result, { kind: c.kind, valid: true });
    }
  }
});

test('contract.validate parity with direct validators for all supported kinds (invalid payloads)', async () => {
  const invalidCases: Array<{
    kind: MindscriptContractKind;
    payload: unknown;
    direct: (value: unknown) => { ok: boolean; errors: string[] };
  }> = [
    {
      kind: 'plan-turn',
      payload: readFixture('plan.invalid.missing-checks.json'),
      direct: validatePlanTurn,
    },
    {
      kind: 'exec-turn',
      payload: {},
      direct: validateExecTurn,
    },
    {
      kind: 'tool-policy-spec',
      payload: readFixture('tool-policy-spec.invalid.missing-required.json'),
      direct: validateToolPolicySpec,
    },
    {
      kind: 'tool-call-record',
      payload: readFixture('tool-call-record.invalid.bad-status.json'),
      direct: validateToolCallRecord,
    },
    {
      kind: 'repopack',
      payload: {
        repoRoot: '/tmp/repo',
        generatedAt: 'not-a-date',
        files: [{ path: 'README.md' }],
      },
      direct: validateRepoPack,
    },
    {
      kind: 'run-log-entry',
      payload: {
        id: 'log_1',
        runId: 'run_1',
        phase: 'run.start',
        createdAt: 'not-a-date',
      },
      direct: validateRunLogEntry,
    },
    {
      kind: 'chat-orchestration-audit',
      payload: readFixture('chat-orchestration-audit.invalid.missing-trace.json'),
      direct: validateChatOrchestrationAudit,
    },
    {
      kind: 'git-history-summary',
      payload: {},
      direct: validateGitHistorySummary,
    },
  ];

  for (const c of invalidCases) {
    const direct = c.direct(c.payload);
    const viaMcp = await callMindscriptMcpTool({
      name: 'mindscript.contract.validate',
      arguments: {
        kind: c.kind,
        payload: c.payload,
      },
    });

    assert.equal(direct.ok, false, `direct validation should fail for kind=${c.kind}`);
    assert.equal(viaMcp.ok, false, `mcp validation should fail for kind=${c.kind}`);

    if (!viaMcp.ok) {
      assert.equal(viaMcp.error.code, 'MS_MCP_CONTRACT_INVALID');
      assert.ok(viaMcp.error.details);
    }
  }
});

test('turn.verify returns verification failure code when criterion fails', async () => {
  const turn: MindScriptTurn = {
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
    lockedAt: new Date().toISOString() as MindScriptTurn['lockedAt'],
  };

  const out = await callMindscriptMcpTool({
    name: 'mindscript.turn.verify',
    arguments: {
      turn,
      output: { ok: false },
    },
  });

  assert.equal(out.ok, false);
  if (!out.ok) {
    assert.equal(out.error.code, 'MS_MCP_VERIFICATION_FAILED');
  }
});

test('reference server serializes context/turn/verification resources', async () => {
  const now = new Date().toISOString() as MindScriptTurn['lockedAt'];
  const turn: MindScriptTurn = {
    kind: 'turn',
    id: 'turn:resource',
    intent: 'noop',
    inheritsFrom: 'ctx:resource',
    fields: {},
    acceptanceCriteria: [],
    lockedAt: now,
  };

  const server = createMindscriptMcpProfileServer({
    contexts: [
      {
        kind: 'context',
        id: 'ctx:resource',
        intent: 'resource-test',
        scope: { type: 'session' },
        lifespan: { mode: 'session' },
        fields: {},
        acceptanceCriteria: [],
        lockedAt: now,
      },
    ],
    turns: [turn],
    verifications: [
      {
        id: 'verify:resource',
        report: {
          contextId: 'ctx:resource',
          turnId: 'turn:resource',
          overall: true,
          results: [],
          at: now,
        },
      },
    ],
  });

  const c = server.readResource('mindscript://context/ctx%3Aresource');
  const t = server.readResource('mindscript://turn/turn%3Aresource');
  const v = server.readResource('mindscript://verification/verify%3Aresource');

  assert.equal(c.ok, true);
  assert.equal(t.ok, true);
  assert.equal(v.ok, true);

  if (c.ok) {
    const parsed = JSON.parse(c.result.text) as { id: string };
    assert.equal(parsed.id, 'ctx:resource');
  }

  if (t.ok) {
    const parsed = JSON.parse(t.result.text) as { id: string };
    assert.equal(parsed.id, 'turn:resource');
  }

  if (v.ok) {
    const parsed = JSON.parse(v.result.text) as { turnId?: string };
    assert.equal(parsed.turnId, 'turn:resource');
  }

  const bad = server.readResource('mindscript://unsupported/x');
  assert.equal(bad.ok, false);
  if (!bad.ok) {
    assert.equal(bad.error.code, 'MS_MCP_INVALID_INPUT');
  }
});
