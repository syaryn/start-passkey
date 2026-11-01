import { describe, expect, it } from "vite-plus/test";
import { entrySchema } from "../src/data/schema.ts";

const base = {
  name: "テストサービス",
  reading: "てすとさーびす",
  domain: "example.com",
  categories: ["other"] as const,
  verifiedOn: "2026-01-15",
  verifiedUrl: "https://example.com/help",
};

describe("entrySchema", () => {
  it("accepts passkey with passwordless allowed", () => {
    const parsed = entrySchema.parse({
      ...base,
      recommendation: "passkey",
      documentationUrl: "https://example.com/passkey",
      passkey: { passwordless: "allowed" },
    });
    expect(parsed.recommendation).toBe("passkey");
  });

  it("accepts passkey with mfa required", () => {
    entrySchema.parse({
      ...base,
      recommendation: "passkey",
      documentationUrl: "https://example.com/passkey",
      passkey: { mfa: "required" },
    });
  });

  it("accepts authenticator with documentation", () => {
    entrySchema.parse({
      ...base,
      recommendation: "authenticator",
      documentationUrl: "https://example.com/2fa",
    });
  });

  it("accepts password-only without documentation", () => {
    entrySchema.parse({
      ...base,
      recommendation: "password-only",
    });
  });

  it("rejects passkey when neither passwordless nor mfa is allowed or required", () => {
    expect(() =>
      entrySchema.parse({
        ...base,
        recommendation: "passkey",
        documentationUrl: "https://example.com/passkey",
        passkey: {},
      }),
    ).toThrow();
  });

  it("rejects invalid category slug", () => {
    expect(() =>
      entrySchema.parse({
        ...base,
        categories: ["not-a-category"],
        recommendation: "password-only",
      }),
    ).toThrow();
  });

  it("accepts delegatedServices with source URLs", () => {
    const parsed = entrySchema.parse({
      ...base,
      recommendation: "code",
      documentationUrl: "https://example.com/2fa",
      delegatedServices: [
        {
          name: "UQ mobile",
          reading: "ゆーきゅーもばいる",
          sourceUrl: "https://example.com/faq",
          sourceNote: "公式FAQに明記",
        },
      ],
    });
    expect(parsed.delegatedServices).toHaveLength(1);
  });

  it("defaults delegatedServices to empty array when omitted", () => {
    const parsed = entrySchema.parse({
      ...base,
      recommendation: "password-only",
    });
    expect(parsed.delegatedServices).toEqual([]);
  });

  it("rejects delegatedServices when sourceUrl is missing", () => {
    expect(() =>
      entrySchema.parse({
        ...base,
        recommendation: "code",
        documentationUrl: "https://example.com/2fa",
        delegatedServices: [
          {
            name: "UQ mobile",
            reading: "ゆーきゅーもばいる",
            sourceNote: "公式FAQに明記",
          },
        ],
      }),
    ).toThrow();
  });

  it("accepts none without documentationUrl", () => {
    entrySchema.parse({
      ...base,
      recommendation: "none",
    });
  });
});
