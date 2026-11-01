import type { CategorySlug } from "../apps/website/src/data/categories.ts";

const TO_CATEGORY: Record<string, CategorySlug> = {};

function add(category: CategorySlug, ids: string[]) {
  for (const id of ids) {
    TO_CATEGORY[id] = category;
  }
}

add("developer", [
  "cloudflare",
  "digitalocean",
  "heroku",
  "squarespace",
  "vercel",
  "wix",
  "wordpress-com",
]);

add("storage", ["box", "dropbox", "evernote"]);

add("productivity", [
  "airtable",
  "asana",
  "basecamp",
  "calendly",
  "clickup",
  "garoon",
  "monday",
  "miro",
  "notion",
  "smartsheet",
  "todoist",
  "trello",
  "typeform",
]);

add("design", ["adobe", "canva", "figma"]);

add("business", [
  "andpad",
  "hubspot",
  "infomart",
  "salesforce",
  "sansan",
  "sap",
  "servicenow",
  "utage",
  "zendesk",
  "zoho",
]);

add("backoffice", [
  "freee",
  "jobcan",
  "kanamic",
  "king-of-time",
  "moneyforward-cloud",
  "mykomon",
  "office-station",
  "smarthr",
  "smaregi",
  "goqsystem",
]);

add("education", ["classi", "comiru", "loilo-note", "manabi-pocket", "study-sapuri"]);

add("health", ["clius", "movacal"]);

add("ai", ["chatgpt", "deepl", "grammarly"]);

add("esign", ["cloudsign", "docusign", "dropbox-sign"]);

add("logistics", ["logiless"]);

add("meetings", ["zoom"]);

add("device", ["apple-account", "samsung-account"]);

add("utilities", ["mozilla"]);

export function categoriesForCloudEntry(entryId: string): CategorySlug[] | null {
  const mapped = TO_CATEGORY[entryId];
  if (mapped) {
    return [mapped];
  }
  return null;
}

export { TO_CATEGORY as CLOUD_RECATEGORY_MAP };
