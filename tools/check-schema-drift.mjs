#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const repoRoot = process.cwd();

const canonicalDir = path.join(repoRoot, "packages", "openspec-schema", "schemas", "openspec");
const docsDir = path.join(repoRoot, "docs", "openspec", "schemas");

async function listJson(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter(e => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map(e => e.name)
    .sort();
}

function normalizeNewlines(s) {
  // CI may check out with different newline settings; normalize for comparisons.
  return s.replace(/\r\n/g, "\n");
}

async function main() {
  const canonicalFiles = await listJson(canonicalDir);
  const docsFiles = await listJson(docsDir);

  const canonicalSet = new Set(canonicalFiles);
  const docsSet = new Set(docsFiles);

  const missingInDocs = canonicalFiles.filter(f => !docsSet.has(f));
  const extraInDocs = docsFiles.filter(f => !canonicalSet.has(f));

  let ok = true;
  if (missingInDocs.length) {
    ok = false;
    console.error("Missing docs schema copies:");
    for (const f of missingInDocs) console.error(`- ${path.join("docs/openspec/schemas", f)}`);
  }

  if (extraInDocs.length) {
    ok = false;
    console.error("Extra docs schema files not present in canonical package:");
    for (const f of extraInDocs) console.error(`- ${path.join("docs/openspec/schemas", f)}`);
  }

  for (const f of canonicalFiles) {
    const srcPath = path.join(canonicalDir, f);
    const dstPath = path.join(docsDir, f);

    const src = normalizeNewlines(await fs.readFile(srcPath, "utf8"));
    let dst = "";
    try {
      dst = normalizeNewlines(await fs.readFile(dstPath, "utf8"));
    } catch {
      continue; // missing already reported
    }

    if (src !== dst) {
      if (WRITE) {
        await fs.writeFile(dstPath, src, "utf8");
        console.log(`updated ${path.relative(repoRoot, dstPath)}`);
      } else {
        ok = false;
        console.error(`Schema drift: ${path.relative(repoRoot, dstPath)} differs from canonical ${path.relative(repoRoot, srcPath)}`);
      }
    }
  }

  if (!ok) {
    console.error("Schema drift check failed.");
    console.error('Fix by running: node tools/check-schema-drift.mjs --write');
    process.exit(1);
  }

  console.log("Schema drift check passed.");
}

main().catch(err => {
  console.error(err);
  process.exit(2);
});

