# Starburst Profile

`@astrospec/starburst-profile` defines portable discovery outputs for burst-and-collapse reasoning workflows.

## Contracts

- `AbstractionOutput`
- `DomainPattern`
- `AnalogicalMapping`
- `HypothesisCandidate`
- `EvaluationScore`
- `SynthesisOutput`
- `MutationLineage`
- `EvaluationRound`
- `RefinementHistory`

## Score Dimensions

- `structuralValidity`
- `novelty`
- `feasibility`
- `reusability`
- `confidence`

AstroSpec standardizes the dimensions and envelopes, not a vendor’s final weighting formula.

## Lifecycle

The contracts support a reasoning flow like:

1. problem abstraction
2. domain expansion
3. analogical mapping
4. hypothesis generation
5. skeptical evaluation
6. synthesis

Mutation and refinement history are included as portable artifacts, but they do not imply a standard engine implementation.

## Boundary Rule

Mode names such as `Supernova`, `Redshift`, or `Event Horizon` are valid runtime concepts, but they are not normative AstroSpec semantics by default.
