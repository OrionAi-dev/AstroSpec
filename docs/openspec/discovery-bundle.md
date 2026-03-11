# Discovery Bundle

`@astrospec/discovery-bundle` is the high-level public integration bundle for AstroSpec discovery work.

## Includes

- `@astrospec/reasoning`
- `@astrospec/graph-memory`
- `@astrospec/starburst-profile`
- `@astrospec/runtime-interfaces`

## Provides

- re-exports for the discovery package family
- contract builders
- validator helpers
- example task constructors

## Quickstart

```ts
import {
  buildReasoningTask,
  buildStructuralGraphQuery,
  createLegalEvidenceOrganizationExampleTask,
  validateDiscoveryContract,
} from '@astrospec/discovery-bundle';

const task = createLegalEvidenceOrganizationExampleTask();
const query = buildStructuralGraphQuery({
  abstractionFingerprint: 'claim-graph-with-procedural-dependencies',
});

validateDiscoveryContract('reasoning-task', task);
validateDiscoveryContract('structural-graph-query', query);
```

This bundle improves adoption ergonomics. It is not a runtime and it does not standardize product-specific behavior.
