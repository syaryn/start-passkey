import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const YOMIYASU_REF = "v2.5.0";
const YOMIYASU_REPO = "https://github.com/nanaism/yomiyasu.git";
const SKILL_SUBDIR = "skills/yomiyasu";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destDir = path.join(repoRoot, "apm-packages", "yomiyasu");
const stagingDir = path.join(repoRoot, ".tmp", "yomiyasu-apm-sync");

function runGit(args: string[], cwd: string): void {
  execFileSync("git", args, { cwd, stdio: "inherit" });
}

function main(): void {
  fs.mkdirSync(path.dirname(stagingDir), { recursive: true });
  fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.rmSync(destDir, { recursive: true, force: true });

  runGit(
    [
      "clone",
      "--depth",
      "1",
      "--branch",
      YOMIYASU_REF,
      "--filter=blob:none",
      "--sparse",
      YOMIYASU_REPO,
      stagingDir,
    ],
    repoRoot,
  );
  runGit(["sparse-checkout", "set", SKILL_SUBDIR], stagingDir);

  const sourceDir = path.join(stagingDir, SKILL_SUBDIR);
  fs.cpSync(sourceDir, destDir, { recursive: true });
  fs.rmSync(path.join(destDir, ".codex-plugin"), { recursive: true, force: true });

  fs.writeFileSync(
    path.join(destDir, ".upstream-ref"),
    `${YOMIYASU_REPO} ${SKILL_SUBDIR}@${YOMIYASU_REF}\n`,
    "utf8",
  );

  fs.rmSync(stagingDir, { recursive: true, force: true });
  console.log(`Synced yomiyasu ${YOMIYASU_REF} to ${path.relative(repoRoot, destDir)}`);
}

main();
