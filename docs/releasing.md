# Release process

`dev` is the development branch. `production` contains the code eligible for an
npm release. CI runs on pushes to both branches and on pull requests targeting
either branch. Neither branch publishes automatically.

## One-time GitHub and npm setup

1. Push the `production` branch after the workflow changes have been committed.
2. In GitHub **Settings → Rules → Rulesets** (or branch protection), protect
   `production`: require a pull request, require the CI checks to pass, and
   prevent direct pushes. Reviewers and administrators should follow the same
   rules where your plan supports them.
3. In GitHub **Settings → Environments**, create `npm-production`. Require
   reviewers and restrict deployment branches to `production`. The environment
   name in the workflow does **not** create an approval rule automatically.
4. In npm, configure a GitHub Actions Trusted Publisher for the package
   `afghanistan-province-chart` using this repository and the workflow file
   `.github/workflows/release.yml`. If npm requires an initial package publish
   before configuring Trusted Publishing, perform that first publish manually
   from a verified tarball, then configure Trusted Publishing for later releases.

No npm token is stored in GitHub: the release job requests a short-lived OIDC
credential. Only run it after checking the environment and npm settings.

## Each release

1. Bump `packages/react/package.json` to a version not already on npm and update
   `CHANGELOG.md`. Merge the tested changes from `dev` into `production` via a
   pull request with passing CI.
2. From GitHub **Actions → Release → Run workflow**, select **production** and
   enter `publish`. The job refuses to run from another branch, reruns checks
   (including browser tests), waits for environment approval, then publishes
   the package with the `latest` dist-tag and provenance.
3. Check the published version and install it in a consumer project. Do not
   re-run the workflow for the same version; npm package versions are immutable.

The playground is a static demo; this workflow publishes the npm package, not
the demo website.
