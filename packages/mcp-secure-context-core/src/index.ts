import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
export * from "./types.js";

export type SecureContextSchemaName =
  | "container-defs-0.1"
  | "context-container-0.1";

const SCHEMA_RELATIVE_PATHS: Record<SecureContextSchemaName, string> = {
  "container-defs-0.1": "schemas/mcp-secure-context/container-defs-0.1.json",
  "context-container-0.1": "schemas/mcp-secure-context/context-container-0.1.json",
};

const PACKAGE_ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

export function getSecureContextSchemaPath(name: SecureContextSchemaName): string {
  return join(PACKAGE_ROOT, SCHEMA_RELATIVE_PATHS[name]);
}

export function readSecureContextSchema<T = unknown>(name: SecureContextSchemaName): T {
  const raw = readFileSync(getSecureContextSchemaPath(name), "utf8");
  return JSON.parse(raw) as T;
}

export function listSecureContextSchemas(): ReadonlyArray<SecureContextSchemaName> {
  return Object.keys(SCHEMA_RELATIVE_PATHS) as SecureContextSchemaName[];
}
