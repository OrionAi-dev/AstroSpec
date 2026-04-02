# Discovery Bundle

`@openspec/discovery-bundle` is the high-level public integration bundle for OpenSpec discovery work.

## Includes

- `@openspec/reasoning`
- `@openspec/graph-memory`
- `@openspec/starburst-profile`
- `@openspec/runtime-interfaces`

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
  createOperationalReviewExampleTask,
  validateDiscoveryContract,
} from '@openspec/discovery-bundle';

const task = createOperationalReviewExampleTask();
const query = buildStructuralGraphQuery({
  abstractionSignature: 'trace-linked-review-graph',
});

validateDiscoveryContract('reasoning-task', task);
validateDiscoveryContract('structural-graph-query', query);
```

This bundle improves adoption ergonomics. It is not a runtime and it does not standardize product-specific behavior.
