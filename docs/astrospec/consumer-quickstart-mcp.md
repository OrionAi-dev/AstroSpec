# Consumer Quickstart: MCP-Native

## Install

```bash
npm i @astrospec/mcp-profile @astrospec/retrieval-profile
```

## Validate a Retrieval Query Tool Envelope

```ts
import { callAstroSpecMcpTool } from '@astrospec/mcp-profile';

const out = await callAstroSpecMcpTool({
  name: 'astrospec.retrieval.query',
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

Use this when your runtime already speaks MCP and you want canonical AstroSpec tool/resource behavior.
