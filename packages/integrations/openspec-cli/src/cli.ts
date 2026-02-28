#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, extname, basename } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

type Plugin = {
  name: string;
  handles: string[];
  generate(file: { path: string; text: string }, ctx: { outDir: string }): Promise<{ artifacts: string[] }>;
};

const tryLoad = (id: string) => { try { const m = require(id); return m.default ?? m; } catch { return null; } };

function loadPlugins(): Plugin[] {
  return [
    "@astrospec/openspec-plugin-mindql",
    "@astrospec/openspec-plugin-mindgraphql"
  ].map(tryLoad).filter(Boolean).map((p: any) => typeof p === "function" ? p() : p) as Plugin[];
}

async function main() {
  const cmd = basename(process.argv[1] ?? "astrospec");
  const input = process.argv[2];
  const outDir = process.argv[3] ?? "generated";
  if (!input) { console.error(`Usage: ${cmd} <file> [outDir]`); process.exit(1); }
  const text = readFileSync(resolve(input), "utf8");
  const ext = extname(input);
  const registry = loadPlugins();
  const plugin = registry.find(p => Array.isArray(p.handles) && p.handles.includes(ext));
  if (!plugin) { console.error(`No plugin registered for ${ext}.`); process.exit(2); }
  const result = await plugin.generate({ path: input, text }, { outDir });
  console.log("Generated:", result.artifacts.join(", "));
}
main().catch(e => { console.error(e); process.exit(3); });
