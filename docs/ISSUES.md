# MCP Secure Context Sharing Repo-Local Issues

## Active Alignment Cluster

These are repo-local issue drafts for the current adoption-alignment pass. They are not GitHub
issues in this pass.

### 1. Publish Orion and StarConsole adoption guidance

Goal:
document how Orion and StarConsole should consume OpenSpec and MCP Secure Context Sharing without
overclaiming provider or orchestration standardization.

Acceptance criteria:

- repo docs include an Orion/StarConsole adoption guide
- the guide states that OpenSpec is not a universal provider adapter layer

### 2. Clarify runtime-interface descriptor examples

Goal:
make `@openspec/runtime-interfaces` easier to apply to capability runtimes and workflow consumers.

Acceptance criteria:

- docs explain how `ReasoningRuntimeAdapter`, `DiscoveryWorkflowAdapter`, `GraphMemoryProvider`, and
  `RuntimeInterfaceDescriptor` apply to Orion and StarConsole style consumers

### 3. Add reasoning exchange examples and conformance guidance

Goal:
clarify how `ReasoningTask`, `ReasoningResult`, and `ReasoningWorkflowContract` should be used for
portable exchange without implying scheduler standardization.

Acceptance criteria:

- docs describe Orion as an example reasoning-profile consumer
- docs keep scheduling and runtime policy out of OpenSpec scope

### 4. Clarify MCP projection guidance

Goal:
document MCP projection as an interoperability layer without suggesting that MCP replaces provider
orchestration or backend normalization.

Acceptance criteria:

- docs explicitly separate MCP projection from provider-standardization claims
