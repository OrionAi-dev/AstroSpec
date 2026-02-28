# Release guide

This repository follows **SemVer** with **Changesets** to manage package versions in the monorepo.

## Versioning strategy

- **SemVer + Changesets**: each package publishes its own SemVer version, tracked through Changesets.
- **Pre-1.0 policy**: while versions are `0.x`, breaking changes increment the **minor** version, and backwards-compatible fixes/features increment **patch**.
- **Workspace linking**: internal dependencies use `workspace:*` so releases stay consistent across packages.

## Release workflow

1. **Create changesets** for user-facing changes.
   ```bash
   pnpm changeset
   ```
2. **Review changesets** to ensure scope and summaries are correct.
3. **Bump versions**.
   ```bash
   pnpm changeset version
   ```
4. **Build and test** the repo.
   ```bash
   pnpm build
   pnpm test
   ```
5. **Commit** the version updates and changeset removals.
6. **Tag the release** (example for a repo-wide release).
   ```bash
   git tag v0.1.0
   ```
7. **Publish** packages if needed (registry or internal distribution).

## Release expectations

- Every release must be tied to at least one Changeset that explains the user-visible change.
- Releases should be tagged with `v<version>` and reference the corresponding changes in the notes.
- If only documentation changes are present, skip versioning and tagging.
