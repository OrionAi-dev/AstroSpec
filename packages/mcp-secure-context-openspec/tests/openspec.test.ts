import test from "node:test";
import assert from "node:assert/strict";

import {
  assertContextContainer,
  digestContextContainer,
  validateContextContainer,
} from "../src/index.js";

const container = {
  schema: "mcp-secure-context.container.v0.1",
  containerType: "task_state",
  id: "task-123",
  version: "0.1.0",
  payload: {
    taskId: "task-123",
    goal: "Summarize the ticket for handoff",
    status: "in_progress",
  },
  policy: {
    audience: ["agent", "tool"],
    allowedActions: ["read"],
    sensitivity: "internal",
  },
  provenance: {
    createdAt: "2026-02-28T00:00:00.000Z",
    createdBy: "agent://planner",
  },
};

test("context container validation succeeds for a valid container", () => {
  const result = validateContextContainer(container);
  assert.equal(result.ok, true);
});

test("context container digest is deterministic", () => {
  const digestA = digestContextContainer(container);
  const digestB = digestContextContainer(structuredClone(container));
  assert.equal(digestA, digestB);
  assert.match(digestA, /^sha256:/);
});

test("assertContextContainer throws on invalid payloads", () => {
  assert.throws(() => assertContextContainer({ ...container, schema: "broken" }));
});
