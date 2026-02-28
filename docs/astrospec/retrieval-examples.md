# Retrieval Examples

Reference examples live in `packages/astrospec-retrieval-profile/examples/`.

Included examples:

- `hybrid-pageindex-graph.request.json`
- `hybrid-pageindex-graph.response.json`
- `memory-record.json`
- `knowledge-assertion.json`
- `retrieval-stream.final.json`

These examples illustrate the intended portable contract shape for systems such as retrieval APIs, agent runtimes, and app surfaces that consume retrieval results.

## Validation

Examples are backed by schema validators and conformance fixtures.

Typical checks:

```bash
pnpm -F @astrospec/retrieval-profile test
pnpm check:retrieval-profile
```
