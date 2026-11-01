import { describe, expect, it } from "vite-plus/test";
import {
  countEntriesByCategory,
  formatRecommendationShare,
  summarizeEntries,
} from "../src/data/display.ts";
import { entrySchema } from "../src/data/schema.ts";

const base = {
  name: "テスト",
  reading: "てすと",
  domain: "example.com",
  categories: ["other"] as const,
  verifiedOn: "2026-01-15",
  verifiedUrl: "https://example.com/help",
};

describe("summarizeEntries", () => {
  it("counts total and each recommendation", () => {
    const entries = [
      entrySchema.parse({
        ...base,
        recommendation: "passkey",
        documentationUrl: "https://example.com/pk",
        passkey: { passwordless: "allowed" },
      }),
      entrySchema.parse({
        ...base,
        recommendation: "password-only",
      }),
      entrySchema.parse({
        ...base,
        recommendation: "none",
      }),
    ];

    expect(summarizeEntries(entries)).toEqual({
      total: 3,
      byRecommendation: {
        passkey: 1,
        authenticator: 0,
        code: 0,
        "password-only": 1,
        none: 1,
      },
    });
  });

  it("formats recommendation share as percent with one decimal", () => {
    expect(formatRecommendationShare(151, 684)).toBe("22.1%");
    expect(formatRecommendationShare(0, 684)).toBe("0.0%");
    expect(formatRecommendationShare(0, 0)).toBe("0.0%");
  });
});

describe("countEntriesByCategory", () => {
  it("counts entries per category slug (multi-category entries count in each)", () => {
    const entries = [
      entrySchema.parse({
        ...base,
        categories: ["banking", "payments"],
        recommendation: "password-only",
      }),
      entrySchema.parse({
        ...base,
        categories: ["other"],
        recommendation: "passkey",
        documentationUrl: "https://example.com/pk",
        passkey: { passwordless: "allowed" },
      }),
    ];

    expect(countEntriesByCategory(entries)).toMatchObject({
      banking: 1,
      payments: 1,
      other: 1,
    });
  });
});
