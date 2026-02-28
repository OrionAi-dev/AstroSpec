import { parseMindQL } from "@astrospec/mindql-core";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
export default function mindql() {
  return {
    name: "mindql",
    handles: [".mindql"],
    async generate(file: { path: string; text: string }, ctx: { outDir: string }) {
      const ast = parseMindQL(file.text);
      const outPath = join(ctx.outDir, "mindql", "ast.json");
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, JSON.stringify(ast, null, 2));
      return { artifacts: [outPath] };
    }
  };
}
