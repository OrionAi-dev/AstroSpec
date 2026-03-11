# Evidence and Provenance

AstroSpec treats evidence and provenance as first-class contract concerns.

## Evidence

`EvidenceRef` supports:

- `ref`
- optional `kind`
- optional `selector`
- optional `checksum`
- optional `sourceId`
- optional `span`
- optional `retrieval`

This makes it possible to cite exact source spans and carry retrieval-stage metadata without redefining core contracts per product.

## Provenance

`ProvenanceEntry` supports:

- `source`
- `at`
- optional `field`
- optional `actor`
- optional `note`
- optional `data`
- optional `entityId`
- optional `activityId`
- optional `agentId`
- optional `role`
- optional `derivedFrom`

These extra fields are additive and align loosely with W3C PROV concepts.

## Design Intent

Evidence answers: **what supports this?**

Provenance answers: **how did this get here?**

The retrieval profile builds on these core fields rather than inventing a separate provenance system.

## Practical Rule

If a system needs to justify an answer, trace a memory write, or explain a graph assertion, AstroSpec should carry that through evidence and provenance rather than hidden logs or prompt text.
