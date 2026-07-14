# SIMS-Blog-Manager Product 5.0 Official

Google Search Consoleのデータを使い、改善すべき記事の選定、改善作業の記録、4週間の効果測定をGoogleスプレッドシートで管理する製品です。

## 正式バージョン

`5.3.1`

## 利用者向け配布物

`distribution/` フォルダに、利用開始に必要なファイルをまとめています。

- `コード.gs`：Apps Scriptへ貼り付ける単一スクリプト
- `appsscript.json`：Apps Scriptのマニフェスト
- `SIMS-Blog-Manager-template-Product5.0-Official.xlsx`：正式版テンプレート
- `はじめにお読みください.md`：導入手順

## 初回導入

1. 正式版テンプレートをGoogleドライブへアップロードし、Googleスプレッドシートとして開きます。
2. Apps Scriptを開き、既存の「コード.gs」を配布版の内容で全置換します。
3. `appsscript.json` を設定します。
4. スプレッドシートを再読み込みします。
5. メニューから「ブログをセットアップ」を実行します。

## 既存RC3 Performanceからの更新

1. `コード.gs` を正式版で全置換して保存します。
2. スプレッドシートを再読み込みします。
3. 「バージョン情報」で `5.3.1` を確認します。

RC3 Performanceで実機テスト済みの既存スプレッドシートは、そのまま継続利用できます。正式版への移行だけを目的とする場合、「シートの作成・修復」の実行は不要です。

## 4週間効果測定

記事改善後、7日・14日・21日・28日の4回測定します。4回目の測定後に最終判定と次の改善提案を表示します。

## リポジトリ構成

- `apps-script/`：開発・管理用Apps Script
- `distribution/`：利用者向け正式配布物
- `docs/`：GitHub Pagesマニュアル原稿
- `.github/workflows/`：GitHub Pages自動デプロイ
- `product/`：製品仕様・リリース資料
- `spreadsheet/`：正式版テンプレート
- `tests/`：動作確認記録
