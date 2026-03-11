# Quickstart (MCP-Default)

This quickstart uses the **MCP-native profile** as the default integration path and keeps direct schema validation as the fallback path.

## 1. Install

```bash
npm i @astrospec/mcp-profile @astrospec/kit
```

## 2. Default Path: Validate Through MCP Tool Contract

```ts
import { callAstroSpecMcpTool } from '@astrospec/mcp-profile';

const payload = {
  id: 'log_1',
  runId: 'run_1',
  phase: 'run.start',
  createdAt: new Date().toISOString(),
  status: 'ok',
};

const out = await callAstroSpecMcpTool({
  name: 'astrospec.contract.validate',
  arguments: {
    kind: 'run-log-entry',
    payload,
  },
});

if (!out.ok) {
  console.error(out.error.code, out.error.message);
}
```

## 3. Fallback Path: Direct Schema Validation (No MCP)

```ts
import { validate } from '@astrospec/kit';

const out = validate('run-log-entry', {
  id: 'log_1',
  runId: 'run_1',
  phase: 'run.start',
  createdAt: new Date().toISOString(),
  status: 'ok',
});

if (!out.ok) {
  console.error(out.nextHint);
  console.error(out.errors);
}
```

## 4. Deterministic Parity Requirement

The contract rule is:

1. If direct validation passes, MCP validation for the same payload must pass.
2. If direct validation fails, MCP must fail with deterministic contract error code (`AS_MCP_CONTRACT_INVALID`).

## 5. Next Steps

1. MCP-native integration guide: [consumer-quickstart-mcp.md](./consumer-quickstart-mcp.md)
2. Fallback/no-MCP guide: [consumer-quickstart-schema.md](./consumer-quickstart-schema.md)
3. Full Context/Turn/verification lifecycle: [context-turn.md](./context-turn.md) and [verification.md](./verification.md)
4. Minimal external E2E sample: `examples/external/mcp-default-fallback/README.md`
