# @astrospec/starburst-profile

Portable discovery and burst-collapse reasoning contracts for AstroSpec.

## What It Provides

- JSON schemas for discovery outputs and iterative refinement artifacts.
- Deterministic validators for Starburst profile contracts.
- Scoring envelopes for structural validity, novelty, feasibility, reusability, and confidence.
- A portable profile surface for discovery runtimes, not a proprietary engine.

## Scope

This package standardizes:

- abstraction outputs
- domain patterns
- analogical mappings
- hypothesis candidates
- evaluation rounds and scores
- synthesis outputs
- mutation lineage and refinement history

It does not implement ranking policy, constellation assembly, or mutation heuristics.

## Commands

```bash
pnpm -F @astrospec/starburst-profile typecheck
pnpm -F @astrospec/starburst-profile test
pnpm -F @astrospec/starburst-profile build
```
