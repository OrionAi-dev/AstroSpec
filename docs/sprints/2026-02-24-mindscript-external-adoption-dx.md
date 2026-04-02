# Sprint: OpenSpec External Adoption + AI Developer DX (2026-02-24)

## Goal

Make OpenSpec easy for external LLM vendors and AI developers to adopt with minimal coupling to Orion/Stardrive product internals.

## Scope

1. Neutral public package namespace (`@openspec/*`).
2. Compatibility wrappers for `@orionai/*` imports.
3. Simple adapter package (`@openspec/kit`) for 5-minute integration.
4. Protocol-first docs and quickstarts.
5. OSS governance baseline + compatibility policy.
6. Boundary and deep-import CI checks.

## Passes

### Pass 0: Adoption Contract Freeze

- Add `docs/openspec/adoption-charter.md`.
- Freeze public vs private extension rules.

### Pass 1: Namespace Neutralization

- Canonical package names:
  - `@openspec/agent-contracts`
  - `@openspec/mcp-profile`
- Add compatibility wrapper packages:
  - `@openspec/agent-contracts`
  - `@openspec/mcp-profile`

### Pass 2: AI Developer Easy Path

- Add `@openspec/kit` with:
  - `validate(kind, payload)`
  - `callTool(name, args)`
- Keep wrappers and advanced surfaces separate.

### Pass 3: Governance + Policy

- Add governance docs (`RFC`, compatibility, release, maintainers).
- Add breaking-change gate script.

### Pass 4: Integration Guardrails

- Add public boundary check (`check-public-boundaries`).
- Add deep import check (`check-deep-imports`).
- Keep cross-repo contract drift checks active.

### Pass 5: Migration + Adoption Docs

- Add migration map (`@orionai/*` -> `@openspec/*`).
- Add consumer quickstarts (schema-first, MCP-native).
- Update root README links and adoption guidance.

## Validation Gates

```bash
pnpm -F @openspec/agent-contracts typecheck
pnpm -F @openspec/agent-contracts test
pnpm -F @openspec/mcp-profile typecheck
pnpm -F @openspec/mcp-profile test
pnpm -F @openspec/kit typecheck
pnpm -F @openspec/kit test
pnpm check:public-boundaries
pnpm check:deep-imports
pnpm check:starconsole-contract-drift
```

## Deliverables

1. Public packages use neutral namespace.
2. Compatibility wrappers preserve existing consumers.
3. AI devs can integrate through one small package (`@openspec/kit`).
4. Governance and compatibility policy are explicit.
5. CI catches cross-brand coupling and deep import drift.
