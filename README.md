# MindScript (formerly OpenSpec)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/OrionAi-dev/MindScript)](https://github.com/OrionAi-dev/MindScript/releases/latest)
[![Docs](https://img.shields.io/badge/docs-whitepaper-success)](./docs/mindscript/whitepaper.md)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/OrionAi-dev/MindScript/issues)

---

**MindScript is a vendor-neutral contract language for humans, LLMs, agents, and tools.**

It is designed to make intent, constraints, acceptance criteria, and machine-readable execution contracts explicit before generation or action.

MindScript can be used as:

- a requirements and acceptance-criteria language
- an LLM-to-LLM and agent-to-agent contract layer
- a schema surface for deterministic validation and interoperability
- a protocol layer over MCP or direct schema validation flows

📄 [Read the white paper (Markdown)](./docs/mindscript/whitepaper.md)  
⬇️ [Get the latest release](https://github.com/OrionAi-dev/MindScript/releases/latest)

---

## Table of Contents
- [What is MindScript](#what-is-mindscript)
- [Core Principles](#core-principles)
- [Why it matters](#why-it-matters)
- [Technical alignment](#technical-alignment)
- [Applications](#applications)
- [BDD providers](#bdd-providers)
- [Quick start](#quick-start)
- [AI developer quickstarts](#ai-developer-quickstarts)
- [Release expectations](#release-expectations)
- [Contributing](#contributing)
- [License](#license)

---

## What is MindScript

MindScript provides a structured way to define intent, requirements, constraints, and verification criteria in forms that both humans and machines can use.

That means it is not only a spec-authoring format. It is also a contract language that can sit between:

- humans and AI systems
- one model and another model
- agents and tool runtimes
- planning layers and execution layers

The requirements-first/spec-first workflow remains an important use case, but it is no longer the only correct description of the project.

### Naming note

This repository is not affiliated with the separate “MindScript” programming language project (and its `msg` CLI) from Daios.

---

## Core Principles
- **Intent before generation**: clarify what must happen before asking a model or runtime to act.
- **Acceptance criteria first**: define “done” and “valid” up front.
- **Machine-readable contracts**: contracts should be structured enough for deterministic validation.
- **Interoperability**: MindScript should work across runtimes, tools, and integration styles.
- **Traceability**: keep a clear line from intent to output to verification.
- **Extensibility**: support new domains without breaking the public contract model.
- **Fail-closed semantics**: validation and contract enforcement should prefer explicit failure over ambiguous interpretation.

---

## Why it matters
- **For humans**: requirements, criteria, and expectations become explicit instead of implied.
- **For models**: prompts can terminate in stable machine-readable envelopes rather than brittle free text.
- **For agents**: planning, handoff, and execution can be validated and replayed more safely.
- **For organizations**: policy, compliance, legal, and software workflows can share a common contract vocabulary.

---

## Technical alignment
MindScript is a protocol and contract layer, not just a document format.

It currently aligns around:

- **Structured nodes**: requirements, fields, criteria, references, and envelopes are explicit.
- **MCP-native interoperability**: MCP is the default tool/profile integration path.
- **Schema-first fallback**: direct schema validation remains supported when MCP is unavailable.
- **Deterministic error semantics**: compatibility depends on stable validation and error behavior.
- **Extensible profiles**: domain-specific profiles can be layered without redefining the core contract language.

---

## Applications
- **Software engineering**: define features and acceptance criteria before implementation.
- **Legal drafting**: define obligations, clauses, constraints, and review expectations explicitly.
- **Compliance and governance**: encode policy expectations and verification rules.
- **Enterprise knowledge workflows**: make structured intent portable across teams and systems.
- **AI and automation**: use MindScript as the contract layer between planners, executors, reviewers, and tools.

---

## BDD providers

MindScript references executable scenarios through `bdd_ref`. Use any supported provider:

- Cucumber  
- Behave  
- Behat  
- JBehave  
- Karate  
- Robot  
- SpecFlow  
- **MindScript Core (formerly OpenSpec Core)**: a minimal YAML BDD format for domains without a native BDD stack, and for teams that want a flexible, schema-validated BDD language.  
  - Docs: `docs/integrations/bdd/openspec.core/README.md`  
  - Schema: `docs/integrations/bdd/openspec.core/schema.yaml`  
  - Example: `docs/integrations/bdd/openspec.core/examples/AUTH-101.core.yaml`

**Example: referencing `openspec.core` from a spec**
```yaml
profile: https://mindscript.dev/profiles/@software
kind: software
meta:
  id: AUTH-101
  title: User can log in with email and password
  owner: app-auth
  priority: P0

requirements:
  - id: AUTH-101.1
    statement: Users can authenticate with valid credentials
    criteria:
      - id: AUTH-101.1.1
        type: functional
        text: Valid credentials produce a successful session
        bdd_ref:
          source: https://mindscript.dev/profiles/bdd/openspec.core
          path: docs/integrations/bdd/openspec.core/examples/AUTH-101.core.yaml
          scenario: auth-login-success
```

---

## Quick start
1. Read the protocol quickstart: [docs/mindscript/quickstart.md](./docs/mindscript/quickstart.md).
2. Review the public adoption charter: [docs/mindscript/adoption-charter.md](./docs/mindscript/adoption-charter.md).
3. Review the protocol and spec overviews:
   - [docs/mindscript/protocol.md](./docs/mindscript/protocol.md)
   - [docs/mindscript/spec-overview.md](./docs/mindscript/spec-overview.md)
4. (Optional) Build the white paper PDF locally with Pandoc:
   ```bash
   pandoc docs/mindscript/whitepaper.md -o docs/mindscript/whitepaper.pdf
   ```

---

## AI developer quickstarts

Canonical public packages:

- `@mindscript/agent-contracts`
- `@mindscript/mcp-profile`
- `@mindscript/kit`

Quickstarts:

1. MCP-native path (default): [docs/mindscript/consumer-quickstart-mcp.md](./docs/mindscript/consumer-quickstart-mcp.md)
2. Schema-first fallback path: [docs/mindscript/consumer-quickstart-schema.md](./docs/mindscript/consumer-quickstart-schema.md)
3. Package migration map: [docs/mindscript/migration-orionai-to-mindscript-scope.md](./docs/mindscript/migration-orionai-to-mindscript-scope.md)
4. Minimal external E2E sample: [examples/external/mcp-default-fallback/README.md](./examples/external/mcp-default-fallback/README.md)

Compatibility aliases are available for existing users:

- `@orionai/mindscript-agent-contracts` (deprecated, wraps `@mindscript/agent-contracts`)
- `@orionai/mindscript-mcp-profile` (deprecated, wraps `@mindscript/mcp-profile`)

---

## API docs regeneration
To refresh the TypeDoc-generated API docs locally:

```bash
pnpm install
pnpm -r build
bash tools/gen-docs.sh
node tools/clean-doc-links.mjs --write
```

The scripts write API output to `docs/api/` and normalize internal links for MkDocs.
CI validates that `docs/` stays in sync with generated output, so ensure
`git diff -- docs/` is clean before pushing.

## Release expectations
- We use **SemVer + Changesets** for package versioning across the monorepo.
- Pre-1.0 releases treat **minor** versions as breaking changes, and **patch** as backwards-compatible fixes/features.
- Every release should be tagged `v<version>` and include release notes tied to the changesets.
- See the release guide for the full workflow: [docs/mindscript/release.md](./docs/mindscript/release.md).

---

## Contributing
Ideas, issues, and pull requests are welcome.

Useful contributions include:

- example specs and contract envelopes
- deterministic validation and compatibility improvements
- profile adapters and MCP integrations
- docs that clarify how MindScript works across human and machine workflows

---

## License
Copyright © 2025 Michael Gregory Mahoney

Licensed under the [Apache License 2.0](./LICENSE).
