import { CATEGORY_SLUGS, type CategorySlug } from "./categories.ts";
import type { Entry, Recommendation } from "./schema.ts";

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  passkey: "パスキー",
  authenticator: "認証アプリ",
  code: "SMS・メール",
  "password-only": "パスワードのみ",
  none: "対象外",
};

/** Table / detail label when verifiedUrl differs from 公式ヘルプ (documentationUrl). */
export const DISTINCT_VERIFIED_SOURCE_LABEL = "参考URL";

/**
 * Returns verifiedUrl only when it should be linked in the UI.
 * Same URL as 公式ヘルプ → null (show —). password-only / none always return verifiedUrl.
 */
export function distinctVerifiedSourceUrl(entry: Entry): string | null {
  if (entry.recommendation === "password-only" || entry.recommendation === "none") {
    return entry.verifiedUrl;
  }
  if (entry.verifiedUrl === entry.documentationUrl) {
    return null;
  }
  return entry.verifiedUrl;
}

export function passkeyDetail(entry: Entry): string {
  if (entry.recommendation !== "passkey") {
    return "—";
  }
  const parts: string[] = [];
  if (entry.passkey.passwordless) {
    parts.push(`パスワードなし: ${entry.passkey.passwordless === "required" ? "必須" : "任意"}`);
  }
  if (entry.passkey.mfa) {
    parts.push(`第二要素: ${entry.passkey.mfa === "required" ? "必須" : "任意"}`);
  }
  return parts.join(" / ") || "—";
}

export function serviceUrl(entry: Entry): string {
  return entry.url ?? `https://${entry.domain}`;
}

export function recommendationBadgeClass(recommendation: Entry["recommendation"]): string {
  const base = "dads-chip-label";
  switch (recommendation) {
    case "passkey":
      return `${base} dads-chip-label-completed`;
    case "authenticator":
      return `${base} dads-chip-label-active`;
    case "code":
      return `${base} dads-chip-label-warning`;
    default:
      return base;
  }
}

export function compareByReading(a: Entry, b: Entry): number {
  return a.reading.localeCompare(b.reading, "ja");
}

export function entryPageHref(entry: Entry, entryId: string): string {
  const primary = entry.categories[0];
  return `/${primary}/${entryId}/`;
}

export type SearchHit = {
  kind: "entry" | "delegated";
  href: string;
  entryName: string;
  recommendationLabel: string;
  domain: string;
  delegatedName?: string;
  matchName: string;
  matchReading: string;
  matchDomain?: string;
};

export function toSearchHits(entry: Entry, entryId: string): SearchHit[] {
  const href = entryPageHref(entry, entryId);
  const recommendationLabel = RECOMMENDATION_LABELS[entry.recommendation];
  const hits: SearchHit[] = [
    {
      kind: "entry",
      href,
      entryName: entry.name,
      recommendationLabel,
      domain: entry.domain,
      matchName: entry.name,
      matchReading: entry.reading,
      matchDomain: entry.domain,
    },
  ];

  for (const delegated of entry.delegatedServices ?? []) {
    hits.push({
      kind: "delegated",
      href,
      entryName: entry.name,
      recommendationLabel,
      domain: entry.domain,
      delegatedName: delegated.name,
      matchName: delegated.name,
      matchReading: delegated.reading,
    });
  }

  return hits;
}

export const RECOMMENDATION_STATS_ORDER: Recommendation[] = [
  "passkey",
  "authenticator",
  "code",
  "password-only",
  "none",
];

export type EntryStats = {
  total: number;
  byRecommendation: Record<Recommendation, number>;
};

export function summarizeEntries(entries: Entry[]): EntryStats {
  const byRecommendation: Record<Recommendation, number> = {
    passkey: 0,
    authenticator: 0,
    code: 0,
    "password-only": 0,
    none: 0,
  };

  for (const entry of entries) {
    byRecommendation[entry.recommendation] += 1;
  }

  return { total: entries.length, byRecommendation };
}

/** Share of total entries as a percentage string (one decimal place). */
export function formatRecommendationShare(count: number, total: number): string {
  if (total <= 0) {
    return "0.0%";
  }
  const percent = (count / total) * 100;
  return `${percent.toFixed(1)}%`;
}

/** Category listing counts (entry included if `categories` contains the slug). */
export function countEntriesByCategory(entries: Entry[]): Record<CategorySlug, number> {
  const counts = Object.fromEntries(CATEGORY_SLUGS.map((slug) => [slug, 0])) as Record<
    CategorySlug,
    number
  >;

  for (const entry of entries) {
    for (const slug of entry.categories) {
      counts[slug] += 1;
    }
  }

  return counts;
}
