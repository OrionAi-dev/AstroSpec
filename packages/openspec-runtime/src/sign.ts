import { createHash } from "node:crypto";
import type { OpenSpecBase } from "./types";
import { canonicalizeSpec, stableStringify } from "./canonicalize";

export function signSpec(spec: OpenSpecBase): string {
  // Exclude existing signature field from the hash input.
  const { signature: _sig, ...rest } = spec as any;
  const canonical = canonicalizeSpec(rest as any);
  const payload = stableStringify(canonical);
  const hex = createHash("sha256").update(payload, "utf8").digest("hex");
  return `sha256:${hex}`;
}

export function lockSpec<T extends OpenSpecBase>(
  spec: T,
  opts: { now?: () => Date } = {}
): T {
  const now = (opts.now ? opts.now() : new Date()).toISOString();
  const next: any = { ...spec, lockedAt: now };
  next.signature = signSpec(next);
  return next as T;
}

