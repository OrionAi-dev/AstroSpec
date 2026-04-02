# OpenSpec `@software` Template

Use this template to author a spec that validates against the **@software** profile.  
It keeps OpenSpec agnostic and **references** external BDD artifacts instead of embedding them.

---

## Minimal spec (copy/paste)

```yaml
profile: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software
kind: software

meta:
  id: FEATURE-000
  title: Short, clear title
  owner: team-orion
  priority: P1
  labels: [feature]

requirements:
  - id: FEATURE-000.1
    statement: A single-sentence requirement
    rationale: Why this matters (optional)
    criteria:
      - id: FEATURE-000.1.1
        type: functional
        text: Acceptance condition in plain language
```

---

## With subprofiles (imports)

Import only what your project needs (e.g., TypeScript language and OpenAPI for REST):

```yaml
profile: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software
imports:
  - https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software.language.typescript
  - https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software.api.openapi   # versionless; set version below

kind: software

meta:
  id: PROJ-001
  title: TS service with REST API
  owner: team-orion
  priority: P0
  labels: [ts, rest]

# Provided by @software.language.typescript
ts:
  min_ts_version: "5.4"
  package_manager: pnpm
  build: tsup
  lint: eslint
  test: vitest

# Provided by @software.api.openapi
openapi:
  version: "3.1.0"
  spec_path: ./openapi.yaml

requirements:
  - id: PROJ-001.1
    statement: Implement POST /login
    criteria:
      - id: PROJ-001.1.1
        type: functional
        text: Valid credentials return 200 and a session token
```

> If you need a strictly pinned OpenAPI profile, import  
> `https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software.api.openapi.v3_1` instead.

---

## Referencing external BDD artifacts (reference-only)

Bind a criterion to an existing Behave/Behat/Cucumber/etc. file.  
You can also set a **spec-level default** under `meta.bdd` and omit per-criterion `bdd_ref`.

```yaml
profile: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software
kind: software

meta:
  id: BEHAVE-301
  title: User login with Behave
  owner: app-auth
  priority: P1

requirements:
  - id: BEHAVE-301.1
    statement: Login flow validated via Behave
    criteria:
      - id: BEHAVE-301.1.1
        type: functional
        text: Valid credentials produce a successful session
        bdd_ref:
          source: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/behave  # URL from your bdd-registry.yaml
          path: ./BEHAVE-LOGIN.feature                      # local path or absolute URL
          scenario: Valid credentials produce a successful session
```

---

## IDs and conventions

- `meta.id`: `^[A-Z]+-[0-9]+$` (e.g., `FEATURE-101`)
- `requirements[].id` and `criteria[].id`: hierarchical, e.g., `FEATURE-101.1`, `FEATURE-101.1.1`
- Keep `text` statements **clear and testable**
- **No inline steps** in OpenSpec (no Given/When/Then). Always link external BDD via `bdd_ref`.

---

## Authoring checklist

- [ ] `profile` is `https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software`
- [ ] `kind: software`
- [ ] `meta` includes `id`, `title`, `owner`, `priority`
- [ ] `requirements[*].criteria[*]` each have an `id`, `type`, and `text`
- [ ] Any BDD linkage uses `bdd_ref` with `source` URL from `bdd-registry.yaml`
- [ ] Paths referenced by `bdd_ref.path` exist locally (or are valid URLs)
- [ ] Only import subprofiles you actually need

---

## Tips

- Store examples under `docs/integrations/bdd/@software/examples/`
- Keep your OpenAPI file (if used) next to the spec or at a stable URL
- Use CI to validate:
  1) Schema validate specs  
  2) Verify imports and BDD references  
  3) Produce traceability indexes from adapters (optional)
