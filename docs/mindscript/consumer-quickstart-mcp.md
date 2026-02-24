# Consumer Quickstart: MCP-Native

## Install

```bash
npm i @mindscript/mcp-profile
```

## Validate via MCP Tool Contract

```ts
import { callMindscriptMcpTool } from '@mindscript/mcp-profile';

const out = await callMindscriptMcpTool({
  name: 'mindscript.contract.validate',
  arguments: {
    kind: 'run-log-entry',
    payload: {
      id: 'log_1',
      runId: 'run_1',
      phase: 'run.start',
      createdAt: new Date().toISOString(),
      status: 'ok'
    }
  }
});

if (!out.ok) {
  console.error(out.error.code, out.error.message);
}
```

## Why this path

Use this when your orchestrator already speaks MCP and you want deterministic MindScript tool semantics.

## Minimal External E2E

- `examples/external/mcp-default-fallback/README.md`
