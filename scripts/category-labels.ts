/** Japanese category labels from entries CSV → slug in categories.ts */
export const CATEGORY_LABEL_TO_SLUG: Record<string, string> = {
  銀行: "banking",
  "証券・投資": "investing",
  決済: "payments",
  保険: "insurance",
  "通信・公共料金": "utilities",
  行政: "government",
  メール: "email",
  "SNS・メッセージ": "social",
  通販: "retail",
  マーケットプレイス: "marketplace",
  ファッション: "fashion",
  "家電・PC": "electronics",
  "コスメ・美容": "beauty",
  "インテリア・暮らし": "home",
  百貨店: "department",
  "ホビー・書籍": "hobby",
  飲食: "food",
  交通: "transport",
  航空: "aviation",
  鉄道: "rail",
  バス: "bus",
  "タクシー・シェア": "mobility",
  レンタカー: "car-rental",
  自動車: "automotive",
  "宅配・物流": "logistics",
  身分証明: "identity",
  セキュリティ: "security",
  ゲーム: "gaming",
  エンタメ: "entertainment",
  "動画・配信": "streaming",
  "音楽・ラジオ": "music",
  映画館: "cinema",
  "チケット・公演": "tickets",
  フィットネス: "fitness",
  "求人・転職": "jobs",
  "教育・学習": "education",
  "健康・医療": "health",
  "旅行・予約": "travel",
  "ポイント・共通ID": "points",
  スマートホーム: "smart-home",
  クラウド: "cloud",
  クラウドストレージ: "storage",
  "仕事・チーム": "productivity",
  デザイン: "design",
  "営業・業務SaaS": "business",
  "人事・経理": "backoffice",
  "AI・翻訳": "ai",
  電子契約: "esign",
  Web会議: "meetings",
  デバイス: "device",
  開発: "developer",
  "生活・地域": "lifestyle",
  "ニュース・メディア": "media",
  公営・投票: "gambling",
  その他: "other",
};

export const CATEGORY_SLUG_TO_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_LABEL_TO_SLUG).map(([label, slug]) => [slug, label]),
);

export function categoriesFromCsvField(raw: string): string[] {
  const labels = raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const slugs: string[] = [];
  for (const label of labels) {
    const slug = CATEGORY_LABEL_TO_SLUG[label];
    if (!slug) {
      throw new Error(`Unknown category label: ${label}`);
    }
    slugs.push(slug);
  }
  if (slugs.length === 0) {
    throw new Error("categories field is empty");
  }
  return slugs;
}

export function categoriesToCsvField(slugs: string[]): string {
  return slugs
    .map((slug) => {
      const label = CATEGORY_SLUG_TO_LABEL[slug];
      if (!label) {
        throw new Error(`Unknown category slug: ${slug}`);
      }
      return label;
    })
    .join("|");
}
