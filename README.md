# SIMS-Blog-Manager Product 2.2

SIMS-Blog-Managerは、SIMS-Core v1.1をベースにしたブログ改善管理専用のGoogleスプレッドシート製品です。

## Product 2.2 の方針

- SIMS-Coreで動作確認済みのSearch Console接続・セットアップUXを継承
- Claude連携、AI Exchange、Knowledge Engine、Learning Engineは除外
- 利用者向けには単体 `apps-script/Code.js` を提供
- 開発者向けには `apps-script/source/` に分割ソースを保持
- GitHub Pages用ドキュメントを `docs/` に同梱


## Product 2.2 の主な修正

- セットアップウィザードでブログ名・Search Console Propertyをポップアップ入力できます。
- Google Cloud APIガイドを開いた後、ウィザードを一度終了します。
- API有効化後はメニュー「API設定後に接続テストへ進む」から再開します。
- Search Console接続テストがOKになるまで、1日1回の自動取得は走りません。

## 配布物

```text
apps-script/
  Code.js                 利用者貼り付け用の単体Apps Script
  appsscript.json          OAuthスコープ設定
  source/                  開発・保守用の分割ソース
spreadsheet/
  SIMS-Blog-Manager-template-Product2.2.xlsx
docs/                      マニュアルサイト用Markdown
product/                   製品仕様・変更履歴
tests/                     UATチェックリスト
```

## 最初に行うこと

1. `spreadsheet/SIMS-Blog-Manager-template-Product2.2.xlsx` をGoogleスプレッドシートにインポート
2. Apps Scriptを開く
3. `apps-script/Code.js` をコード.gsへ貼り付け
4. `apps-script/appsscript.json` をApps Scriptのマニフェストへ貼り付け
5. メニュー「SIMS-Blog-Manager」→「セットアップウィザード開始」

詳細は `docs/getting-started.md` を参照してください。


## Product 2.2

- セットアップウィザードを入力式ポップアップに変更しました。
- 接続テストOK前は、1日1回のSearch Consoleデータ取得を実行しません。
- Search Console API未有効エラー時に、プロジェクト番号付きのGoogle Cloud有効化リンクを表示します。
