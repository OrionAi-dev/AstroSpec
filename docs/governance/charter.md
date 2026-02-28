# Governance Charter

AstroSpec is being developed as a neutral contract standard, not as a product-specific wrapper.

## Goals

1. Keep the core small, stable, and vendor-neutral.
2. Standardize domain profiles only when they improve real interoperability.
3. Require conformance assets for normative additions.
4. Separate core, profiles, integrations, and vendor extensions clearly.
5. Make multi-implementation adoption easier than custom one-off schemas.

## Scope Boundaries

AstroSpec standardizes contracts, schemas, validators, profiles, and interop mappings.

It does not standardize product internals such as ranking engines, vector stores, or proprietary orchestration logic.

## Neutrality Rule

Vendor-specific behavior may exist in downstream packages and extensions, but it must not masquerade as AstroSpec core or as a normative profile.

## Decision Rule

Normative additions require:

- schema
- validator
- docs
- example
- conformance fixture
- explicit compatibility story
