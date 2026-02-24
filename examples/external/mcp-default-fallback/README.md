# External Adoption E2E: MCP Default + Schema Fallback

This sample proves the baseline external integration contract:

1. MCP tool validation is the default path.
2. Direct schema validation is the fallback path.
3. Valid/invalid semantics remain parity-compatible and deterministic.

## Run in this repo (CI/local smoke)

From repository root:

```bash
pnpm install
pnpm exec tsx examples/external/mcp-default-fallback/run.ts
```

Expected final line:

```text
external-e2e-result: ok
```

## External usage shape (npm packages)

```bash
npm i @mindscript/mcp-profile @mindscript/kit
```

Use the same payload flow:

1. Validate with `mindscript.contract.validate` via MCP profile.
2. Validate same payload with `@mindscript/kit` fallback.
3. Assert parity for pass/fail and deterministic MCP error code on invalid payloads.
