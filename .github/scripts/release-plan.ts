/**
 * Decides what the Release workflow does for the commit being built.
 *
 * Releases use npm staged publishing: CI stages the version with `npm stage publish`, a
 * maintainer approves it on npm with 2FA, and only then does it become public. A draft
 * GitHub release records each staged version until then, because staged versions do not
 * appear in npm's public metadata.
 *
 * The version in package.json is staged when npm has neither published nor staged it.
 * Its dist-tag is chosen at staging time (npm makes it immutable) from the versions that
 * are published or staged: the newest stable version is `latest`, an older major (a fix
 * on a maintenance branch such as `1.x`) is `latest-<major>`, and a prerelease is `next`.
 * (npm rejects tag names that are valid semver ranges, so `v1` cannot be used.)
 *
 * Run as a script (`bun .github/scripts/release-plan.ts`), it reads the versions with draft
 * GitHub releases from $STAGED_VERSIONS (comma-separated), writes the step outputs
 * version, tag, stage, awaiting-approval, npm-tag and prerelease to $GITHUB_OUTPUT, and
 * writes the release notes to $RELEASE_NOTES_FILE (default: release-notes.md).
 */

import fs from "node:fs";

export interface Packument {
  versions?: Record<string, unknown>;
  "dist-tags"?: Record<string, string>;
}

export interface Plan {
  version: string;
  tag: string;
  /** The version still has to be staged on npm */
  stage: boolean;
  /** The version is staged and waits for approval on npm */
  awaitingApproval: boolean;
  npmTag: string;
  prerelease: boolean;
  notes: string;
}

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;

/** Compares two semver versions by precedence (build metadata ignored). */
export function compareVersions(a: string, b: string): number {
  const pa = SEMVER.exec(a), pb = SEMVER.exec(b);
  if (!pa || !pb) throw new Error(`not a semver version: ${pa ? b : a}`);
  for (let i = 1; i <= 3; i++) {
    const d = Number(pa[i]) - Number(pb[i]);
    if (d !== 0) return Math.sign(d);
  }
  const [preA, preB] = [pa[4], pb[4]];
  if (preA === preB) return 0;
  if (preA === undefined) return 1; // a release ranks above its prereleases
  if (preB === undefined) return -1;
  const ia = preA.split("."), ib = preB.split(".");
  for (let i = 0; i < Math.max(ia.length, ib.length); i++) {
    if (ia[i] === undefined) return -1;
    if (ib[i] === undefined) return 1;
    const na = /^\d+$/.test(ia[i]), nb = /^\d+$/.test(ib[i]);
    if (na && nb && Number(ia[i]) !== Number(ib[i])) return Math.sign(Number(ia[i]) - Number(ib[i]));
    if (na !== nb) return na ? -1 : 1; // numeric identifiers rank below alphanumeric ones
    if (ia[i] !== ib[i]) return ia[i] < ib[i] ? -1 : 1;
  }
  return 0;
}

const isPrerelease = (v: string) => SEMVER.exec(v)?.[4] !== undefined;

/** Returns the body of the `## [version]` section of a Keep a Changelog file. */
export function changelogSection(changelog: string, version: string): string | undefined {
  const lines = changelog.split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith(`## [${version}]`));
  if (start < 0) return undefined;
  let end = lines.findIndex((l, i) => i > start && l.startsWith("## "));
  if (end < 0) end = lines.length;
  return lines.slice(start + 1, end).join("\n").trim();
}

export function plan(input: {
  version: string;
  branch: string;
  packument: Packument;
  /** Versions staged on npm and not approved yet (their GitHub releases are drafts) */
  staged: string[];
  changelog: string;
}): Plan {
  const { version, branch, packument, staged, changelog } = input;
  const parts = SEMVER.exec(version);
  if (!parts) throw new Error(`package.json version "${version}" is not semver`);
  const major = Number(parts[1]);

  // A maintenance branch "<major>.x" may only release its own major
  const maintenance = /^(\d+)\.x$/.exec(branch);
  if (maintenance && Number(maintenance[1]) !== major) {
    throw new Error(`branch ${branch} cannot release ${version}: its major must be ${maintenance[1]}`);
  }

  const published = Object.keys(packument.versions ?? {});
  const onNpm = published.includes(version);
  const awaitingApproval = !onNpm && staged.includes(version);
  const stage = !onNpm && !awaitingApproval;
  const prerelease = parts[4] !== undefined;

  // The newest stable version among the published latest and everything staged
  const latest = packument["dist-tags"]?.latest;
  const newest = [...(latest ? [latest] : []), ...staged.filter((v) => v !== version && !isPrerelease(v))]
    .sort(compareVersions)
    .pop();
  let npmTag: string;
  if (prerelease) npmTag = "next";
  else if (newest === undefined || compareVersions(version, newest) >= 0) npmTag = "latest";
  else npmTag = `latest-${major}`;

  const notes = changelogSection(changelog, version);
  if (stage && !notes) {
    throw new Error(`CHANGELOG.md has no "## [${version}]" section; add one before releasing ${version}`);
  }

  return { version, tag: `v${version}`, stage, awaitingApproval, npmTag, prerelease, notes: notes ?? "" };
}

export async function fetchPackument(name: string): Promise<Packument> {
  const url = `https://registry.npmjs.org/${name.replace("/", "%2f")}`;
  const res = await fetch(url, { headers: { accept: "application/vnd.npm.install-v1+json" } });
  if (res.status === 404) return {};
  if (!res.ok) throw new Error(`GET ${url}: ${res.status} ${res.statusText}`);
  return (await res.json()) as Packument;
}

async function main(): Promise<void> {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8")) as { name: string; version: string };
  const result = plan({
    version: pkg.version,
    branch: process.env.GITHUB_REF_NAME ?? "",
    packument: await fetchPackument(pkg.name),
    staged: (process.env.STAGED_VERSIONS ?? "").split(",").filter(Boolean),
    changelog: fs.readFileSync("CHANGELOG.md", "utf8"),
  });

  fs.writeFileSync(process.env.RELEASE_NOTES_FILE ?? "release-notes.md", result.notes + "\n");
  const outputs = {
    version: result.version,
    tag: result.tag,
    stage: String(result.stage),
    "awaiting-approval": String(result.awaitingApproval),
    "npm-tag": result.npmTag,
    prerelease: String(result.prerelease),
  };
  const lines = Object.entries(outputs).map(([k, v]) => `${k}=${v}`).join("\n") + "\n";
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, lines);
  const what = result.stage ? `stage on npm as "${result.npmTag}"`
    : result.awaitingApproval ? "staged, waiting for approval on npm"
      : "already on npm";
  console.log(`${pkg.name}@${result.version}: ${what}`);
  process.stdout.write(lines);
}

// Run only as a script, not when imported by the tests
if (/release-plan\.ts$/.test(process.argv[1] ?? "")) {
  main().catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
