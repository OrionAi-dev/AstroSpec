import Ajv2020 from "ajv/dist/2020.js";
import type { ErrorObject, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import {
  listSecureContextSchemas,
  readSecureContextSchema,
} from "@mcp-secure-context/core";
import { listSchemas, readSchema } from "@openspec/schema";
import { SCHEMA_IDS as RUNTIME_SCHEMA_IDS, type ValidationError } from "@openspec/runtime";

function mapAjvErrors(errors: ErrorObject[] | null | undefined): ValidationError[] {
  return (errors || []).map((error) => ({
    path: error.instancePath || "/",
    message: error.message || "Schema validation error",
    keyword: error.keyword,
    schemaPath: error.schemaPath,
    params: error.params,
  }));
}

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  allowUnionTypes: true,
});
addFormats(ajv);

for (const schemaName of listSchemas()) {
  ajv.addSchema(readSchema(schemaName));
}
for (const schemaName of listSecureContextSchemas()) {
  ajv.addSchema(readSecureContextSchema(schemaName));
}

function getValidator(schemaId: string): ValidateFunction {
  const validator = ajv.getSchema(schemaId);
  if (!validator) {
    throw new Error(`Schema not registered: ${schemaId}`);
  }
  return validator;
}

export const SCHEMA_IDS = {
  ...RUNTIME_SCHEMA_IDS,
  containerDefs: "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/mcp-secure-context/container-defs-0.1.json",
  contextContainer:
    "https://orionai-dev.github.io/mcp-secure-context-sharing/schemas/mcp-secure-context/context-container-0.1.json",
} as const;

export function validateWithSchema<T>(
  schemaId: string,
  value: unknown,
): { ok: true; value: T } | { ok: false; errors: ValidationError[] } {
  const validator = getValidator(schemaId);
  const ok = validator(value);
  if (ok) {
    return { ok: true, value: value as T };
  }
  return { ok: false, errors: mapAjvErrors(validator.errors) };
}
