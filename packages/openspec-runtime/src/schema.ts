import Ajv2020 from "ajv/dist/2020.js";
import type { ErrorObject, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { readSchema } from "@astrospec/schema";

export type ValidationError = {
  path: string;
  message: string;
  keyword?: string;
  schemaPath?: string;
  params?: unknown;
};

function mapAjvErrors(errors: ErrorObject[] | null | undefined): ValidationError[] {
  return (errors || []).map(e => ({
    path: e.instancePath || "/",
    message: e.message || "Schema validation error",
    keyword: e.keyword,
    schemaPath: e.schemaPath,
    params: e.params
  }));
}

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  allowUnionTypes: true
});
addFormats(ajv);

// Add canonical AstroSpec schemas (by $id) so relative $refs resolve correctly.
const SCHEMA_NAMES = [
  "defs-0.1",
  "acceptance-criteria-0.1",
  "provenance-0.1",
  "context-0.1",
  "turn-0.1",
  "verification-report-0.1"
] as const;

for (const name of SCHEMA_NAMES) {
  ajv.addSchema(readSchema(name));
}

function getValidator(schemaId: string): ValidateFunction {
  const v = ajv.getSchema(schemaId);
  if (!v) {
    throw new Error(`Schema not registered: ${schemaId}`);
  }
  return v;
}

export const SCHEMA_IDS = {
  defs: "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/astrospec/defs-0.1.json",
  acceptanceCriteria: "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/astrospec/acceptance-criteria-0.1.json",
  provenance: "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/astrospec/provenance-0.1.json",
  context: "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/astrospec/context-0.1.json",
  turn: "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/astrospec/turn-0.1.json",
  verificationReport: "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/astrospec/verification-report-0.1.json"
} as const;

export function validateWithSchema<T>(
  schemaId: string,
  value: unknown
): { ok: true; value: T } | { ok: false; errors: ValidationError[] } {
  const validator = getValidator(schemaId);
  const ok = validator(value);
  if (ok) return { ok: true, value: value as T };
  return { ok: false, errors: mapAjvErrors(validator.errors) };
}
