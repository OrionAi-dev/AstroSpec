# Migration: `@orionai/*` to `@mindscript/*`

## Canonical Packages

- `@mindscript/agent-contracts`
- `@mindscript/mcp-profile`

## Compatibility Aliases (Deprecated)

- `@orionai/mindscript-agent-contracts` -> `@mindscript/agent-contracts`
- `@orionai/mindscript-mcp-profile` -> `@mindscript/mcp-profile`

## Import Mapping

```ts
// before
import { validatePlanTurn } from '@orionai/mindscript-agent-contracts';

// after
import { validatePlanTurn } from '@mindscript/agent-contracts';
```

```ts
// before
import { callMindscriptMcpTool } from '@orionai/mindscript-mcp-profile';

// after
import { callMindscriptMcpTool } from '@mindscript/mcp-profile';
```

## Compatibility Window

Aliases remain available for migration, but all new integrations should use `@mindscript/*`.
