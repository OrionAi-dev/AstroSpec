# MCP Secure Context Sharing Repo-Local Issues

## Active Chapter

### `#22` Run public release verification in CI

Status:

- open

Intended result:

- run `pnpm release:verify` in normal CI on pull requests and `main`
- catch publish-surface regressions before they reach the release workflow
- keep release docs explicit that CI and the release workflow enforce the same public release lane

Tracking rule:

- public GitHub issues stay sanitized and outcome-oriented
- downstream repo-specific implementation detail remains in the consumer repos
- future repo-local sprint docs should mirror the public issue tree exactly

## Recently Completed

- `#21` Stage the first public release plan for secure-context packages
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
