/**
 * One-off / maintenance: set entry.url to site top (origin only).
 * When url was a deep link, move it to verifiedUrl if help URLs already match each other.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entrySchema, type Entry } from "../apps/website/src/data/schema.ts";
import { parseCsv, parseCsvRecords, serializeCsvRecords } from "./csv.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const entriesDir = path.join(repoRoot, "apps/website/src/data/entries");
const csvPath = path.join(repoRoot, "docs/entries_all_20261101.csv");

function normalizeHref(a: string, b: string): boolean {
  return new URL(a).href === new URL(b).href;
}

function siteOrigin(urlStr: string): string {
  const u = new URL(urlStr);
  return `${u.protocol}//${u.host}`;
}

function isNonTopOfficialUrl(urlStr: string): boolean {
  const u = new URL(urlStr);
  const pathOnly = u.pathname.replace(/\/+$/, "") || "";
  if (!pathOnly) {
    return false;
  }
  if (/^\/(ja-jp|ja-JP|jp|ja)$/i.test(pathOnly)) {
    return false;
  }
  return true;
}

function applyNormalization(entry: Entry): { entry: Entry; changed: boolean } {
  if (!entry.url || !isNonTopOfficialUrl(entry.url)) {
    return { entry, changed: false };
  }

  const previousUrl = entry.url;
  const next: Entry = structuredClone(entry);
  next.url = siteOrigin(previousUrl);

  const doc =
    next.recommendation === "passkey" ||
    next.recommendation === "authenticator" ||
    next.recommendation === "code"
      ? next.documentationUrl
      : undefined;

  if (doc && normalizeHref(next.verifiedUrl, doc) && !normalizeHref(previousUrl, doc)) {
    next.verifiedUrl = previousUrl;
  } else if (normalizeHref(next.verifiedUrl, previousUrl)) {
    next.verifiedUrl = previousUrl;
  }

  return { entry: next, changed: true };
}

function main() {
  const files = fs.readdirSync(entriesDir).filter((f) => f.endsWith(".json"));
  const updates = new Map<string, { url: string; verifiedUrl: string }>();

  for (const file of files) {
    const id = file.replace(/\.json$/, "");
    const raw = JSON.parse(fs.readFileSync(path.join(entriesDir, file), "utf8"));
    const parsed = entrySchema.parse(raw);
    const { entry, changed } = applyNormalization(parsed);
    if (!changed) {
      continue;
    }
    fs.writeFileSync(path.join(entriesDir, file), `${JSON.stringify(entry, null, 2)}\n`, "utf8");
    const officialUrl = entry.url ?? siteOrigin(parsed.url!);
    updates.set(id, { url: officialUrl, verifiedUrl: entry.verifiedUrl });
    console.log(`${id}: ${parsed.url} -> ${entry.url}`);
  }

  if (updates.size === 0) {
    console.log("No entries updated.");
    return;
  }

  const csvText = fs.readFileSync(csvPath, "utf8");
  const csvRows = parseCsv(csvText.trimEnd());
  const headers = csvRows[0] ?? [];
  const rows = parseCsvRecords(csvText);
  for (const row of rows) {
    const id = row.slug.split("/").pop() ?? row.slug;
    const patch = updates.get(id);
    if (!patch) {
      continue;
    }
    row.url = patch.url;
    row.verifiedUrl = patch.verifiedUrl;
  }

  fs.writeFileSync(csvPath, serializeCsvRecords(headers, rows), "utf8");
  console.log(`Updated ${updates.size} entries in JSON and CSV.`);
}

main();
