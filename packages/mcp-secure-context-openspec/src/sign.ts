import { createHash } from "node:crypto";
import type { ContextContainer } from "@mcp-secure-context/core";
import type { AstroSpecBase } from "./types.js";
import { canonicalizeSpec, stableStringify } from "./canonicalize.js";

export function signSpec(spec: AstroSpecBase): string {
  // Exclude existing signature field from the hash input.
  const { signature: _sig, ...rest } = spec as any;
  const canonical = canonicalizeSpec(rest as any);
  const payload = stableStringify(canonical);
  const hex = createHash("sha256").update(payload, "utf8").digest("hex");
  return `sha256:${hex}`;
}

export function lockSpec<T extends AstroSpecBase>(
  spec: T,
  opts: { now?: () => Date } = {}
): T {
  const now = (opts.now ? opts.now() : new Date()).toISOString();
  const next: any = { ...spec, lockedAt: now };
  next.signature = signSpec(next);
  return next as T;
}

export function digestContextContainer(container: ContextContainer): string {
  const canonical = stableStringify(container);
  const hex = createHash("sha256").update(canonical, "utf8").digest("hex");
  return `sha256:${hex}`;
}
