# Compatibility Policy

## Core Contracts

1. Core contracts are conservative and additive-first.
2. Field removals or semantic changes require migration guidance.
3. Deterministic error semantics are part of the public contract.
4. A consumer should be able to keep using older valid payloads unless a documented major compatibility shift is announced.

## Profiles

1. Profiles version independently from core.
2. Profiles may move faster, but must publish compatibility expectations.
3. A profile must not silently change required semantics.

## Standard-Ready Claim

An AstroSpec surface should not be described as standard-ready unless it has:

- schema
- validator
- docs
- examples
- conformance fixtures
- explicit compatibility and versioning story
