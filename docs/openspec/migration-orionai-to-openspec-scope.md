# Migration: `@orionai/*` to `@astrospec/*`

## Canonical Packages

- `@astrospec/agent-contracts`
- `@astrospec/mcp-profile`

## Removed Packages

The old OrionAI-scoped compatibility wrappers are not part of the AstroSpec public surface and are no longer published from this repo.

- `@orionai/astrospec-agent-contracts`
- `@orionai/astrospec-mcp-profile`

## Import Mapping

```ts
// before
import { validatePlanTurn } from '@orionai/astrospec-agent-contracts';

// after
import { validatePlanTurn } from '@astrospec/agent-contracts';
```

```ts
// before
import { callAstroSpecMcpTool } from '@orionai/astrospec-mcp-profile';

// after
import { callAstroSpecMcpTool } from '@astrospec/mcp-profile';
```

## Migration Rule

All integrations must move directly to `@astrospec/*`. There is no AstroSpec-era OrionAI compatibility wrapper.
