import { describe, expect, it } from "vite-plus/test";
import { CATEGORY_GROUPS, listCategoryGroupsForDisplay } from "../src/data/category-groups.ts";
import { CATEGORY_SLUGS } from "../src/data/categories.ts";

describe("CATEGORY_GROUPS", () => {
  it("includes every category slug exactly once", () => {
    const slugs = CATEGORY_GROUPS.flatMap((g) => [...g.slugs]);
    expect(slugs.length).toBe(CATEGORY_SLUGS.length);
    expect(new Set(slugs)).toEqual(new Set(CATEGORY_SLUGS));
  });
});

describe("listCategoryGroupsForDisplay", () => {
  it("omits empty categories and empty groups", () => {
    const counts = Object.fromEntries(CATEGORY_SLUGS.map((slug) => [slug, 0])) as Record<
      (typeof CATEGORY_SLUGS)[number],
      number
    >;
    counts.banking = 2;
    counts.streaming = 1;

    const groups = listCategoryGroupsForDisplay(counts);
    expect(groups.some((g) => g.label === "お金・保険")).toBe(true);
    expect(groups.some((g) => g.label === "エンタメ")).toBe(true);
    expect(groups.every((g) => g.items.length > 0)).toBe(true);
    expect(
      groups
        .flatMap((g) => g.items)
        .map((i) => i.slug)
        .sort(),
    ).toEqual(["banking", "streaming"]);
  });
});
