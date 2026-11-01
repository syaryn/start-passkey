import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entrySchema } from "../apps/website/src/data/schema.ts";
import { parseCsvRecords } from "./csv.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const csvPath = path.join(repoRoot, "docs/delegations_20261101.csv");
const entriesDir = path.join(repoRoot, "apps/website/src/data/entries");

const EXPECTED_BASE_COUNT = 51;
const EXPECTED_DELEGATION_COUNT = 96;

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

type DelegatedRow = {
  name: string;
  reading: string;
  sourceUrl: string;
  sourceNote: string;
};

function main() {
  const text = fs.readFileSync(csvPath, "utf8");
  const records = parseCsvRecords(text);
  const errors: string[] = [];
  const byBase = new Map<string, DelegatedRow[]>();

  for (const row of records) {
    const baseSlug = row.base_slug.trim();
    const delegatedName = row.delegated_service.trim();
    const sourceUrl = row.source_url.trim();
    const sourceNote = row.source_note.trim();

    if (!sourceUrl || !isHttpUrl(sourceUrl)) {
      errors.push(`Invalid source_url for ${delegatedName} → ${baseSlug}`);
    }
    if (!sourceNote) {
      errors.push(`Missing source_note for ${delegatedName} → ${baseSlug}`);
    }

    const entryPath = path.join(entriesDir, `${baseSlug}.json`);
    if (!fs.existsSync(entryPath)) {
      errors.push(`Missing entry JSON for base_slug: ${baseSlug}`);
    } else {
      const entry = JSON.parse(fs.readFileSync(entryPath, "utf8")) as {
        recommendation?: string;
      };
      if (entry.recommendation !== row.base_recommendation.trim()) {
        errors.push(
          `Recommendation mismatch for ${baseSlug}: CSV=${row.base_recommendation}, JSON=${entry.recommendation}`,
        );
      }
    }

    const list = byBase.get(baseSlug) ?? [];
    if (list.some((d) => d.name === delegatedName)) {
      errors.push(`Duplicate delegated_service "${delegatedName}" on base ${baseSlug}`);
    }
    list.push({
      name: delegatedName,
      reading: row.reading.trim(),
      sourceUrl,
      sourceNote,
    });
    byBase.set(baseSlug, list);
  }

  if (byBase.size !== EXPECTED_BASE_COUNT) {
    errors.push(`Expected ${EXPECTED_BASE_COUNT} bases, got ${byBase.size}`);
  }
  if (records.length !== EXPECTED_DELEGATION_COUNT) {
    errors.push(`Expected ${EXPECTED_DELEGATION_COUNT} delegations, got ${records.length}`);
  }

  if (errors.length > 0) {
    for (const e of errors) {
      console.error(e);
    }
    process.exit(1);
  }

  for (const [baseSlug, delegatedServices] of byBase) {
    const entryPath = path.join(entriesDir, `${baseSlug}.json`);
    const entry = JSON.parse(fs.readFileSync(entryPath, "utf8")) as Record<string, unknown>;
    delete entry.aliases;
    entry.delegatedServices = delegatedServices;
    entrySchema.parse(entry);
    fs.writeFileSync(entryPath, `${JSON.stringify(entry, null, 2)}\n`, "utf8");
  }

  console.log(
    `Updated ${byBase.size} bases with ${records.length} delegated services in ${entriesDir}`,
  );
}

main();
