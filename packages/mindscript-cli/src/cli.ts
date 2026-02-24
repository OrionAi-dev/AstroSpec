#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import process from "node:process";
import YAML from "yaml";
import {
  SCHEMA_IDS,
  validateContext,
  validateTurn,
  validateWithSchema,
  lockSpec,
  mergeContextIntoTurn,
  diffSpecs,
  verifyOutput
} from "@mindscript/runtime";
import { validate as validateContract } from "@mindscript/kit";
import type { MindscriptKitKind } from "@mindscript/kit";

type Format = "json" | "yaml" | "text";

function usage(): never {
  console.error(
    [
      "Usage:",
      "  mindscript validate <file>",
      "  mindscript lock <file> [--write] [--yaml]",
      "  mindscript merge --context <ctxFile> --turn <turnFile> [--yaml]",
      "  mindscript diff <fileA> <fileB> [--json]",
      "  mindscript verify --turn <turnFile> --output <outputFile> [--context <ctxFile>] [--write <reportFile>] [--yaml]",
      "  mindscript validate-contract --kind <kind> <file>",
      "  mindscript doctor"
    ].join("\n")
  );
  process.exit(1);
}

function readFileAny(path: string): { value: any; format: Format } {
  const raw = readFileSync(resolve(path), "utf8");
  const ext = extname(path).toLowerCase();
  if (ext === ".json") return { value: JSON.parse(raw), format: "json" };
  if (ext === ".yaml" || ext === ".yml") return { value: YAML.parse(raw), format: "yaml" };
  return { value: raw, format: "text" };
}

function writeAny(value: any, opts: { yaml?: boolean }): string {
  if (opts.yaml) return YAML.stringify(value);
  return JSON.stringify(value, null, 2) + "\n";
}

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

function takeOpt(args: string[], flag: string): string | null {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  const v = args[idx + 1];
  if (!v || v.startsWith("-")) return null;
  return v;
}

async function cmdValidate(args: string[]) {
  const file = args[0];
  if (!file) usage();
  const { value } = readFileAny(file);

  let ok = false;
  let errors: any[] = [];

  if (Array.isArray(value)) {
    const res = validateWithSchema(SCHEMA_IDS.acceptanceCriteria, value);
    ok = res.ok;
    if (!res.ok) errors = res.errors;
  } else if (value && typeof value === "object" && value.kind === "context") {
    const res = validateContext(value);
    ok = res.ok;
    if (!res.ok) errors = res.errors;
  } else if (value && typeof value === "object" && value.kind === "turn") {
    const res = validateTurn(value);
    ok = res.ok;
    if (!res.ok) errors = res.errors;
  } else if (value && typeof value === "object" && "results" in value && "overall" in value) {
    const res = validateWithSchema(SCHEMA_IDS.verificationReport, value);
    ok = res.ok;
    if (!res.ok) errors = res.errors;
  } else {
    console.error("Unknown file shape: expected Context, Turn, acceptanceCriteria[], or VerificationReport.");
    process.exit(1);
  }

  if (ok) process.exit(0);
  console.error("Schema validation failed:");
  for (const e of errors) {
    console.error(`- ${e.path}: ${e.message}`);
  }
  process.exit(1);
}

async function cmdLock(args: string[]) {
  const file = args[0];
  if (!file) usage();
  const yamlOut = hasFlag(args, "--yaml");
  const writeBack = hasFlag(args, "--write");

  const abs = resolve(file);
  const { value } = readFileAny(abs);
  if (!value || typeof value !== "object" || (value.kind !== "context" && value.kind !== "turn")) {
    console.error("lock expects a Context or Turn object.");
    process.exit(1);
  }

  const locked = lockSpec(value as any);
  const outText = writeAny(locked, { yaml: yamlOut });

  if (writeBack) {
    writeFileSync(abs, outText, "utf8");
  } else {
    process.stdout.write(outText);
  }
}

async function cmdMerge(args: string[]) {
  const ctxFile = takeOpt(args, "--context");
  const turnFile = takeOpt(args, "--turn");
  if (!ctxFile || !turnFile) usage();

  const yamlOut = hasFlag(args, "--yaml");
  const ctx = readFileAny(ctxFile).value;
  const turn = readFileAny(turnFile).value;
  const merged = mergeContextIntoTurn(ctx as any, turn as any);
  process.stdout.write(writeAny(merged, { yaml: yamlOut }));
}

