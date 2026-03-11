# Release Guide

AstroSpec releases are managed with **Changesets** and a dedicated GitHub Actions release workflow.

## Versioning strategy

- **SemVer + Changesets**: each published package is versioned independently through Changesets.
- **Pre-1.0 policy**: while versions are `0.x`, breaking changes increment the **minor** version and compatible fixes/features increment **patch**.
- **Workspace linking**: internal package edges use `workspace:*`, and the versioning step rewrites those edges before publication.
- **Exact downstream pinning**: downstream adopters should pin exact released versions until the release cadence stabilizes.

## Release workflow

1. **Add a changeset** for any user-visible package change.
   ```bash
   pnpm changeset
   ```
2. **Push the branch** and open a PR. The release workflow on `main` will manage version PRs and publishing after merge.
3. **Merge the PR** with the changeset intact.
4. On `main`, GitHub Actions will:
   - run `pnpm release:verify`
   - open or update a release PR if unpublished changesets exist
   - publish packages to npm when the release PR is merged
5. **Review the release PR carefully**. It is the point where version bumps, changelog notes, and internal dependency rewrites become canonical.

## Local commands

- Create a changeset:
  ```bash
  pnpm changeset
  ```
- Inspect pending release state:
  ```bash
  pnpm release:status
  ```
- Version packages locally:
  ```bash
  pnpm version-packages
  ```
- Run release gates locally:
  ```bash
  pnpm release:verify
  ```
- Run publish preflight:
  ```bash
  pnpm release:preflight
  ```

## Required CI and secrets

- `.github/workflows/release.yml` is the canonical release workflow.
- `NPM_TOKEN` must be configured in GitHub repository secrets before public publishing is attempted.
- `GITHUB_TOKEN` is used by the workflow to create release PRs, tags, and GitHub releases.
- `pnpm release:preflight` validates npm auth and reports whether the AstroSpec packages are unpublished or already versioned on npm.

## Release expectations

- Every public release must be tied to at least one Changeset.
- No ad hoc version bumps should bypass the Changesets workflow.
- Public releases must satisfy the release policy in `docs/governance/release-policy.md`.
- Documentation-only changes should not create a changeset unless they change published package behavior or public contract semantics.
