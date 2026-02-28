// AstroSpec validators
// Runtime validation using zod; schema export for interoperability

import { z } from "zod";

// ---------- FieldScope ----------
export const zFieldScope = z.union([
  z.object({ kind: z.literal("filetype"), value: z.string().min(1) }),
  z.object({ kind: z.literal("project"), id: z.string().min(1) }),
  z.object({ kind: z.literal("intent"), value: z.string().min(1) }),
  z.object({ kind: z.literal("global") })
]);

// ---------- AcceptanceCriterion ----------
export const zAcceptance = z.object({
  id: z.string().min(1),
  description: z.string().min(1),
  verifier: z.string().min(1),
  params: z.record(z.string(), z.unknown()).optional()
});

// ---------- BaseField ----------
export const zBaseField = z.object({
  type: z.enum(["string", "number", "boolean", "enum", "object", "array", "any"]),
  value: z.unknown().optional(),
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  enum: z.array(z.unknown()).optional(),
  pattern: z.string().optional(),
  many: z.boolean().optional(),
  noneAllowed: z.boolean().optional(),
  default: z.unknown().optional(),
  description: z.string().optional(),
  source: z.enum(["user", "context", "default", "memory", "model"]).optional(),
  confidence: z.number().min(0).max(1).optional(),
  rationale: z.string().optional(),
  scope: zFieldScope.optional(),
  ext: z.record(z.string(), z.unknown()).optional()
});

// ---------- SpecField (recursive) ----------
// We define lazily to allow recursion for object/array
export const zSpecField: z.ZodType<any> = z.lazy(() =>
  zBaseField.extend({
    // object fields may have nested properties
    properties: z.record(z.string(), z.lazy(() => zSpecField)).optional(),
    // array fields may specify an item schema
    items: z.lazy(() => zSpecField).optional()
  })
);

// ---------- Provenance ----------
export const zProvenance = z.object({
  field: z.string().min(1),
  source: z.enum(["user", "context", "default", "memory", "model"]),
  rationale: z.string().optional()
});

// ---------- Base Spec ----------
export const zISODateTime = z
  .string()
  .regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/, "ISO datetime expected");

export const zAstroSpecBase = z.object({
  kind: z.enum(["context", "turn"]),
  id: z.string().min(1),
  intent: z.string().min(1),
  fields: z.record(z.string(), zSpecField),
  acceptanceCriteria: z.array(zAcceptance).default([]),
  provenance: z.array(zProvenance).optional(),
  lockedAt: zISODateTime,
  version: z.string().optional(),
  signature: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional()
});

// ---------- Context & Turn ----------
export const zAstroSpecContext = zAstroSpecBase.extend({
  kind: z.literal("context"),
  scope: z.object({
    type: z.enum(["session", "project", "workspace", "global"]),
    id: z.string().optional()
  }),
  lifespan: z.object({
    mode: z.enum(["session", "rolling", "pinned"]),
    ttlDays: z.number().optional(),
    maxUses: z.number().optional()
  })
});

export const zAstroSpecTurn = zAstroSpecBase.extend({
  kind: z.literal("turn"),
  inheritsFrom: z.string().min(1)
});

// ---------- Patches ----------
export const zJsonPatch = z.object({
  op: z.enum(["add", "replace", "remove"]),
  path: z.string().min(1),
  value: z.unknown().optional()
});

export const zDerivedSpec = z.object({
  baseId: z.string().min(1),
  patches: z.array(zJsonPatch),
  provenance: z.array(zProvenance)
});

// ---------- ToolBinding ----------
export const zToolBinding = z.object({
  intent: z.string().min(1),
  tool: z.string().min(1),
  paramMap: z.record(z.string(), z.string())
});

// ---------- Helpers (inferred types) ----------
export type ZContext = z.infer<typeof zAstroSpecContext>;
export type ZTurn = z.infer<typeof zAstroSpecTurn>;
export type ZField = z.infer<typeof zSpecField>;
