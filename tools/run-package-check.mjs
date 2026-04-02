#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const target = process.argv[2];

if (!target) {
  console.error("usage: node tools/run-package-check.mjs <package-name>");
  process.exit(1);
}

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function packageDirFor(name) {
  const packageDirs = [
    ...readPackageDirs("packages"),
    ...readPackageDirs(join("packages", "integrations")),
  ];

  for (const dir of packageDirs) {
    const packageJsonPath = join(ROOT, dir, "package.json");
    if (!existsSync(packageJsonPath)) continue;
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    if (packageJson.name === name) {
      return { dir, packageJson };
    }
  }

  return null;
}

function readPackageDirs(baseDir) {
  const absolute = resolve(ROOT, baseDir);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(baseDir, entry.name));
}

const found = packageDirFor(target);

if (!found) {
  console.error(`unknown workspace package: ${target}`);
  process.exit(1);
}

const { packageJson } = found;
const scripts = packageJson.scripts ?? {};

if (scripts.build) {
  run("pnpm", ["-r", "--filter", `${target}...`, "build"]);
}

if (scripts.typecheck) {
  run("pnpm", ["-F", target, "typecheck"]);
}

if (scripts.test) {
  run("pnpm", ["-F", target, "test"]);
}
