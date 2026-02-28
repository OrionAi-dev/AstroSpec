// AstroSpec core parser + AST
// File extension: .ms

export type AstroSpecDocument = {
  kind: "AstroSpecDocument";
  version: string;
  blocks: AstroSpecBlock[];
};

export type AstroSpecBlock =
  | SourceBlock
  | EntityBlock
  | MappingBlock
  | EmitBlock;

export type SourceBlock = {
  kind: "Source";
  name: string;
  accepts: string[];
};

export type EntityBlock = {
  kind: "Entity";
  name: string;
  fields: EntityField[];
};

export type EntityField = {
  name: string;
  type: string;
  optional: boolean;
};

export type MappingBlock = {
  kind: "Map";
  from: string;
  to: string;
  rules: MappingRule[];
};

export type MappingRule = {
  target: string;
  expression: string;
};

export type EmitBlock = {
  kind: "Emit";
  target: string;
};

export type ParseOptions = {
  filename?: string;
};

/**
 * Parse a .ms AstroSpec file into an AST.
 * This parser is intentionally forgiving.
 */
export function parseAstroSpec(
  source: string,
  _options: ParseOptions = {}
): AstroSpecDocument {
  const lines = source
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith("#"));

  const blocks: AstroSpecBlock[] = [];
  let i = 0;

  function peek() {
    return lines[i];
  }

  function next() {
    return lines[i++];
  }

  while (i < lines.length) {
    const line = next();

    if (line.startsWith("version")) {
      continue;
    }

    if (line.startsWith("source ")) {
      const name = line.split(/\s+/)[1];
      const accepts: string[] = [];

      while (peek()?.startsWith("accepts")) {
        const l = next();
        accepts.push(
          ...l
            .replace("accepts", "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean)
        );
      }

      blocks.push({
        kind: "Source",
        name,
        accepts
      });
      continue;
    }

    if (line.startsWith("entity ")) {
      const name = line.split(/\s+/)[1];
      const fields: EntityField[] = [];

      while (peek() && !peek()!.startsWith("}")) {
        const l = next();
        const m = l.match(/^([\w]+)(\?)?:\s*(.+)$/);
        if (!m) continue;

        fields.push({
          name: m[1],
          optional: Boolean(m[2]),
          type: m[3]
        });
      }

      next(); // consume }
      blocks.push({
        kind: "Entity",
        name,
        fields
      });
      continue;
    }

    if (line.startsWith("map ")) {
      const [, from, , to] = line.split(/\s+/);
      const rules: MappingRule[] = [];

      while (peek() && !peek()!.startsWith("}")) {
        const l = next();
        const idx = l.indexOf("=");
        if (idx === -1) continue;

        rules.push({
          target: l.slice(0, idx).trim(),
          expression: l.slice(idx + 1).trim()
        });
      }

      next(); // consume }
      blocks.push({
        kind: "Map",
        from,
        to,
        rules
      });
      continue;
    }

    if (line.startsWith("emit ")) {
      const target = line.split(/\s+/)[1];
      blocks.push({
        kind: "Emit",
        target
      });
      continue;
    }
  }

  return {
    kind: "AstroSpecDocument",
    version: "0.1",
    blocks
  };
}
