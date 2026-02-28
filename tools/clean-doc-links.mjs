#!/usr/bin/env node
// tools/clean-doc-links.mjs
import fs from "node:fs/promises";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const repoRoot = process.cwd();
const docsDir = path.join(repoRoot, "docs");

async function lsMarkdown(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await lsMarkdown(full)));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) out.push(full);
  }
  return out;
}
function rel(fromAbs, toAbs) {
  return path.relative(path.dirname(fromAbs), toAbs).replace(/\\/g, "/");
}

const target = {
  contextTurn: path.join(docsDir, "astrospec", "context-turn.md"),
};

const legacyLinkMap = {
  openspi: {
    overview: path.join(docsDir, "openspi", "overview.md"),
    "spec-language": path.join(docsDir, "astrospec", "spec-language.md"),
    "context-turn": path.join(docsDir, "astrospec", "context-turn.md"),
    typescript: path.join(docsDir, "astrospec", "typescript.md"),
    verification: path.join(docsDir, "astrospec", "verification.md"),
    templates: path.join(docsDir, "astrospec", "templates.md"),
    quickstart: path.join(docsDir, "astrospec", "quickstart.md"),
    roadmap: path.join(docsDir, "astrospec", "roadmap.md"),
  },
  openspec: {
    overview: path.join(docsDir, "astrospec", "spec-overview.md"),
    "spec-language": path.join(docsDir, "astrospec", "spec-language.md"),
    templates: path.join(docsDir, "astrospec", "templates.md"),
  },
};

function rewrite(fileAbs, content) {
  let txt = content;

  // 1) Any variant of ".../spec-bdd-context-turn.md" -> relative path to astrospec/context-turn.md
  txt = txt.replace(
    /\((?:\.{1,2}\/)*spec-bdd-context-turn\.md\)/gi,
    () => `(${rel(fileAbs, target.contextTurn)})`
  );

  // 2) Legacy links -> stable targets (only for known pages)
  txt = txt.replace(/\((?:\.{0,2}\/)*openspi\/([a-z0-9\-]+)\.md\)/gi, (_m, page) => {
    const dst = legacyLinkMap.openspi[page];
    return dst ? `(${rel(fileAbs, dst)})` : _m;
  });
  txt = txt.replace(/\((?:\.{0,2}\/)*openspec\/([a-z0-9\-]+)\.md\)/gi, (_m, page) => {
    const dst = legacyLinkMap.openspec[page];
    return dst ? `(${rel(fileAbs, dst)})` : _m;
  });

  // 4) API landing links on Home page -> .../README.md
  if (path.basename(fileAbs) === "index.md") {
    txt = txt.replace(
      /\bapi\/(schema|runtime|cli|legacy\/openspec-types|legacy\/openspec-runtime|integrations\/mindql-core|integrations\/mindgraphql-core|integrations\/openspec-plugin-mindql|integrations\/openspec-plugin-mindgraphql)\b(?!\/README\.md)/g,
      "api/$1/README.md"
    );
  }

  // 5) Normalize any accidental "(./docs/...)" to "(...)" just in case
  txt = txt.replace(/\((?:\.\/)*docs\//g, "(");

  return txt;
}

const files = await lsMarkdown(docsDir);
let changed = 0;

for (const f of files) {
  const before = await fs.readFile(f, "utf8");
  const after = rewrite(f, before);
  if (after !== before) {
    if (WRITE) {
      await fs.writeFile(f, after, "utf8");
      console.log(`fixed ${path.relative(docsDir, f)}`);
    } else {
      console.log(`would fix ${path.relative(docsDir, f)}`);
    }
    changed++;
  }
}

console.log(`${changed} file(s) ${WRITE ? "updated" : "would be updated"}`);
