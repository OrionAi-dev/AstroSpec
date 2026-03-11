import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { AcceptanceCriterion, EvidenceRef, JsonObject, AstroSpecContext, AstroSpecTurn } from "./types";

export interface VerifierResult {
  criterionId: string;
  verifier: string;
  pass: boolean;
  details?: string;
  durationMs?: number;
  evidenceUsed?: EvidenceRef[];
}

export interface VerificationReport {
  contextId?: string;
  turnId?: string;
  overall: boolean;
  results: VerifierResult[];
  at: string;
  meta?: JsonObject;
}

export interface VerifyEnv {
  cwd?: string;
  now?: () => Date;
}

export type VerifierFn = (input: {
  output: unknown;
  criterion: AcceptanceCriterion;
  context?: AstroSpecContext;
  turn?: AstroSpecTurn;
  env: VerifyEnv;
}) => Promise<Omit<VerifierResult, "criterionId" | "verifier">>;

const registry: Record<string, VerifierFn> = Object.create(null);

export function registerVerifier(id: string, fn: VerifierFn): void {
  registry[id] = fn;
}

function asString(output: unknown): string | null {
  return typeof output === "string" ? output : null;
}

function toAbsPath(ref: string, cwd: string): string {
  if (ref.startsWith("file://")) {
    // file:// URLs are supported for local refs
    const url = new URL(ref);
    return url.pathname;
  }
  if (/^https?:\/\//i.test(ref)) {
    // core does not fetch remote refs
    return ref;
  }
  return isAbsolute(ref) ? ref : resolve(cwd, ref);
}

async function sha256File(path: string): Promise<string> {
  const buf = await fs.readFile(path);
  const hex = createHash("sha256").update(buf).digest("hex");
  return `sha256:${hex}`;
}

// ---------------- Built-in verifiers ----------------

registerVerifier("equals", async ({ output, criterion }) => {
  const expected = criterion.params ? (criterion.params["value"] as any) : undefined;
  const pass = JSON.stringify(output) === JSON.stringify(expected);
  return { pass, details: pass ? "Output equals expected value." : "Output did not equal expected value." };
});

registerVerifier("regex_match", async ({ output, criterion }) => {
  const s = asString(output);
  if (s == null) return { pass: false, details: "Output is not a string." };
  const pattern = criterion.params && typeof criterion.params["pattern"] === "string" ? (criterion.params["pattern"] as string) : "";
  const flags = criterion.params && typeof criterion.params["flags"] === "string" ? (criterion.params["flags"] as string) : "";
  if (!pattern) return { pass: false, details: "params.pattern is required." };
  const re = new RegExp(pattern, flags);
  const pass = re.test(s);
  return { pass, details: pass ? "Matched." : "Did not match." };
});

registerVerifier("count_between", async ({ output, criterion }) => {
  const arr = Array.isArray(output) ? output : null;
  if (!arr) return { pass: false, details: "Output is not an array." };
  const min = criterion.params && typeof criterion.params["min"] === "number" ? (criterion.params["min"] as number) : -Infinity;
  const max = criterion.params && typeof criterion.params["max"] === "number" ? (criterion.params["max"] as number) : +Infinity;
  const pass = arr.length >= min && arr.length <= max;
  return { pass, details: `length=${arr.length}, min=${String(min)}, max=${String(max)}` };
});

registerVerifier("contains_fields", async ({ output, criterion }) => {
  const fields = (criterion.params && Array.isArray(criterion.params["fields"]) ? (criterion.params["fields"] as any[]) : [])
    .filter(v => typeof v === "string") as string[];
  if (!fields.length) return { pass: false, details: "params.fields (string[]) is required." };

  const check = (obj: any): string | null => {
    if (!obj || typeof obj !== "object") return "Item is not an object.";
    for (const f of fields) {
      if (!(f in obj)) return `Missing field "${f}".`;
    }
    return null;
  };

  if (Array.isArray(output)) {
    for (let i = 0; i < output.length; i++) {
      const err = check(output[i]);
      if (err) return { pass: false, details: `Index ${i}: ${err}` };
    }
    return { pass: true, details: `All items contain: ${fields.join(", ")}` };
  }

  const err = check(output);
  if (err) return { pass: false, details: err };
  return { pass: true, details: `Output contains: ${fields.join(", ")}` };
});

