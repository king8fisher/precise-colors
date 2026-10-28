/**
 * Publishes the draft GitHub release of every staged version that has since been approved
 * on npm. Publishing a draft creates its vX.Y.Z tag on the commit it was drafted from.
 * The release is marked "latest" on GitHub when its version is npm's `latest`.
 *
 * Run as a script (`bun .github/scripts/finalize-releases.ts`) with GH_TOKEN and
 * GITHUB_REPOSITORY set; draft releases are only visible to a token with write access.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import { fetchPackument, type Packument } from "./release-plan";

export interface Finalize {
  tag: string;
  version: string;
  latest: boolean;
}

/** Splits draft release tags into those whose version npm has published and the rest. */
export function toFinalize(draftTags: string[], packument: Packument): { ready: Finalize[]; waiting: string[] } {
  const published = new Set(Object.keys(packument.versions ?? {}));
  const latest = packument["dist-tags"]?.latest;
  const ready: Finalize[] = [];
  const waiting: string[] = [];
  for (const tag of draftTags) {
    const version = tag.replace(/^v/, "");
    if (published.has(version)) ready.push({ tag, version, latest: version === latest });
    else waiting.push(tag);
  }
  return { ready, waiting };
}

function gh(args: string[]): string {
  return execFileSync("gh", [...args, "--repo", process.env.GITHUB_REPOSITORY ?? ""], { encoding: "utf8" });
}

async function main(): Promise<void> {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8")) as { name: string };
  const releases = JSON.parse(gh(["release", "list", "--limit", "100", "--json", "tagName,isDraft"])) as
    { tagName: string; isDraft: boolean }[];
  const drafts = releases.filter((r) => r.isDraft).map((r) => r.tagName);
  const { ready, waiting } = toFinalize(drafts, await fetchPackument(pkg.name));
  for (const r of ready) {
    gh(["release", "edit", r.tag, "--draft=false", `--latest=${r.latest}`]);
    console.log(`Published the GitHub release ${r.tag}${r.latest ? " (latest)" : ""}`);
  }
  for (const tag of waiting) console.log(`${tag} is staged and waits for approval on npm`);
  if (drafts.length === 0) console.log("No draft releases");
}

// Run only as a script, not when imported by the tests
if (/finalize-releases\.ts$/.test(process.argv[1] ?? "")) {
  main().catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
