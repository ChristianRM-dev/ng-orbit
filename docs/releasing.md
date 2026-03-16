# Releasing ng-orbit

`ng-orbit` is released from GitHub Actions only. Local version bumps, local tags, and local
`npm publish` are intentionally not part of the supported flow.

## Required repository setup

### GitHub

- protect `main`
- require pull requests before merge
- require `Squash and merge`
- disable direct merge strategies that would bypass Conventional Commit PR titles
- require the `CI` workflow to pass before merge
- enable GitHub Pages for the repository:
  - open `Settings > Pages`
  - set `Source` to `GitHub Actions`
  - save once before the first deploy

The Pages deploy workflow assumes that the repository already has Pages enabled. The current
workflow uses `GITHUB_TOKEN`, which can deploy to an existing Pages site but cannot auto-enable
Pages for a repository that has never been configured.

### npm trusted publishing

Create trusted publishers in the `@ng-orbit` npm org for:

- repository: `ChristianRM-dev/ng-orbit`
- workflow file: `.github/workflows/publish-npm.yml`
- environment: `npm-release`
- branch: `main`

This lets GitHub-hosted runners publish to npm through OIDC without storing a long-lived
`NPM_TOKEN` in repository secrets.

## Release flow

1. Contributors merge feature PRs into `main` using squash merges.
2. PR titles must follow Conventional Commits.
3. `.github/workflows/release-prepare.yml` runs on `main`.
4. If public package changes require a release, the workflow opens or updates a release PR.
5. Merging that release PR triggers `.github/workflows/publish-npm.yml`.
6. The publish workflow publishes the public packages to npm, creates the `vX.Y.Z` tag, and
   creates the GitHub Release.

GitHub Pages is independent from npm releases and deploys on every push to `main`.

## First release bootstrap

Before `v0.1.0` exists, run `Prepare Release PR` manually from the GitHub Actions UI with:

- `first_release = true`
- `version = 0.1.0`

That creates the initial release PR. After it is merged and published, future releases are
driven automatically from Conventional Commits.
