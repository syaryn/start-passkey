/** Minimal RFC4180-style CSV parser for import scripts. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (ch === "\r") {
      i += 1;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      if (row.length > 1 || row[0] !== "") {
        rows.push(row);
      }
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

export function parseCsvRecords(text: string): Record<string, string>[] {
  const rows = parseCsv(text.trimEnd());
  if (rows.length === 0) {
    return [];
  }
  const headers = rows[0];
  return rows.slice(1).map((cells) => {
    const record: Record<string, string> = {};
    for (let j = 0; j < headers.length; j += 1) {
      record[headers[j]] = cells[j] ?? "";
    }
    return record;
  });
}
