# Consumer Quickstart: MCP-Native

## Install

```bash
npm i @openspec/mcp-profile @openspec/retrieval-profile
```

## Validate a Retrieval Query Tool Envelope

```ts
import { callOpenSpecMcpTool } from '@openspec/mcp-profile';

const out = await callOpenSpecMcpTool({
  name: 'openspec.retrieval.query',
  arguments: {
    request: {
      query: 'Find the retention policy',
      techniques: ['pageindex', 'graph']
    }
  }
});

if (!out.ok) {
  console.error(out.error.code, out.error.message);
}
```

## Why This Path

Use this when your runtime already speaks MCP and you want canonical OpenSpec tool/resource behavior.
