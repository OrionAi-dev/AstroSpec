# OpenSpec Validation

Validation ensures OpenSpec contracts are structurally correct **before** they are locked, executed, or verified.

The core project treats **JSON Schema as canonical** and validates with **AJV (draft 2020-12)**.

---

## What Gets Validated

1. **Shape**: Context/Turn match the canonical JSON Schemas.
2. **Strictness**: unknown top-level keys are rejected (`additionalProperties: false`), but extensions are allowed via:
   * `meta` (top-level)
   * `fields.*.ext`
3. **Acceptance criteria**: `acceptanceCriteria[]` is structured objects (no string shorthand).

Some checks are intentionally out of scope for schema validation (for example: whether `inheritsFrom` points to a real Context id, or whether a verifier is registered at runtime).

---

## CLI

Validate a file (JSON or YAML):

```bash
node packages/openspec-cli/dist/cli.js validate path/to/spec.json
```

Exit codes:

* `0` valid
* `1` schema validation error / unknown shape

---

## TypeScript Runtime

If you need validation inside an app:

```ts
import { validateContext, validateTurn } from "@openspec/runtime";

const res = validateTurn(turn);
if (!res.ok) {
  // res.errors: [{ path, message, keyword?, schemaPath?, params? }]
}
```

---

## Schema Drift Guard (Docs)

This repo keeps copies of the canonical schemas under `docs/openspec/schemas/` for easy browsing.

CI enforces that those docs copies match the canonical package:

```bash
pnpm check:schema-drift
```

