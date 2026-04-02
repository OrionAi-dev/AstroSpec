# Migration: `@orionai/*` to `@openspec/*`

## Canonical Packages

- `@openspec/agent-contracts`
- `@openspec/mcp-profile`

## Removed Packages

The old OrionAI-scoped compatibility wrappers are not part of the OpenSpec public surface and are no longer published from this repo.

- `@orionai/openspec-agent-contracts`
- `@orionai/openspec-mcp-profile`

## Import Mapping

```ts
// before
import { validatePlanTurn } from '@orionai/openspec-agent-contracts';

// after
import { validatePlanTurn } from '@openspec/agent-contracts';
```

```ts
// before
import { callOpenSpecMcpTool } from '@orionai/openspec-mcp-profile';

// after
import { callOpenSpecMcpTool } from '@openspec/mcp-profile';
```

## Migration Rule

All integrations must move directly to `@openspec/*`. There is no OpenSpec-era OrionAI compatibility wrapper.
