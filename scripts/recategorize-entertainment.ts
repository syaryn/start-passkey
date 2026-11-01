import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { entrySchema } from "../apps/website/src/data/schema.ts";
import { categoriesToCsvField } from "./category-labels.ts";
import { parseCsv, parseCsvRecords } from "./csv.ts";
import { categoriesForEntertainmentEntry } from "./recategorize-entertainment-map.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const entriesDir = path.join(repoRoot, "apps/website/src/data/entries");
const csvPath = path.join(repoRoot, "docs/entries_all_20261101.csv");

function bareSlug(csvSlug: string): string {
  return csvSlug.split("/").pop() ?? csvSlug;
}

function main() {
  let jsonUpdated = 0;
  const unmapped: string[] = [];

  for (const file of fs.readdirSync(entriesDir).filter((f) => f.endsWith(".json"))) {
    const entryId = file.replace(/\.json$/, "");
    const filePath = path.join(entriesDir, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    const categories = raw.categories as string[] | undefined;
    if (categories?.[0] !== "entertainment") {
      continue;
    }

    const next = categoriesForEntertainmentEntry(entryId);
    if (!next) {
      unmapped.push(entryId);
      continue;
    }

    raw.categories = next;
    const parsed = entrySchema.parse(raw);
    fs.writeFileSync(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    jsonUpdated += 1;
  }

  if (unmapped.length > 0) {
    console.error("Unmapped entertainment-primary entries:", unmapped.join(", "));
    process.exit(1);
  }

  const text = fs.readFileSync(csvPath, "utf8");
  const records = parseCsvRecords(text);
  const headers = parseCsv(text.trimEnd())[0];
  let csvUpdated = 0;

  for (const row of records) {
    const id = bareSlug(row.slug);
    const next = categoriesForEntertainmentEntry(id);
    if (!next) {
      continue;
    }
    row.categories = categoriesToCsvField(next);
    csvUpdated += 1;
  }

  const lines = [headers.join(",")];
  for (const row of records) {
    lines.push(
      headers
        .map((header) => {
          const value = row[header] ?? "";
          if (/[",\n\r]/.test(value)) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    );
  }
  fs.writeFileSync(csvPath, `${lines.join("\n")}\n`, "utf8");

  console.log(`Updated ${jsonUpdated} entry JSON files and ${csvUpdated} CSV rows.`);
}

main();
