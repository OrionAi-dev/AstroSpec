# Sprint: Cross-Repo Secure Context Hardening (2026-04-17)

## Goal

Make MCP Secure Context Sharing reliable for both:

- external tool consumers using the published packages directly
- vendored-contract consumers pinning exact release artifacts downstream

## Public Tracking

- `#15` Cross-repo secure context package hardening and public tracking
- `#16` Harden release artifacts and package graph for external consumers
- `#17` Add direct SDK ergonomics for local tool consumers
- `#18` Add workflow-control and bounded rationale container examples
- `#19` Document vendored-contract consumer validation and refresh expectations
- `#20` Align public adoption docs for external tools and contract consumers

## Passes

### Pass 1: Release Artifact Stability

- make packed artifacts behave like validated workspace builds
- add clean-install tarball validation for the secure-context package lane
- keep release verification aligned with the real public package contract

### Pass 2: Direct SDK Ergonomics

- expose a stable direct SDK lane for local tool consumers
- keep transport-facing adapter helpers as a separate lane
- document the direct SDK lane as the default local-tool path

### Pass 3: Workflow And Evidence Examples

- add additive workflow task-state examples
- add additive artifact or knowledge-object examples
- add bounded rationale or decision-summary examples

### Pass 4: Consumer Alignment

- document vendored release-artifact consumption at a high level
- align adoption docs for external tools and contract consumers
- keep public tracking sanitized and outcome-oriented

## Validation Gates

```bash
pnpm --filter @mcp-secure-context/openspec build
pnpm --filter @mcp-secure-context/sdk-typescript build
pnpm --filter @mcp-secure-context/mcp-adapter build
pnpm --filter @mcp-secure-context/sdk-typescript test
pnpm --filter @mcp-secure-context/openspec test
pnpm check:secure-context-artifacts
pnpm verify:adoption
```

## Notes

- public issues and sprint notes should describe goals, acceptance, and validation only
- downstream repo-specific implementation details stay out of this public sprint doc
- secure-context remains an interoperability layer, not the runtime core for consumers
