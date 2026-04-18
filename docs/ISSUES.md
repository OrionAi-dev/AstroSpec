# MCP Secure Context Sharing Repo-Local Issues

## Active Chapter

### `#21` Stage the first public release plan for secure-context packages

Status:

- open

Intended result:

- fix the broken Changesets setup so the release workflow can compute a real version plan
- stage the missing release metadata for the recent secure-context SDK and workflow-profile hardening
- keep the public release docs explicit about the first contract-critical package set and release
  prerequisites

Tracking rule:

- public GitHub issues stay sanitized and outcome-oriented
- downstream repo-specific implementation detail remains in the consumer repos
- future repo-local sprint docs should mirror the public issue tree exactly

## Recently Completed

- `#15` Cross-repo secure context package hardening and public tracking
- `#16` Harden release artifacts and package graph for external consumers
- `#17` Add direct SDK ergonomics for local tool consumers
- `#18` Add workflow-control and bounded rationale container examples
- `#19` Document vendored-contract consumer validation and refresh expectations
- `#20` Align public adoption docs for external tools and contract consumers
- `#11` Publish Orion and StarConsole adoption guidance
- `#12` Clarify runtime-interface descriptor examples for Orion and StarConsole
- `#13` Add reasoning exchange guidance for Orion-style consumers
- `#14` Clarify MCP projection guidance without provider-standardization claims
