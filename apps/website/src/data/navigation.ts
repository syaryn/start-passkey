import { listAllCategoryNavItems } from "./category-groups.ts";

export const SITE_LAST_UPDATED = "2026-11-03";

export const GUIDE_LINKS = [
  { href: "/guide/passkey/", label: "パスキーとは" },
  { href: "/guide/passkey/setup/", label: "パスキーの一般的な設定手順" },
  { href: "/guide/two-step-auth/", label: "二段階認証・二要素認証とは" },
  { href: "/guide/priority/", label: "どれから設定するか" },
  { href: "/guide/how-to-use/", label: "このサイトの使い方" },
  { href: "/guide/authenticator/", label: "認証アプリで強化する" },
  { href: "/guide/sms-email/", label: "SMS・メールコードの注意" },
  { href: "/guide/password-only/", label: "未対応・パスワードのみのとき" },
  { href: "/guide/password-basics/", label: "パスワードの作り方と管理" },
  { href: "/guide/troubleshooting/", label: "困ったとき" },
  { href: "/guide/status/", label: "掲載データで見る対応状況" },
  { href: "/guide/glossary/", label: "用語集" },
] as const;

export const POLICY_LINKS = [
  { href: "/policy/criteria/", label: "掲載基準・更新方針" },
  { href: "/policy/disclaimer/", label: "免責・プライバシー" },
] as const;

export const UTILITY_LINKS = [
  { href: "/faq/", label: "よくある質問" },
  { href: "/updates/", label: "更新履歴" },
  { href: "/contact/", label: "掲載修正・連絡" },
  { href: "/sitemap/", label: "サイトマップ" },
] as const;

export const CATEGORY_LINKS = listAllCategoryNavItems().map(({ href, label }) => ({
  href,
  label,
}));
