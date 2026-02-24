# MindScript (formerly OpenSpec)

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/OrionAi-dev/MindScript)](https://github.com/OrionAi-dev/MindScript/releases/latest)
[![Docs](https://img.shields.io/badge/docs-whitepaper-success)](./docs/mindscript/whitepaper.md)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/OrionAi-dev/MindScript/issues)

---

**A unified framework for defining requirements and acceptance criteria before creation, bridging software, legal, compliance, and AI workflows with clarity first.**

🔭 Clarity before creation • ✅ Acceptance criteria first • 🌐 Cross-domain  

📄 [Read the white paper (Markdown)](./docs/mindscript/whitepaper.md)  
⬇️ [Get the latest release](https://github.com/OrionAi-dev/MindScript/releases/latest)

---

## Table of Contents
- [What is MindScript](#what-is-mindscript)
- [Core Principles](#core-principles)
- [Benefits](#benefits)
- [Technical Alignment](#technical-alignment)
- [Applications](#applications)
- [BDD providers](#bdd-providers)
- [Quick start](#quick-start)
- [AI developer quickstarts](#ai-developer-quickstarts)
- [Release expectations](#release-expectations)
- [Contributing](#contributing)
- [License](#license)

---

## What is MindScript

MindScript (formerly OpenSpec) provides a clear way to define requirements and acceptance criteria before any document, code, or policy is created.  
It borrows proven ideas from behavior driven and requirements driven development, then applies them across domains where precision and alignment matter.

### Naming note

This repository is a specification/contract framework for requirements and acceptance criteria. It is not affiliated with the separate “MindScript” programming language project (and its `msg` CLI) from Daios.

---

## Core Principles
- **Requirements before generation**: clarity comes first.  
- **Acceptance criteria**: define “done” upfront.  
- **Unified language**: applies across domains.  
- **Transparency**: requirements are explicit and visible.  
- **Interoperability**: connects with existing tools and workflows.  
- **Traceability**: links intent to outputs for accountability.  
- **Clarity before creation**: minimizes rework and confusion.  

---

## Benefits
- **Precision**: outputs consistently reflect the original intent.  
- **Efficiency**: reduces wasted cycles by aligning teams early and cutting down on revisions.  
- **Trust**: improves collaboration by making criteria explicit and shared.  
- **Flexibility**: adapts across software, legal, and enterprise contexts.  
- **Scalability**: supports both small projects and large organizations, providing a stable foundation as complexity grows.  

---

## Technical Alignment
MindScript unifies and extends behavioral driven specification platforms into a cross domain framework.  

- **Structured nodes**: requirements are expressed in a clear, linked format.  
- **Interoperability**: layers on top of existing workflows.  
- **MCP-native profile**: can run as an MCP contract layer with deterministic tool/error semantics.  
- **Compatibility**: works with familiar formats and standards.  
- **Extensibility**: adapts to new domains without breaking the core.  

---

## Applications
- **Software engineering**: define acceptance criteria before writing features.  
- **Legal drafting**: agree on terms and rules before redlining.  
- **Compliance**: encode requirements for audits and governance.  
- **Enterprise knowledge**: unify requirements across teams.  
- **AI and automation**: guide outputs with human intent.  

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
2. Review public adoption charter: [docs/mindscript/adoption-charter.md](./docs/mindscript/adoption-charter.md).
3. (Optional) Build the white paper PDF locally with Pandoc:  
   ```bash
   pandoc docs/mindscript/whitepaper.md -o docs/mindscript/whitepaper.pdf
   ```  
4. Create a release with GitHub CLI:  
   ```bash
   gh release create v0.1.0 docs/mindscript/whitepaper.pdf 
     --title "MindScript v0.1.0" 
     --notes "Initial publication of the MindScript (formerly OpenSpec) white paper."
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
Good first contributions include example specs, validation rules for acceptance criteria, and adapters that map MindScript requirements into existing tools.

---

## License
Copyright © 2025 Michael Gregory Mahoney  

Licensed under the [Apache License 2.0](./LICENSE).
