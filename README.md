# SIMS-Blog-Manager Product 3.1

SIMS-Blog-Manager は、Google Search Console のデータを使い、ブログ記事の改善対象を毎日判断する Google スプレッドシート製ブログ改善マネージャーです。

Product 3.1 は **SIMS-Core Slim Edition** として再構築したリリース候補です。Claude連携・AI Exchange・Knowledge Engineを除外し、Search Console接続・セットアップUX・ブログ改善管理に集中しています。

## Product 3.1 の方針

- セットアップは連続ウィザードではなく、チェックリスト形式
- 外部URLを開いたら処理を止め、利用者がシートへ戻って次のSTEPを実行
- 初期設定と接続テストが完了するまで、日次GSC取得は実行しない
- 利用者は主に「ホーム」「セットアップ」「今日の改善」だけを見る
- 製品配布用に単体 `Code.js` を同梱

## リポジトリ構成

```text
apps-script/
  Code.js
  appsscript.json
spreadsheet/
  SIMS-Blog-Manager-template-Product3.0.xlsx
docs/
  index.md
  setup/
  user-guide/
  troubleshooting/
product/
  PRODUCT_SPEC.md
  RELEASE_NOTES.md
```

## セットアップ手順

1. `spreadsheet/SIMS-Blog-Manager-template-Product3.0.xlsx` をGoogleスプレッドシートへインポート
2. 拡張機能 → Apps Script を開く
3. `apps-script/Code.js` を貼り付け
4. `appsscript.json` の内容をマニフェストへ反映
5. スプレッドシートを再読み込み
6. メニュー「SIMS-Blog-Manager」からSTEP1〜STEP4を順番に実行

## コミットメッセージ

Commit title:

```text
Release Product 3.1 (SIMS-Core Slim Edition)
```

Commit description:

```text
- Rebuild from SIMS-Core Slim Edition foundation
- Replace continuous wizard with checklist-based setup flow
- Add popup input for blog name, blog URL, and Search Console property
- Add Google Cloud API guide that stops safely after opening external URL
- Block daily GSC fetch until setup and connection test are complete
- Add product-ready spreadsheet template and single-file Code.js
```
