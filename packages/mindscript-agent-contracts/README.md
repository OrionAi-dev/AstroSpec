# @orionai/mindscript-agent-contracts

Schema contracts and validators for Starconsole plan/exec/tool payloads shared across repositories.

## What it provides

- JSON schemas for:
  - `PlanTurn`
  - `ExecTurn`
  - `RepoPack`
  - `RunLogEntry`
  - `ToolPolicySpec`
  - `ToolCallRecord`
- Runtime validators:
  - `validatePlanTurn`
  - `validateExecTurn`
  - `validateRepoPack`
  - `validateRunLogEntry`
  - `validateToolPolicySpec`
  - `validateToolCallRecord`
- Typed validation issue codes for deterministic integration handling.

## Commands

```bash
pnpm -F @orionai/mindscript-agent-contracts typecheck
pnpm -F @orionai/mindscript-agent-contracts test
pnpm -F @orionai/mindscript-agent-contracts build
```

## Release Checklist

1. Update schemas and examples together.
2. Run `pnpm -F @orionai/mindscript-agent-contracts typecheck`.
3. Run `pnpm -F @orionai/mindscript-agent-contracts test`.
4. Run `pnpm check:starconsole-contract-drift` at repo root.
5. Build package: `pnpm -F @orionai/mindscript-agent-contracts build`.
6. Confirm `exports`, `types`, and `files` in `package.json`.
7. Add changelog/changeset and version bump.
8. Publish and pin downstream consumers.
