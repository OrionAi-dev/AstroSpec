import assert from 'node:assert/strict';

import { callMindscriptMcpTool } from '../../../packages/mindscript-mcp-profile/src/index.ts';
import { validate } from '../../../packages/mindscript-kit/src/index.ts';

function print(label: string, value: unknown) {
  process.stdout.write(`${label}: ${JSON.stringify(value)}\n`);
}

async function main() {
  const validPayload = {
    id: 'log_1',
    runId: 'run_1',
    phase: 'run.start',
    createdAt: new Date().toISOString(),
    status: 'ok',
  };

  const directValid = validate('run-log-entry', validPayload);
  const mcpValid = await callMindscriptMcpTool({
    name: 'mindscript.contract.validate',
    arguments: {
      kind: 'run-log-entry',
      payload: validPayload,
    },
  });

  assert.equal(directValid.ok, true, 'direct valid payload should pass');
  assert.equal(mcpValid.ok, true, 'mcp valid payload should pass');

  const invalidPayload = {
    id: 'log_2',
    runId: 'run_2',
    phase: 'run.start',
    createdAt: 'not-a-date',
  };

  const directInvalid = validate('run-log-entry', invalidPayload);
  const mcpInvalid = await callMindscriptMcpTool({
    name: 'mindscript.contract.validate',
    arguments: {
      kind: 'run-log-entry',
      payload: invalidPayload,
    },
  });

  assert.equal(directInvalid.ok, false, 'direct invalid payload should fail');
  assert.equal(mcpInvalid.ok, false, 'mcp invalid payload should fail');
  if (!mcpInvalid.ok) {
    assert.equal(mcpInvalid.error.code, 'MS_MCP_CONTRACT_INVALID');
  }

  print('valid.direct', directValid);
  print('valid.mcp', mcpValid);
  print('invalid.direct', { ok: directInvalid.ok, errors: directInvalid.errors });
  print('invalid.mcp', mcpInvalid);

  process.stdout.write('external-e2e-result: ok\n');
}

main().catch((err) => {
  process.stderr.write(`external-e2e-result: fail ${String(err)}\n`);
  process.exit(1);
});

