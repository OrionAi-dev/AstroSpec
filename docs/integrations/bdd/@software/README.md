# OpenSpec Implementation: @software

This profile applies OpenSpec to software delivery. It defines the field set, acceptance criteria shape, and adapters that map specs to tests and pipelines.

## Scope
- Features, bugs, and technical tasks
- API and UI behavior
- Nonfunctional requirements (security, performance, accessibility)

## File Format
YAML with a top-level `kind` and a `meta` block, plus `requirements` and `criteria`.
External BDD specifications can also be referenced via the `bdd` and `bdd_ref` fields (see `schema.yaml`).

## Validation
- All files must pass the core OpenSpec rules and the @software schema in `schema.yaml`.
- The GitHub Actions workflow in `ci/validate.yml` runs schema validation and checks that all referenced BDD files exist.

## Adapters
Adapters translate OpenSpec criteria into test artifacts for different ecosystems:

- Jest mapper: generates Jest test skeletons
- Cucumber mapper: converts criteria into Gherkin `.feature` files
- SpecFlow mapper: maps to SpecFlow `.feature` files with .NET bindings
- Behave mapper: maps to Behave `.feature` files with Python steps
- JBehave mapper: maps to `.story` files with Java bindings
- Behat mapper: maps to Behat `.feature` files with PHP steps
- Robot mapper: maps to `.robot` test cases
- Karate mapper: maps to Karate `.feature` files for API tests

See `adapters/*.md` for usage and mapping details.

## Supported External BDD Schemas
The list of supported BDD schema families and their metadata lives in [`bdd-registry.yaml`](./bdd-registry.yaml).

Currently supported: Gherkin (Cucumber family), SpecFlow, Behave, JBehave, Behat, Robot Framework, and Karate.

## Examples
End-to-end examples are provided in the [`examples/`](./examples/BUG-RESET-PASSWORD.yaml) directory, including:

- Gherkin (`FEATURE-LOGIN.yaml`)
- SpecFlow (`SPECFLOW-LOGIN.yaml`)
- Behave (`BEHAVE-LOGIN.yaml`)
- JBehave (`JBEHAVE-LOGIN.yaml`)
- Behat (`BEHAT-LOGIN.yaml`)
- Robot Framework (`ROBOT-LOGIN.yaml`)
- Karate (`KARATE-LOGIN.yaml`)
