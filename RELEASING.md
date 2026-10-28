# Releasing

Releases run through [`.github/workflows/release.yml`](.github/workflows/release.yml),
only when you start it, and use npm's [staged publishing](https://docs.npmjs.com/staged-publishing):
the workflow uploads a release to npm, but nothing becomes public until a maintainer
approves it with 2FA.

Pushing only runs CI. A release starts when you run the **Release** workflow for a
branch: *Actions → Release → Run workflow*, or `gh workflow run release.yml --ref <branch>`.
After CI passes, each run does the next step for that branch:

- **Version not on npm yet:** stages it with `npm stage publish` through
  [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (no token is stored
  anywhere; provenance is attached) and drafts a GitHub release whose notes are that
  version's CHANGELOG section.
- **Staged and approved on npm since the last run:** publishes the draft GitHub release,
  which creates the `vX.Y.Z` tag on the released commit.
- **Staged and still waiting for approval:** nothing.

## Making a release

1. Bump `version` in `package.json`.
2. In `CHANGELOG.md`, rename `## [Unreleased]` to `## [x.y.z] - YYYY-MM-DD`.
   Staging fails if that section is missing.
3. Commit and push, then run the Release workflow for the branch.
4. Approve the staged version with 2FA: npmjs.com → the package → *Staged Packages* →
   *Approve*, or `npm stage list` and `npm stage approve <stage-id>`.
5. Run the Release workflow again to publish the GitHub release and create the tag.

## Branches and dist-tags

| Branch | Releases         | npm dist-tag                                 |
| ------ | ---------------- | -------------------------------------------- |
| `main` | the newest major | `latest`                                     |
| `1.x`  | 1.x fixes        | `latest` until 2.0.0 exists, then `latest-1` |

Prereleases such as `2.1.0-beta.1` get `next`. npm fixes the dist-tag when a version is
staged, and staged versions count when choosing it. So when you release `main` and
`1.x` together, run the workflow for `main` first: then `2.0.0` is staged as `latest` and
`1.2.0` as `latest-1`. If two staged versions both say `latest`, approve the older one first.

A maintenance branch refuses to release a different major (for example 2.0.0 from
`1.x`). Fixes that apply to both majors are committed on one branch and cherry-picked
to the other.

## One-time setup

1. **npm → package settings → Trusted publishing → GitHub Actions:**
   - Organization or user: `king8fisher`
   - Repository: `precise-colors`
   - Workflow filename: `release.yml`
   - Environment name: `npm`
   - Allowed actions: leave only `npm stage publish` (do not enable `npm publish`)

   npm does not check these when you save them, and a new configuration expires if no
   release uses it within 2 days, so run the first release soon after.
2. **npm → package settings → Publishing access:** choose *Require two-factor
   authentication and disallow tokens*.
3. **GitHub (optional):** in *Settings → Branches*, protect `main` and `1.x` and require
   the CI checks to pass.

## If something goes wrong

- A failed run can be re-run; steps that already finished are skipped.
- If staging succeeded but drafting the GitHub release failed, the next run tries to
  stage again and npm refuses the duplicate. Create the draft release by hand
  (`gh release create vX.Y.Z --draft --target <commit> --notes-file …`), or reject the
  staged version with `npm stage reject <stage-id>` and re-run.
- To withdraw a staged version, reject it on npm and delete its draft GitHub release.
