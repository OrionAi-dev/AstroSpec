# Vendored Release-Artifact Consumers

Some downstream consumers need exact, reproducible package artifacts rather than floating registry
resolution.

This repo supports that model, but treats it as a **downstream reproducibility strategy**, not as
the primary public package contract.

## Recommended Model

1. Treat the published package set as the canonical contract.
2. Build or fetch exact release artifacts from that contract.
3. Pin those artifacts downstream with exact versions.
4. Validate the pinned artifacts before adopting them in a downstream repo.

In other words:

- package semantics come from the release
- vendoring is a reproducibility and change-control choice

## What To Vendor

Vendor exact release artifacts for the package lane you actually consume.

Typical secure-context package lane:

- `@mcp-secure-context/core`
- `@mcp-secure-context/openspec`
- `@mcp-secure-context/mcp-adapter`
- `@mcp-secure-context/sdk-typescript`

If a downstream consumer also depends on OpenSpec packages directly, vendor the matching release
artifacts for those packages as the same refresh set.

## Validation Expectations

Before refreshing vendored artifacts downstream, validate that:

- packed artifacts import cleanly in a fresh consumer workspace
- direct SDK helpers behave as documented
- transport-facing adapter helpers still match the same container semantics
- conformance fixtures for workflow task state and bounded knowledge objects still validate

The upstream validation lane for that is:

```bash
pnpm check:secure-context-artifacts
pnpm verify:adoption
```

## Refresh Expectations

When refreshing vendored artifacts downstream:

- update the full dependent release set together
- pin exact versions
- prefer one refresh PR per release set
- rerun the downstream consumer's own build and contract checks after the refresh

Do not treat vendored artifacts as a substitute for upstream release validation. They should be a
mirror of validated release output.

## Boundary Rule

Vendored consumers should treat this repo as the contract authority for:

- portable context containers
- validation and verification helpers
- bounded transport-facing adapter semantics

They should not treat this repo as:

- their runtime core
- their workflow model
- their domain model
- their private product extension registry

Downstream private semantics should remain namespaced in the downstream consumer.