async function cmdDiff(args: string[]) {
  const aFile = args[0];
  const bFile = args[1];
  if (!aFile || !bFile) usage();

  const jsonOut = hasFlag(args, "--json");
  const a = readFileAny(aFile).value;
  const b = readFileAny(bFile).value;
  const diff = diffSpecs(a as any, b as any);

  if (jsonOut) {
    process.stdout.write(JSON.stringify(diff, null, 2) + "\n");
    return;
  }

  const lines: string[] = [];
  if (diff.fields.added.length) lines.push(`fields added: ${diff.fields.added.join(", ")}`);
  if (diff.fields.removed.length) lines.push(`fields removed: ${diff.fields.removed.join(", ")}`);
  if (diff.fields.changed.length) lines.push(`fields changed: ${diff.fields.changed.map(c => c.key).join(", ")}`);
  if (diff.acceptanceCriteria.added.length) lines.push(`criteria added: ${diff.acceptanceCriteria.added.join(", ")}`);
  if (diff.acceptanceCriteria.removed.length) lines.push(`criteria removed: ${diff.acceptanceCriteria.removed.join(", ")}`);
  if (diff.acceptanceCriteria.changed.length) lines.push(`criteria changed: ${diff.acceptanceCriteria.changed.map(c => c.id).join(", ")}`);
  if (diff.metaChanged) lines.push("meta changed");
  if (diff.provenanceChanged) lines.push("provenance changed");

  process.stdout.write(lines.length ? lines.join("\n") + "\n" : "no changes\n");
}

async function cmdVerify(args: string[]) {
  const turnFile = takeOpt(args, "--turn");
  const outFile = takeOpt(args, "--output");
  const ctxFile = takeOpt(args, "--context");
  const writePath = takeOpt(args, "--write");
  if (!turnFile || !outFile) usage();

  const yamlOut = hasFlag(args, "--yaml");

  const turnAbs = resolve(turnFile);
  const turn = readFileAny(turnAbs).value;
  const ctx = ctxFile ? readFileAny(ctxFile).value : undefined;

  const outputAbs = resolve(outFile);
  const { value: output, format } = readFileAny(outputAbs);
  const outputValue = format === "text" ? String(output) : output;

  const report = await verifyOutput({
    output: outputValue,
    criteria: (turn && turn.acceptanceCriteria) || [],
    context: ctx,
    turn,
    env: { cwd: dirname(turnAbs) }
  });

  const outText = writeAny(report, { yaml: yamlOut });
  if (writePath) {
    writeFileSync(resolve(writePath), outText, "utf8");
  } else {
    process.stdout.write(outText);
  }
}

async function cmdValidateContract(args: string[]) {
  const kindRaw = takeOpt(args, "--kind");
  const file = args.find((arg) => !arg.startsWith("-") && arg !== kindRaw) || takeOpt(args, "--file");
  if (!kindRaw || !file) usage();

  const validKinds = new Set<MindscriptKitKind>([
    "plan-turn",
    "exec-turn",
    "tool-policy-spec",
    "tool-call-record",
    "repopack",
    "run-log-entry",
    "chat-orchestration-audit",
    "git-history-summary",
  ]);

  if (!validKinds.has(kindRaw as MindscriptKitKind)) {
    console.error(`Unsupported kind: ${kindRaw}`);
    process.exit(1);
  }

  const payload = readFileAny(file).value;
  const out = validateContract(kindRaw as MindscriptKitKind, payload);

  if (out.ok) {
    process.exit(0);
  }

  console.error(`Contract validation failed for ${kindRaw}:`);
  for (const e of out.errors) {
    console.error(`- ${e}`);
  }
  if (out.nextHint) {
    console.error(`hint: ${out.nextHint}`);
  }
  process.exit(1);
}

async function cmdDoctor() {
  const report = {
    cli: "mindscript",
    protocol: "mindscript",
    canonicalPackages: [
      "@mindscript/agent-contracts",
      "@mindscript/mcp-profile",
      "@mindscript/kit",
    ],
    deprecatedAliases: [
      "@orionai/mindscript-agent-contracts",
      "@orionai/mindscript-mcp-profile",
    ],
  };
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const rest = args.slice(1);

  switch (cmd) {
    case "validate":
      await cmdValidate(rest);
      return;
    case "lock":
      await cmdLock(rest);
      return;
    case "merge":
      await cmdMerge(rest);
      return;
    case "diff":
      await cmdDiff(rest);
      return;
    case "verify":
      await cmdVerify(rest);
      return;
    case "validate-contract":
      await cmdValidateContract(rest);
      return;
    case "doctor":
      await cmdDoctor();
      return;
    default:
      usage();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(2);
});
