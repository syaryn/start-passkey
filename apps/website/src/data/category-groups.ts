import { CATEGORIES, CATEGORY_SLUGS, type CategorySlug } from "./categories.ts";

export type CategoryGroup = {
  label: string;
  slugs: readonly CategorySlug[];
};

/** Display order on top page and sitemap. Every category slug appears exactly once. */
export const CATEGORY_GROUPS: readonly CategoryGroup[] = [
  {
    label: "お金・保険",
    slugs: ["banking", "investing", "payments", "insurance"],
  },
  {
    label: "通信",
    slugs: ["utilities", "email", "social"],
  },
  {
    label: "アカウント基盤",
    slugs: ["government", "security", "identity", "points", "device"],
  },
  {
    label: "ショッピング",
    slugs: [
      "retail",
      "marketplace",
      "fashion",
      "electronics",
      "beauty",
      "home",
      "department",
      "hobby",
      "food",
    ],
  },
  {
    label: "移動・旅行",
    slugs: [
      "transport",
      "aviation",
      "rail",
      "bus",
      "mobility",
      "car-rental",
      "automotive",
      "logistics",
      "travel",
    ],
  },
  {
    label: "エンタメ",
    slugs: [
      "streaming",
      "music",
      "cinema",
      "tickets",
      "gaming",
      "entertainment",
      "gambling",
    ],
  },
  {
    label: "メディア",
    slugs: ["media"],
  },
  {
    label: "くらし",
    slugs: ["fitness", "health", "lifestyle", "smart-home"],
  },
  {
    label: "仕事",
    slugs: ["jobs", "education"],
  },
  {
    label: "クラウドサービス",
    slugs: [
      "developer",
      "cloud",
      "storage",
      "productivity",
      "design",
      "meetings",
      "ai",
      "esign",
      "business",
      "backoffice",
    ],
  },
  {
    label: "その他",
    slugs: ["other"],
  },
] as const;

const categoryBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

function assertCategoryGroupsComplete() {
  const seen = new Set<CategorySlug>();
  for (const group of CATEGORY_GROUPS) {
    for (const slug of group.slugs) {
      if (seen.has(slug)) {
        throw new Error(`Duplicate category in groups: ${slug}`);
      }
      if (!categoryBySlug.has(slug)) {
        throw new Error(`Unknown category slug in groups: ${slug}`);
      }
      seen.add(slug);
    }
  }
  for (const slug of CATEGORY_SLUGS) {
    if (!seen.has(slug)) {
      throw new Error(`Category missing from groups: ${slug}`);
    }
  }
}

assertCategoryGroupsComplete();

export type CategoryNavItem = {
  slug: CategorySlug;
  label: string;
  href: string;
  count: number;
};

export type CategoryGroupNav = {
  label: string;
  items: CategoryNavItem[];
};

/** Groups with only categories that have at least one entry (when counts provided). */
export function listCategoryGroupsForDisplay(
  counts: Record<CategorySlug, number>,
): CategoryGroupNav[] {
  const groups: CategoryGroupNav[] = [];

  for (const group of CATEGORY_GROUPS) {
    const items: CategoryNavItem[] = [];
    for (const slug of group.slugs) {
      const count = counts[slug] ?? 0;
      if (count <= 0) {
        continue;
      }
      const cat = categoryBySlug.get(slug);
      if (!cat) {
        continue;
      }
      items.push({
        slug,
        label: cat.label,
        href: `/${slug}/`,
        count,
      });
    }
    if (items.length > 0) {
      groups.push({ label: group.label, items });
    }
  }

  return groups;
}

/** Flat list for pages that need every category route (e.g. static paths unchanged). */
export function listAllCategoryNavItems(): CategoryNavItem[] {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
    label: cat.label,
    href: `/${cat.slug}/`,
    count: 0,
  }));
}
