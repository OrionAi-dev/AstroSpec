# Templates & Librarian

Templates capture recurring patterns of AstroSpec specs so they don’t need to be rebuilt from scratch every time.
The **Librarian** manages templates: classifying, patching, promoting, and rolling back.

---

## Templates

* **Definition**: A reusable, semver-versioned starting point for a spec.
* **Structure**: Identical to a Context/Turn spec but marked with `version` and stored in a registry.
* **Use case**: Jumpstart a Turn by applying a template, then patching.

---

## Patches

* **DerivedSpec** applies JSON Patch operations to a template.
* Ensures minimal diff between base template and final Turn contract.

Example:

```json
{
  "baseId": "restaurant.standard.v1",
  "patches": [
    { "op": "replace", "path": "/fields/radius_minutes/default", "value": 10 },
    { "op": "add", "path": "/fields/dietary_restrictions", "value": { "type": "string", "many": true } }
  ]
}
```

---

## Librarian Responsibilities

1. **Retrieve**: classify intent, locate nearest template.
2. **Patch**: apply derived changes for this Turn.
3. **Promote**: cluster recurring derived specs; if thresholds met, create a new versioned template.
4. **Govern**: enforce promotion criteria (usage count, verifier pass rates, clarifier ratios).
5. **Rollback**: detect regressions (golden test failures) and revert to previous template.

---

## Promotion Criteria (default)

* ≥25 uses across ≥10 users
* Verifier pass rate ≥98%
* Avg clarifiers ≤0.5 per turn

---

## Canary & Rollback

* New template versions start as **canary** (10% of traffic).
* Auto-promote if metrics improve.
* Auto-rollback on golden test failures or user-reported regressions.

---

## Registry

Templates are stored with stable IDs:

```
astrospec://templates/{intent}/{name}/{version}
```

Example:

```
astrospec://templates/restaurant/standard/v1
```

---

## Cross-References

* [spec-language.md](./spec-language.md) → core schema and field definitions
* [verification.md](./verification.md) → how acceptance checks interact with template promotion
* [quickstart.md](./quickstart.md) → end-to-end usage example
