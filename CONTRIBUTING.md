# Contributing to MCP Secure Context Sharing

Thank you for your interest in contributing!

## How to Contribute
- Open issues for bugs or feature requests
- Submit pull requests for improvements
- Share examples of MCP Secure Context Sharing in practice

## Development Setup
### Prerequisites
- Node.js 20 (matches the CI workflow).  
- pnpm 10.13.1 (as pinned in `package.json`).  

### Install
1. Clone the repo.
2. Install dependencies:
   ```bash
   pnpm install --frozen-lockfile
   ```
3. Create or edit framework docs in `docs/`.
4. Follow the guidelines in the white paper.

### Common commands
- `pnpm build`: build all workspace packages via Turbo.  
- `pnpm lint`: run lint checks across packages.  
- `pnpm test`: run tests across packages.  
- `pnpm docs`: regenerate API docs (TypeDoc) via `tools/gen-docs.sh`.  
- `pnpm changeset`: create a release note for a user-visible package change.  
- `pnpm release:verify`: run the required gates for a public release.  

### Release workflow
Use this for any PR that changes published package behavior:

1. Add a changeset with `pnpm changeset`.
2. Make sure `pnpm release:verify` passes locally.
3. Merge the PR normally. Do not hand-edit package versions.
4. The GitHub release workflow will open or update the release PR on `main`.
5. Merging the release PR is the only supported path for public package publication.

### Docs regeneration checklist
Use this when updating docs or APIs:
- [ ] Run `pnpm build` to ensure workspace packages compile.  
- [ ] Run `pnpm docs` to regenerate API Markdown.  
- [ ] Run `pnpm fix:doc-links` to normalize TypeDoc links.  
- [ ] Install MkDocs deps: `pip install -r docs/requirements.txt`.  
- [ ] Build MkDocs: `mkdocs build --strict --site-dir site`.  
- [ ] Verify the `site/` output locally if the change is visual.  

### Branding change checklist
Use this for rebrand or naming updates:
- [ ] Update brand names, logos, and taglines in `README.md`, `docs/`, and `site/` content.  
- [ ] Replace logo/asset files and update references in Markdown and MkDocs config.  
- [ ] Regenerate docs (`pnpm docs`) and rebuild the site (`mkdocs build`).  
- [ ] Check badges, release links, and package names for old branding.  

## Documentation generation
To rebuild the API docs and MkDocs site locally:

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Build the workspace packages (TypeDoc depends on build artifacts):
   ```bash
   pnpm -r build
   ```
3. Generate API docs with TypeDoc:
   ```bash
   bash tools/gen-docs.sh
   ```
   This script clears and regenerates `docs/api/` for each package.
4. Normalize Markdown links created by TypeDoc:
   ```bash
   node tools/clean-doc-links.mjs --write
   ```
5. Build the MkDocs site:
   ```bash
   mkdocs build --strict --site-dir site
   ```

CI runs a doc-drift check after generation. If it fails, rerun the steps above
and ensure `git diff -- docs/` is clean before pushing.
## Generated Artifacts
- Package builds output to each package's `dist/` directory (for example `packages/astrospec-runtime/dist/`).
- AstroSpec CLI runs (see `tools/verify-monorepo.sh`) emit artifacts under `generated/`, including:
  - `generated/mindql/ast.json`
  - `generated/graphql/schema.graphql`

These generated directories are not intended to be committed. Add or remove content by running the relevant build or CLI commands locally.

## Code of Conduct
Please be respectful and collaborative in discussions.
