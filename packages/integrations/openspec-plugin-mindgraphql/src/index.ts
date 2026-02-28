import { normalizeMindGraphQL } from "@astrospec/mindgraphql-core";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
export default function mindgraphql() {
  return {
    name: "mindgraphql",
    handles: [".mindgql"],
    async generate(file: { path: string; text: string }, ctx: { outDir: string }) {
      const sdl = normalizeMindGraphQL(file.text);
      const schemaPath = join(ctx.outDir, "graphql", "schema.graphql");
      mkdirSync(dirname(schemaPath), { recursive: true });
      writeFileSync(schemaPath, sdl);
      return { artifacts: [schemaPath] };
    }
  };
}
