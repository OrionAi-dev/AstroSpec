# Consumer Quickstart: Fallback / No-MCP Mode (Schema-First, 5 Minutes)

## Install

```bash
npm i @mindscript/kit
```

## Validate a Plan Turn

```ts
import { validate } from '@mindscript/kit';

const payload = {
  objective: 'Summarize repo state',
  constraints: ['read-only'],
  assumptions: [],
  steps: [],
  toolIntents: [],
  completionChecks: []
};

const out = validate('plan-turn', payload);
if (!out.ok) {
  console.error(out.nextHint);
  console.error(out.errors);
}
```

## Why this path

Use this when you want deterministic contract validation without adopting MCP server plumbing first.

## Minimal External E2E

- `examples/external/mcp-default-fallback/README.md`
