import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entrySchema } from "../apps/website/src/data/schema.ts";
import { categoriesFromCsvField } from "./category-labels.ts";
import { parseCsvRecords } from "./csv.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const csvPath = path.join(repoRoot, "docs/entries_all_20261101.csv");
const outDir = path.join(repoRoot, "apps/website/src/data/entries");

const PASSKEY_LEVELS = new Set(["allowed", "required"]);

function bareSlug(csvSlug: string): string {
  return csvSlug.split("/").pop() ?? csvSlug;
}

function buildEntry(row: Record<string, string>): Record<string, unknown> {
  const recommendation = row.recommendation;
  const base: Record<string, unknown> = {
    name: row.name,
    reading: row.reading,
    domain: row.domain,
    categories: categoriesFromCsvField(row.categories),
    verifiedOn: row.verifiedOn,
    verifiedUrl: row.verifiedUrl,
  };

  if (row.url.trim()) {
    base.url = row.url.trim();
  }
  if (row.notes.trim()) {
    base.notes = row.notes.trim();
  }

  if (recommendation === "passkey") {
    const passkey: Record<string, string> = {};
    if (PASSKEY_LEVELS.has(row.passkey_passwordless)) {
      passkey.passwordless = row.passkey_passwordless;
    }
    if (PASSKEY_LEVELS.has(row.passkey_mfa)) {
      passkey.mfa = row.passkey_mfa;
    }
    return {
      ...base,
      recommendation: "passkey",
      documentationUrl: row.documentationUrl,
      passkey,
    };
  }

  if (recommendation === "authenticator" || recommendation === "code") {
    return {
      ...base,
      recommendation,
      documentationUrl: row.documentationUrl,
    };
  }

  if (recommendation === "password-only" || recommendation === "none") {
    return {
      ...base,
      recommendation,
    };
  }

  throw new Error(`Unknown recommendation: ${recommendation} (${row.slug})`);
}

function main() {
  const text = fs.readFileSync(csvPath, "utf8");
  const records = parseCsvRecords(text);
  if (records.length !== 575) {
    console.error(`Expected 575 entries, got ${records.length}`);
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  for (const row of records) {
    const id = bareSlug(row.slug);
    const data = buildEntry(row);
    entrySchema.parse(data);
    const outPath = path.join(outDir, `${id}.json`);
    fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }

  console.log(`Wrote ${records.length} entries to ${outDir}`);
}

main();
