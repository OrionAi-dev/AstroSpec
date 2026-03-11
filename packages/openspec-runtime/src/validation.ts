import type { AstroSpecContext, AstroSpecTurn } from "./types";
import { SCHEMA_IDS, validateWithSchema, type ValidationError } from "./schema";

export { type ValidationError } from "./schema";

export function validateContext(
  context: unknown
): { ok: true; value: AstroSpecContext } | { ok: false; errors: ValidationError[] } {
  return validateWithSchema<AstroSpecContext>(SCHEMA_IDS.context, context);
}

export function validateTurn(
  turn: unknown
): { ok: true; value: AstroSpecTurn } | { ok: false; errors: ValidationError[] } {
  return validateWithSchema<AstroSpecTurn>(SCHEMA_IDS.turn, turn);
}

export function assertContext(context: unknown): AstroSpecContext {
  const res = validateContext(context);
  if (!res.ok) {
    const msg = res.errors.map(e => `${e.path}: ${e.message}`).join("\n");
    throw new Error(`Invalid AstroSpecContext:\n${msg}`);
  }
  return res.value;
}

export function assertTurn(turn: unknown): AstroSpecTurn {
  const res = validateTurn(turn);
  if (!res.ok) {
    const msg = res.errors.map(e => `${e.path}: ${e.message}`).join("\n");
    throw new Error(`Invalid AstroSpecTurn:\n${msg}`);
  }
  return res.value;
}
