import type { ContextContainer } from "@mcp-secure-context/core";
import {
  assertContext,
  assertTurn,
  validateContext,
  validateTurn,
  type ValidationError,
} from "@openspec/runtime";
import { SCHEMA_IDS, validateWithSchema } from "./schema.js";

export { assertContext, assertTurn, validateContext, validateTurn };
export type { ValidationError };

export function validateContextContainer(
  container: unknown,
): { ok: true; value: ContextContainer } | { ok: false; errors: ValidationError[] } {
  return validateWithSchema<ContextContainer>(SCHEMA_IDS.contextContainer, container);
}

export function assertContextContainer(container: unknown): ContextContainer {
  const result = validateContextContainer(container);
  if (!result.ok) {
    const message = result.errors.map((error) => `${error.path}: ${error.message}`).join("\n");
    throw new Error(`Invalid ContextContainer:\n${message}`);
  }
  return result.value;
}
