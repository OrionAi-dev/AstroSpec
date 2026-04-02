import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type OpenSpecSchemaName =
  | "defs-0.1"
  | "acceptance-criteria-0.1"
  | "provenance-0.1"
  | "context-0.1"
  | "turn-0.1"
  | "verification-report-0.1";

const SCHEMA_RELATIVE_PATHS: Record<OpenSpecSchemaName, string> = {
  "defs-0.1": "schemas/openspec/defs-0.1.json",
  "acceptance-criteria-0.1": "schemas/openspec/acceptance-criteria-0.1.json",
  "provenance-0.1": "schemas/openspec/provenance-0.1.json",
  "context-0.1": "schemas/openspec/context-0.1.json",
  "turn-0.1": "schemas/openspec/turn-0.1.json",
  "verification-report-0.1": "schemas/openspec/verification-report-0.1.json",
};

const PACKAGE_ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));

export function getSchemaPath(name: OpenSpecSchemaName): string {
  return join(PACKAGE_ROOT, SCHEMA_RELATIVE_PATHS[name]);
}

export function readSchema<T = unknown>(name: OpenSpecSchemaName): T {
  const raw = readFileSync(getSchemaPath(name), "utf8");
  return JSON.parse(raw) as T;
}

export function listSchemas(): ReadonlyArray<OpenSpecSchemaName> {
  return Object.keys(SCHEMA_RELATIVE_PATHS) as OpenSpecSchemaName[];
}