registerVerifier("json_schema", async ({ output, criterion, env }) => {
  const schemaInline = criterion.params ? (criterion.params["schema"] as any) : undefined;
  const schemaRef = criterion.params && typeof criterion.params["schemaRef"] === "string" ? (criterion.params["schemaRef"] as string) : undefined;

  let schema: any = schemaInline;
  if (!schema && schemaRef) {
    const cwd = env.cwd || process.cwd();
    const path = toAbsPath(schemaRef, cwd);
    if (/^https?:\/\//i.test(path)) {
      return { pass: false, details: "Remote schemaRef URLs are not supported in core verifiers." };
    }
    schema = JSON.parse(await fs.readFile(path, "utf8"));
  }

  if (!schema || typeof schema !== "object") {
    return { pass: false, details: "params.schema (object) or params.schemaRef (path) is required." };
  }

  const localAjv = new Ajv2020({ allErrors: true, strict: false, allowUnionTypes: true });
  addFormats(localAjv);
  const validate = localAjv.compile(schema);
  const pass = validate(output) as boolean;
  if (pass) return { pass: true, details: "Output conforms to JSON Schema." };
  const details = (validate.errors || [])
    .map(e => `${e.instancePath || "/"}: ${e.message || "schema violation"}`)
    .join("; ");
  return { pass: false, details: details || "Schema validation failed." };
});

registerVerifier("artifact_exists", async ({ criterion, env }) => {
  const cwd = env.cwd || process.cwd();
  const evidence = (criterion.evidence || []) as EvidenceRef[];
  if (!evidence.length) {
    return { pass: false, details: "criterion.evidence[] is required for artifact_exists." };
  }

  const used: EvidenceRef[] = [];
  for (const ev of evidence) {
    const ref = String(ev.ref || "");
    if (!ref) return { pass: false, details: "Evidence ref is empty." };
    const path = toAbsPath(ref, cwd);
    if (/^https?:\/\//i.test(path)) {
      return { pass: false, details: `Remote evidence refs are not supported in core: ${ref}` };
    }
    try {
      await fs.access(path);
    } catch {
      return { pass: false, details: `Missing artifact: ${ref}` };
    }

    if (ev.checksum && ev.checksum.startsWith("sha256:")) {
      const actual = await sha256File(path);
      if (actual !== ev.checksum) {
        return { pass: false, details: `Checksum mismatch for ${ref}: expected ${ev.checksum}, got ${actual}` };
      }
    }

    used.push(ev);
  }

  return { pass: true, details: "All evidence artifacts exist.", evidenceUsed: used };
});

export async function verifyOutput(input: {
  output: unknown;
  criteria: ReadonlyArray<AcceptanceCriterion>;
  context?: AstroSpecContext;
  turn?: AstroSpecTurn;
  env?: VerifyEnv;
}): Promise<VerificationReport> {
  const now = (input.env?.now ? input.env.now() : new Date()).toISOString();
  const results: VerifierResult[] = [];

  for (const c of input.criteria || []) {
    const started = Date.now();
    const verifier = registry[c.verifier];
    if (!verifier) {
      results.push({
        criterionId: c.id,
        verifier: c.verifier,
        pass: false,
        durationMs: Date.now() - started,
        details: `No verifier registered for "${c.verifier}".`
      });
      continue;
    }

    try {
      const r = await verifier({
        output: input.output,
        criterion: c,
        context: input.context,
        turn: input.turn,
        env: input.env || {}
      });
      results.push({
        criterionId: c.id,
        verifier: c.verifier,
        pass: Boolean(r.pass),
        durationMs: Date.now() - started,
        details: r.details,
        evidenceUsed: r.evidenceUsed
      });
    } catch (err: any) {
      results.push({
        criterionId: c.id,
        verifier: c.verifier,
        pass: false,
        durationMs: Date.now() - started,
        details: `Verifier threw: ${err && err.message ? err.message : String(err)}`
      });
    }
  }

  const overall = results.every(r => r.pass);
  return {
    contextId: input.context?.id,
    turnId: input.turn?.id,
    overall,
    results,
    at: now
  };
}
