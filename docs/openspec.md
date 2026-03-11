# OpenSpec

OpenSpec is the verification and policy layer for MCP Secure Context Sharing.

It provides:

- provenance
- validation
- permissions
- expiration controls
- sensitivity labeling
- optional signing

## Policy metadata

OpenSpec policy metadata answers:

- who can receive this context
- what actions are allowed
- why the share exists
- how sensitive the content is
- when the share expires
- whether re-sharing is allowed

## Provenance

OpenSpec provenance records:

- who created the container
- when it was created
- what source lineage exists
- which source or artifact references support it
- how it was derived

## Verification

OpenSpec verification adds:

- digest/hash
- validation status
- optional signature bundle
- issuer and verifier identifiers
- expiry and revocation metadata

## Layering rule

Context containers should still be usable without full OpenSpec hardening.

OpenSpec is the stronger trust layer, not a mandatory weight on every exchange.
