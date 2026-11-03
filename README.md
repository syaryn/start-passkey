# そしてパスキーへ（start-passkey）

日本の利用者になじみのあるサービスについて、パスキーと二段階認証（TOTP・確認コード）への対応状況を、公式情報で確認して一覧にする静的サイトのリポジトリです。

掲載内容は公式ヘルプや設定画面などで確認し、各サービスのページに確認日と参考 URL を付けています。推測や噂だけでは載せません。掲載の考え方はサイトの「掲載基準・数え方」（/policy/criteria/）にまとめています。

## サイトの内容

- 575 サービスを 16 カテゴリで掲載しています（2026-11-03 時点）
- 各サービスの「いま切り替えるなら」として、確認時点で利用できる最も強い設定を 1 つ表示します（パスキー／認証アプリ／SMS・メール／パスワードのみ／対象外）
- 別の ID でログインするサービスは元の ID のページに委譲先として載せ、その名前でも検索できます
- パスキーの始め方や二段階認証の解説ガイドと FAQ を併載しています

## リポジトリ構成

| パス | 内容 |
| --- | --- |
| `apps/website` | Astro 製の静的サイト本体 |
| `apps/website/src/data/entries` | 掲載データ（1 サービス 1 JSON） |
| `packages/utils` | 共用ユーティリティ |
| `scripts` | CSV からの取り込み・整形スクリプト |
| `docs` | 取り込み元 CSV（全件一覧と委譲一覧） |
| `apps/website/diagrams` | 図のソース（D2） |
| `apps/website/og` | OGP 画像のソース SVG |

## 開発環境

- Node.js 26.13.0 以上
- pnpm 12 系（Vite+ の `vp` コマンドを使います）

```bash
vp install        # 依存関係のインストール
vp run dev        # 開発サーバー（website）
vp check          # 整形・lint・型チェック
vp run -r test    # テスト
vp run ready      # チェック・テスト・ビルドをまとめて実行
```

website だけのコマンドは pnpm フィルタでも実行できます。

```bash
pnpm --filter website build     # dist へビルド
pnpm --filter website preview   # ビルド結果のプレビュー
pnpm --filter website run deploy  # Cloudflare へデプロイ
pnpm --filter website diagrams  # 図の再生成
```

## データの持ち方

- 掲載データは `apps/website/src/data/entries/*.json` に 1 サービス 1 ファイルで持ちます。スキーマは `apps/website/src/data/schema.ts`（Zod）で定義し、ビルド時に検証します
- 区分（recommendation）は passkey / authenticator / code / password-only / none の 5 種類です。数え方のルール（ログイン時に使える追加認証だけを数える、など）はサイトの掲載基準ページに公開しています
- 委譲（delegatedServices）の一覧は `docs/delegations_20261101.csv` が正で、`scripts/import-delegations.ts` で各 JSON に反映します。CSV 側を直してからスクリプトを実行し、JSON 側の委譲欄を直接編集しないでください
- 全件の取り込みは `docs/entries_all_20261101.csv` から `scripts/import-entries.ts` で行います

## 図と OGP 画像

図は D2 で書き、`apps/website/diagrams/*.d2` から `public/diagrams/*.svg` を生成します。

注意: `two-step-auth` の公開中 SVG は手書きの単一フロー版です。内容がまだ `.d2` に反映されていないため、先に `.d2` へ移すことなく `pnpm diagrams` を実行すると旧デザインに戻ります。

OGP 画像は `apps/website/og/default.svg` から書き出した `apps/website/public/og/default.png`（1200×630）を使います。

## デプロイ

Cloudflare Workers の静的アセットとして配信します（Worker 名は pkmfa、設定は `apps/website/wrangler.jsonc`）。

```bash
pnpm --filter website build
pnpm --filter website run deploy
```

サイトの絶対 URL は `apps/website/astro.config.mts` の `site` で決まります。サイトマップと canonical、OGP の URL はこの値から生成されます。

## 訂正・連絡

掲載内容の誤りに気づいた場合は、サイトの連絡ページからお知らせください。GitHub の Issue でも受け付けますが、Issue は公開されるため、パスワードや個人情報は書かないでください。
