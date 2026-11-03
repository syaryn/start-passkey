# アーキテクチャ概要

このドキュメントはコードベースの全体像をすばやく把握するための設計メモです。コードベースの変化に合わせて更新します。

## 1. プロジェクト構成

```text
start-passkey/
├── apps/
│   └── website/            # Astro 製の静的サイト本体
│       ├── src/
│       │   ├── pages/      # ページ（トップ、カテゴリ・詳細、ガイド、ポリシー、FAQ ほか）
│       │   ├── layouts/    # 共通レイアウト（BaseLayout、GuideShell）
│       │   ├── components/ # 共通部品（ヘッダー、フッター、カテゴリ表、図ほか）
│       │   ├── data/       # 掲載データと定義
│       │   │   ├── entries/  # 1 サービス 1 JSON（575 件）
│       │   │   ├── schema.ts # 掲載データの Zod スキーマ
│       │   │   ├── categories.ts # 16 カテゴリの定義
│       │   │   └── faq.ts    # FAQ データ
│       │   ├── lib/        # 検索用インデックス、表示ラベルなどのロジック
│       │   └── styles/     # DADS 系の共通 CSS
│       ├── public/         # そのまま配信する静的ファイル（図の SVG、OGP 画像、favicon、robots.txt）
│       ├── diagrams/       # 図のソース（D2）
│       ├── og/             # OGP 画像のソース SVG
│       ├── astro.config.mts
│       └── wrangler.jsonc  # Cloudflare Workers の配信設定
├── packages/
│   └── utils/              # 共用ユーティリティ（src と tests）
├── scripts/                # CSV からの取り込み・整形スクリプト
├── docs/                   # 取り込み元 CSV（全件一覧、委譲一覧）
├── .agents/skills/         # 執筆支援スキル（yomiyasu）
├── AGENTS.md               # Vite+ の利用規約メモ
└── README.md
```

## 2. 全体構成図

バックエンドとデータベースは持たず、ビルド時に全ページを静的 HTML 化して配信します。

```text
[訪問者] <--> [Cloudflare Workers（静的アセット配信）]
                     ^
                     | wrangler deploy（dist をアップロード）
              [Astro ビルド]
                     ^
        +------------+-------------+
        |                          |
 [掲載データ JSON]           [ガイド等の原稿]
 （entries、スキーマ検証）    （.astro / データ）

（データ保守の流れ）
[docs の CSV] --scripts の取り込み--> [entries JSON] --git--> [リポジトリ]
```

## 3. 主要コンポーネント

### 3.1. フロントエンド（Web サイト「そしてパスキーへ」）

名称: apps/website

説明: サービスごとのパスキー・二段階認証の対応状況を、カテゴリ表と詳細ページで提示する静的サイトです。検索はビルド時に生成したインデックスをブラウザ側で引くため、サーバー処理はありません。あわせて認証まわりの解説ガイドと FAQ を掲載します。

技術: Astro 7（静的出力）、TypeScript、UnoCSS、Lucide アイコン、DADS（デジタル庁デザインシステム）系の CSS

配信: Cloudflare Workers の静的アセット（Worker 名 pkmfa）

### 3.2. バックエンドサービス

なし。ユーザー登録やログイン、問い合わせ受け付けをサイト内では行いません。問い合わせは外部の Google フォームと GitHub Issue に誘導します。

### 3.3. データ取り込みツール（scripts）

名称: scripts 配下の TypeScript スクリプト群

説明: 掲載データの保守用です。`docs/entries_all_20261101.csv` から全件を取り込む `import-entries.ts`、委譲一覧 CSV から各 JSON の `delegatedServices` を反映する `import-delegations.ts`、公式 URL の正規化やカテゴリ再編の補助スクリプトがあります。本番環境では動作せず、実行結果は JSON の差分として git で管理します。

技術: TypeScript（Vite+ の `vpx` で実行）

## 4. データストア

### 4.1. 掲載データ（ファイル）

名称: entries JSON

