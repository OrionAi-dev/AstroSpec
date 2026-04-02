# Consumer Quickstart: Schema-First / No-MCP Mode

## Install

```bash
npm i @openspec/runtime @openspec/retrieval-profile
```

## Validate a Retrieval Request

```ts
import { validateRetrievalRequest } from '@openspec/retrieval-profile';

const out = validateRetrievalRequest({
  query: 'Find the retention policy',
  techniques: ['pageindex', 'graph']
});

if (!out.ok) {
  console.error(out.errors);
}
```

## Why This Path

Use this when you want deterministic contract validation before you adopt MCP plumbing.
