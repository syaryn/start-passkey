export const SITE_NAME = "そしてパスキーへ";

export const HOME_TITLE = `パスキー・二段階認証の対応一覧｜${SITE_NAME}`;

export const DEFAULT_DESCRIPTION =
  "パスワードだけのログインを、対応しているサービスから設定し直すための一覧です。";

export function pageTitle(page: string): string {
  return `${page}｜${SITE_NAME}`;
}
