import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export type AstroSpecSchemaName =
  | "defs-0.1"
  | "acceptance-criteria-0.1"
  | "provenance-0.1"
  | "context-0.1"
  | "turn-0.1"
  | "verification-report-0.1";

const SCHEMA_RELATIVE_PATHS: Record<AstroSpecSchemaName, string> = {
  "defs-0.1": "schemas/astrospec/defs-0.1.json",
  "acceptance-criteria-0.1": "schemas/astrospec/acceptance-criteria-0.1.json",
  "provenance-0.1": "schemas/astrospec/provenance-0.1.json",
  "context-0.1": "schemas/astrospec/context-0.1.json",
  "turn-0.1": "schemas/astrospec/turn-0.1.json",
  "verification-report-0.1": "schemas/astrospec/verification-report-0.1.json"
};

// With tsup `--shims`, `__dirname` is available in both ESM + CJS outputs.
const PACKAGE_ROOT = resolve(__dirname, "..");

/** Get the on-disk path to a bundled schema JSON file. */
export function getSchemaPath(name: AstroSpecSchemaName): string {
  return join(PACKAGE_ROOT, SCHEMA_RELATIVE_PATHS[name]);
}

/** Read and parse a schema JSON file from disk. */
export function readSchema<T = unknown>(name: AstroSpecSchemaName): T {
  const raw = readFileSync(getSchemaPath(name), "utf8");
  return JSON.parse(raw) as T;
}

/** List all schema names exported by this package. */
export function listSchemas(): ReadonlyArray<AstroSpecSchemaName> {
  return Object.keys(SCHEMA_RELATIVE_PATHS) as AstroSpecSchemaName[];
}
