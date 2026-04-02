import { createHash } from "node:crypto";
import type { ContextContainer } from "@mcp-secure-context/core";
import { stableStringify } from "@openspec/runtime";

export function digestContextContainer(container: ContextContainer): string {
  const canonical = stableStringify(container);
  const hex = createHash("sha256").update(canonical, "utf8").digest("hex");
  return `sha256:${hex}`;
}
