import { test, expect } from "bun:test";
import { changelogSection, compareVersions, plan, type Packument } from "./release-plan";
import { toFinalize } from "./finalize-releases";

const changelog = `# Changelog

## [2.0.0] - 2026-10-28

### Changed

- Breaking things.

## [1.2.0] - 2026-10-28

### Fixed

- Fixed things.
`;

const registry = (versions: string[], latest?: string): Packument => ({
  versions: Object.fromEntries(versions.map((v) => [v, {}])),
  "dist-tags": latest ? { latest } : {},
});

test("compareVersions - semver precedence", () => {
  expect(compareVersions("1.2.0", "1.1.9")).toBe(1);
  expect(compareVersions("1.10.0", "1.9.0")).toBe(1);
  expect(compareVersions("2.0.0", "2.0.0")).toBe(0);
  expect(compareVersions("2.0.0-beta.1", "2.0.0")).toBe(-1);
  expect(compareVersions("2.0.0-beta.2", "2.0.0-beta.10")).toBe(-1);
  expect(compareVersions("2.0.0-alpha", "2.0.0-alpha.1")).toBe(-1);
  expect(compareVersions("2.0.0-1", "2.0.0-alpha")).toBe(-1);
  expect(compareVersions("1.0.0+build.5", "1.0.0")).toBe(0);
});

test("changelogSection - body of one version", () => {
  expect(changelogSection(changelog, "1.2.0")).toBe("### Fixed\n\n- Fixed things.");
  expect(changelogSection(changelog, "2.0.0")).toBe("### Changed\n\n- Breaking things.");
  expect(changelogSection(changelog, "1.1.0")).toBeUndefined();
  expect(changelogSection(changelog.replace(/\n/g, "\r\n"), "1.2.0")).toBe("### Fixed\n\n- Fixed things.");
});

test("plan - first releases of both branches", () => {
  const npm = registry(["1.0.0", "1.1.0"], "1.1.0");
  // main first: 2.0.0 is staged as latest, so 1.2.0 must not also be staged as latest
  expect(plan({ version: "2.0.0", branch: "main", packument: npm, staged: [], changelog })).toMatchObject({ stage: true, npmTag: "latest" });
  expect(plan({ version: "1.2.0", branch: "1.x", packument: npm, staged: ["2.0.0"], changelog })).toMatchObject({ stage: true, npmTag: "v1" });
  // 1.x first: 1.2.0 is latest until 2.0.0 is staged after it
  expect(plan({ version: "1.2.0", branch: "1.x", packument: npm, staged: [], changelog })).toMatchObject({ stage: true, npmTag: "latest" });
  expect(plan({ version: "2.0.0", branch: "main", packument: npm, staged: ["1.2.0"], changelog })).toMatchObject({ stage: true, npmTag: "latest" });
  // published 2.0.0 also keeps a later 1.x release off latest
  const after = registry(["1.1.0", "2.0.0"], "2.0.0");
  expect(plan({ version: "1.2.0", branch: "1.x", packument: after, staged: [], changelog })).toMatchObject({ stage: true, npmTag: "v1" });
});

test("plan - staged versions wait for approval, published ones are done", () => {
  const npm = registry(["1.1.0"], "1.1.0");
  expect(plan({ version: "2.0.0", branch: "main", packument: npm, staged: ["2.0.0"], changelog }))
    .toMatchObject({ stage: false, awaitingApproval: true, tag: "v2.0.0" });
  expect(plan({ version: "2.0.0", branch: "main", packument: registry(["2.0.0"], "2.0.0"), staged: [], changelog }))
    .toMatchObject({ stage: false, awaitingApproval: false });
});

test("plan - prereleases go to next and do not count as the newest stable version", () => {
  const cl = changelog.replace("## [2.0.0]", "## [2.1.0-beta.1]");
  expect(plan({ version: "2.1.0-beta.1", branch: "main", packument: registry(["2.0.0"], "2.0.0"), staged: [], changelog: cl }))
    .toMatchObject({ stage: true, npmTag: "next", prerelease: true });
  expect(plan({ version: "2.0.0", branch: "main", packument: registry(["1.1.0"], "1.1.0"), staged: ["2.1.0-beta.1"], changelog }))
    .toMatchObject({ npmTag: "latest" });
});

test("plan - guards", () => {
  // a maintenance branch may only release its own major
  expect(() => plan({ version: "2.0.0", branch: "1.x", packument: registry([]), staged: [], changelog })).toThrow(/major must be 1/);
  // staging needs a CHANGELOG section
  expect(() => plan({ version: "1.3.0", branch: "1.x", packument: registry(["1.2.0"], "1.2.0"), staged: [], changelog })).toThrow(/no "## \[1.3.0\]" section/);
  // but a published version does not
  expect(plan({ version: "1.1.0", branch: "1.x", packument: registry(["1.1.0"], "1.1.0"), staged: [], changelog }).stage).toBe(false);
  expect(() => plan({ version: "1.2", branch: "main", packument: registry([]), staged: [], changelog })).toThrow(/not semver/);
});

test("toFinalize - publishes drafts whose versions npm approved", () => {
  const npm = registry(["1.1.0", "1.2.0", "2.0.0"], "2.0.0");
  expect(toFinalize(["v2.0.0", "v1.2.0", "v2.1.0"], npm)).toEqual({
    ready: [{ tag: "v2.0.0", version: "2.0.0", latest: true }, { tag: "v1.2.0", version: "1.2.0", latest: false }],
    waiting: ["v2.1.0"],
  });
  expect(toFinalize([], npm)).toEqual({ ready: [], waiting: [] });
});