種類: JSON ファイル群（git リポジトリ内）

用途: サービスごとの対応状況、確認日、参考 URL、備考、委譲先を保持します。データベースは使わず、ビルド時に Astro のコンテンツコレクションと Zod スキーマで検証して取り込みます。

主な項目: slug、名称と読み、カテゴリ、公式サイト URL、区分（recommendation）、確認日（verifiedOn）、参考 URL（verifiedUrl）、備考（notes）、委譲先（delegatedServices）

### 4.2. 取り込み元 CSV

名称: docs 配下の CSV

種類: CSV ファイル

用途: 全件一覧（entries_all_20261101.csv）と委譲一覧（delegations_20261101.csv）です。特に委譲は CSV が正であり、スクリプトで JSON へ反映します。

## 5. 外部連携

Cloudflare Workers: 静的アセットの配信先です。デプロイは wrangler で行います。

GitHub: ソースコードの保管場所です。問い合わせ導線として Issue も使います（リポジトリはサイト公開と同時にパブリック化予定）。

Google フォーム: 問い合わせの受け付けに使います。

各サービスの公式サイト: 掲載の根拠として参照し、詳細ページから参考 URL と公式トップへリンクします。API 連携はありません。

## 6. デプロイと基盤

クラウド: Cloudflare

利用サービス: Workers（静的アセット配信）。Worker スクリプトは置かず、アセットのみを配信します

CI/CD: 導入していません。ローカルで `pnpm --filter website build` と `pnpm --filter website deploy` を実行します

監視とログ: 専用の仕組みは導入していません

## 7. セキュリティの考え方

認証: サイト側に利用者のアカウント機能はありません

個人情報: サイト運営者はアクセス解析や Cookie を使わず、個人情報を収集しません（配信とセキュリティのために Cloudflare が通信を処理する点は、サイトの免責・プライバシーのページに明記しています）

通信: Cloudflare により HTTPS で配信します

コンテンツの完全性: 掲載は公式情報の確認を前提とし、データはスキーマ検証を通ったものだけがビルドに載ります

## 8. 開発とテストの環境

ローカル構築: リポジトリ直下で `vp install` のあと `vp run dev`（手順は README.md）

テスト: Vite+（Vitest）。掲載スキーマのテストと packages/utils のテストがあります

品質ツール: `vp check`（整形、lint、型チェック）と `astro check`

## 9. 今後の検討事項

- ドメイン確定後に `astro.config.mts` の `site` と robots.txt のサイトマップ URL を実ドメインへ差し替える（現状は example.com のプレースホルダー）
- リポジトリのパブリック化（サイト公開と同時）
- two-step-auth の図は手書き SVG が正であり、`.d2` ソースへの反映が未了。再生成前に反映する
- 掲載内容の再確認の方針（確認日が古いものの扱い）は未定

## 10. プロジェクト情報

プロジェクト名: そしてパスキーへ（start-passkey、Worker 名 pkmfa）

リポジトリ: https://github.com/syaryn/start-passkey

連絡先: サイトの連絡ページ（Google フォーム / GitHub Issue）

最終更新日: 2026-11-03

## 11. 用語集

パスキー: 端末やクラウドに保管する鍵でサインインする仕組み。パスワードレスと追加確認の両方の使い方があり、このサイトでは用途ごとに分けて数えます

区分（recommendation）: 「いま切り替えるなら」の値。passkey、authenticator、code、password-only、none の 5 種類です

委譲（delegatedServices）: 別の ID でログインするサービスの扱いです。単独の掲載は作らず、元の ID のページに委譲先として記録します

確認日（verifiedOn）: 掲載内容を公式情報で確認した日付です

参考 URL（verifiedUrl）: 確認に使った公式ページの URL です。サービス名のリンク先である公式トップとは分けて記録します

vp: Vite+ の CLI です。整形、lint、テスト、ビルドをまとめて扱います

D2: 図をテキストで記述する言語です。`apps/website/diagrams` のソースから SVG を生成します
