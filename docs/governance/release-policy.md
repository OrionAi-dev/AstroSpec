# Release Policy

## Required For Public Releases

1. relevant package builds pass
2. tests pass
3. conformance fixtures are up to date
4. schema drift checks pass
5. docs and examples match the shipped contract surface
6. migration notes exist for any compatibility-impacting change

## Release Authority

1. Public releases are cut from `main` only.
2. The canonical release mechanism is the GitHub Actions workflow in `.github/workflows/release.yml`.
3. Versioning must be driven by Changesets, not manual `package.json` edits.

## Required Inputs

1. At least one reviewed changeset for user-visible package changes
2. A passing `pnpm release:verify` result
3. A passing `pnpm release:preflight` result for any publish attempt
4. Repository secrets required for publishing:
   - `NPM_TOKEN`

## Downstream Consumption Guidance

1. Downstream adopters should use exact version pins for initial OpenSpec adoption.
2. Repo-pin or path-based testing is acceptable before the first formal published release, but it is not the release authority.
3. Downstream repos should not treat unreleased branch state as canonical package supply.
