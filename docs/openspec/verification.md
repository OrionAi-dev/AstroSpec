# Verification

OpenSpec verification checks whether an output satisfies a contract.

## Core Verification

Core verification is framework-agnostic.

A criterion contains:

- `id`
- `description`
- `verifier`
- optional `params`
- optional `evidence`

Core verifiers remain small and deterministic.

## Retrieval and Grounding

The retrieval profile does not replace core verification. It adds portable outputs that verification systems can inspect:

- citations
- evidence spans
- grounding assessment
- retrieval diagnostics

This keeps grounding visible as part of the output contract instead of hidden in implementation logs.

## Built-In Core Verifiers

Core still ships:

- `equals`
- `contains_fields`
- `regex_match`
- `count_between`
- `json_schema`
- `artifact_exists`

Retrieval-specific verifiers belong in the retrieval profile or higher-level integrations, not in core.
