/**
 * @deprecated
 * This package exists for compatibility with earlier OpenSpec naming.
 *
 * Canonical, schema-aligned exports live in `@astrospec/runtime` and `@astrospec/schema`.
 */

export * from "@astrospec/runtime";

import type {
  JsonObject,
  JsonValue,
  ProvenanceEntry,
  AstroSpecBase,
  AstroSpecContext,
  AstroSpecTurn,
  AstroSpecRequestEnvelope,
  AstroSpecContextRequestEnvelope,
  AstroSpecTurnRequestEnvelope,
  SpecField
} from "@astrospec/runtime";

/**
 * @deprecated Use `AstroSpecBase`.
 */
export type OpenSpecBase<F extends Record<string, SpecField> = Record<string, SpecField>> = AstroSpecBase<F>;

/**
 * @deprecated Use `AstroSpecContext`.
 */
export type OpenSpecContext<F extends Record<string, SpecField> = Record<string, SpecField>> = AstroSpecContext<F>;

/**
 * @deprecated Use `AstroSpecTurn`.
 */
export type OpenSpecTurn<F extends Record<string, SpecField> = Record<string, SpecField>> = AstroSpecTurn<F>;

/**
 * @deprecated Use `AstroSpecRequestEnvelope`.
 */
export type OpenSpecRequestEnvelope<
  TContext extends AstroSpecContext = AstroSpecContext,
  TTurn extends AstroSpecTurn = AstroSpecTurn,
  TInput extends JsonObject | JsonValue = JsonObject
> = AstroSpecRequestEnvelope<TContext, TTurn, TInput>;

/**
 * @deprecated Use `AstroSpecContextRequestEnvelope`.
 */
export type OpenSpecContextRequestEnvelope<
  TContext extends AstroSpecContext = AstroSpecContext
> = AstroSpecContextRequestEnvelope<TContext>;

/**
 * @deprecated Use `AstroSpecTurnRequestEnvelope`.
 */
export type OpenSpecTurnRequestEnvelope<
  TTurn extends AstroSpecTurn = AstroSpecTurn
> = AstroSpecTurnRequestEnvelope<TTurn>;

// ---------------------------------------------------------------------------
// Legacy extra types (not part of the canonical JSON Schemas)
// ---------------------------------------------------------------------------

export type JsonPatchOp = "add" | "replace" | "remove";
export interface JsonPatch {
  op: JsonPatchOp;
  path: string;
  value?: JsonValue;
}

export interface DerivedSpec {
  baseId: string;
  patches: ReadonlyArray<JsonPatch>;
  provenance: ReadonlyArray<ProvenanceEntry>;
}

export interface ToolBinding<P extends Record<string, SpecField> = Record<string, SpecField>> {
  intent: string;
  tool: string;
  paramMap: { [K in keyof P]?: string } & Record<string, string>;
}
