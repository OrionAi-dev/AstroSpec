# AstroSpec BDD: `astrospec.core`

**What it is:** a minimal, portable BDD scenario format in YAML.
**How it is used:** like any other BDD provider. Your AstroSpec specs point to it with `bdd_ref.source` and `bdd_ref.path`.

---

## Why use `astrospec.core`?

- You want human-readable scenarios but do not want to lock into Cucumber, Behave, or Behat yet.
- You need a source file that can generate multiple BDD stacks later.
- You work in a domain without a mature BDD language and still want schema-validated scenarios.

If you already have a mature BDD toolchain, prefer that and just reference it.

---

## File layout

```
docs/
  integrations/
    bdd/
      astrospec.core/
        profile.yaml
        schema.yaml
        README.md
        examples/
          AUTH-101.core.yaml
```

---

## Minimal scenario file

```yaml
profile: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/astrospec.core
kind: bdd-core
meta:
  id: AUTH-101.core
  title: AUTH-101 login scenarios

background:
  steps:
    - { keyword: Given, text: "a registered user with a verified email" }

scenarios:
  - id: auth-login-success
    name: Valid credentials produce a successful session
    steps:
      - { keyword: When, text: "the user submits valid credentials" }
      - { keyword: Then, text: "the app creates a session and redirects to the dashboard" }
```

Key fields:
- `profile` must be `https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/astrospec.core`
- `kind` is `bdd-core`
- Steps use `keyword` in `Given`, `When`, `Then`, `And`, `But`

---

## Referencing from `@software`

Point a criterion to an `astrospec.core` scenario the same way you would point to Cucumber.

```yaml
# docs/integrations/bdd/@software/examples/AUTH-101.context-turn.yaml
profile: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/@software
kind: software
meta: { id: AUTH-101, title: User can log in, owner: app-auth, priority: P0 }

requirements:
  - id: AUTH-101.1
    statement: Users can authenticate with valid credentials
    criteria:
      - id: AUTH-101.1.1
        type: functional
        text: Valid credentials produce a successful session
        bdd_ref:
          source: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/astrospec.core
          path: ../../bdd/astrospec.core/examples/AUTH-101.core.yaml
          scenario: auth-login-success
```

Add `astrospec.core` to the `@software` BDD registry:

```yaml
# docs/integrations/bdd/@software/bdd-registry.yaml
version: 1
supported:
  - id: cucumber
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/cucumber
  - id: behave
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/behave
  - id: behat
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/behat
  - id: jbehave
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/jbehave
  - id: karate
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/karate
  - id: robot
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/robot
  - id: specflow
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/specflow
  - id: astrospec.core
    url: https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/astrospec.core
```

---

## Validate with AJV

```bash
ajv validate
  -s <(yq -o=json docs/integrations/bdd/astrospec.core/schema.yaml)
  -d <(yq -o=json docs/integrations/bdd/astrospec.core/examples/AUTH-101.core.yaml)
```

---

## Tooling notes

- **Traceability:** produce `dist/context-turn/index.json` that maps `criteria.id` to `{ file, scenario_id }`.
- **Generators (optional):** render `.feature` files for Cucumber, Behave, Behat, Robot.
- **Round trip (optional):** import or export Gherkin for migration.

---

## Versioning

- Profile URL: `https://orionai-dev.github.io/mcp-secure-context-sharing/profiles/bdd/astrospec.core`
- Schema URL: `https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/bdd/astrospec.core-1.0.json`
- Use SemVer for schema changes.

---

## License

This repository uses **Apache-2.0**. See `LICENSE`.

---

## Contributing

- Keep `astrospec.core` small and stable.
- Changes should be backward compatible when possible.
- Add examples and update docs under `docs/integrations/bdd/`.
