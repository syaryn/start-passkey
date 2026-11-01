import { z } from "astro/zod";
import { CATEGORY_SLUGS } from "./categories.ts";

const passkeyLevel = z.enum(["allowed", "required"]);

const categorySlug = z.enum(CATEGORY_SLUGS);

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 形式で入力してください");

const delegatedServiceSchema = z.object({
  name: z.string().min(1),
  reading: z.string().regex(/^[ぁ-んー]+$/),
  sourceUrl: z.string().url(),
  sourceNote: z.string().min(1),
});

const entryBase = {
  name: z.string().min(1),
  reading: z.string().min(1),
  domain: z.string().min(1),
  url: z.string().url().optional(),
  categories: z.array(categorySlug).min(1),
  verifiedOn: isoDate,
  verifiedUrl: z.string().url(),
  notes: z.string().optional(),
  delegatedServices: z.array(delegatedServiceSchema).default([]),
};

const passkeyPasskeyObject = z
  .object({
    passwordless: passkeyLevel.optional(),
    mfa: passkeyLevel.optional(),
  })
  .refine(
    (pk) => {
      const hasPasswordless = pk.passwordless === "allowed" || pk.passwordless === "required";
      const hasMfa = pk.mfa === "allowed" || pk.mfa === "required";
      return hasPasswordless || hasMfa;
    },
    {
      message:
        "passkey では passwordless または mfa の少なくとも一方を allowed または required にしてください",
      path: ["passkey"],
    },
  );

export const entrySchema = z.discriminatedUnion("recommendation", [
  z.object({
    ...entryBase,
    recommendation: z.literal("passkey"),
    documentationUrl: z.string().url(),
    passkey: passkeyPasskeyObject,
  }),
  z.object({
    ...entryBase,
    recommendation: z.literal("authenticator"),
    documentationUrl: z.string().url(),
  }),
  z.object({
    ...entryBase,
    recommendation: z.literal("code"),
    documentationUrl: z.string().url(),
  }),
  z.object({
    ...entryBase,
    recommendation: z.literal("password-only"),
  }),
  z.object({
    ...entryBase,
    recommendation: z.literal("none"),
  }),
]);

export type Entry = z.infer<typeof entrySchema>;

export type Recommendation = Entry["recommendation"];
