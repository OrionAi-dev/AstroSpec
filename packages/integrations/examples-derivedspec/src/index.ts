import type { DerivedSpec } from "@openspec/runtime";

export const astrospecDerivedSpec: DerivedSpec = {
  // which base spec we are deriving from
  baseId: "openspec",

  // JSON-Patch operations (as before)
  patches: [
    { op: "add", path: "/fields/openspec", value: { type: "string", required: false } }
  ],

  // keep runtime validators happy (they expect provenance to exist for DerivedSpec)
  provenance: []
};

export default astrospecDerivedSpec;
