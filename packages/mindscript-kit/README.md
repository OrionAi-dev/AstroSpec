# @mindscript/kit

Minimal DX surface for AI developers.

## API

```ts
import { validate, callTool } from '@mindscript/kit';

const valid = validate('plan-turn', payload);
const out = await callTool('mindscript.contract.validate', {
  kind: 'plan-turn',
  payload,
});
```

## Commands

```bash
pnpm -F @mindscript/kit typecheck
pnpm -F @mindscript/kit test
pnpm -F @mindscript/kit build
```
