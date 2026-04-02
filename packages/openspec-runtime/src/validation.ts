import type { OpenSpecContext, OpenSpecTurn } from "./types";
import { SCHEMA_IDS, validateWithSchema, type ValidationError } from "./schema";

export { type ValidationError } from "./schema";

export function validateContext(
  context: unknown
): { ok: true; value: OpenSpecContext } | { ok: false; errors: ValidationError[] } {
  return validateWithSchema<OpenSpecContext>(SCHEMA_IDS.context, context);
}

export function validateTurn(
  turn: unknown
): { ok: true; value: OpenSpecTurn } | { ok: false; errors: ValidationError[] } {
  return validateWithSchema<OpenSpecTurn>(SCHEMA_IDS.turn, turn);
}

export function assertContext(context: unknown): OpenSpecContext {
  const res = validateContext(context);
  if (!res.ok) {
    const msg = res.errors.map(e => `${e.path}: ${e.message}`).join("\n");
    throw new Error(`Invalid OpenSpecContext:\n${msg}`);
  }
  return res.value;
}

export function assertTurn(turn: unknown): OpenSpecTurn {
  const res = validateTurn(turn);
  if (!res.ok) {
    const msg = res.errors.map(e => `${e.path}: ${e.message}`).join("\n");
    throw new Error(`Invalid OpenSpecTurn:\n${msg}`);
  }
  return res.value;
}
