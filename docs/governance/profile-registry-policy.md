# Profile Registry Policy

Profiles are how AstroSpec adds portable domain contracts without bloating core.

## Rules

1. Profiles must be explicitly named and versioned.
2. Profiles must not redefine core semantics.
3. Profiles may evolve faster than core, but must publish compatibility expectations.
4. Vendor-specific extensions must not present themselves as normative profiles.

## Required Assets

A profile is not registry-ready unless it ships with:

- schemas
- validators
- examples
- docs
- conformance fixtures
- deterministic reason codes where applicable
