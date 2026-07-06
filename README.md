# SIMS-Blog-Manager Product 2.0

SIMS-Blog-Managerは、SIMS-Core v1.1をベースにしたブログ改善管理専用のGoogleスプレッドシート製品です。

## Product 2.0 の方針

- SIMS-Coreで動作確認済みのSearch Console接続・セットアップUXを継承
- Claude連携、AI Exchange、Knowledge Engine、Learning Engineは除外
- 利用者向けには単体 `apps-script/Code.js` を提供
- 開発者向けには `apps-script/source/` に分割ソースを保持
- GitHub Pages用ドキュメントを `docs/` に同梱

## 配布物

```text
apps-script/
  Code.js                 利用者貼り付け用の単体Apps Script
  appsscript.json          OAuthスコープ設定
  source/                  開発・保守用の分割ソース
spreadsheet/
  SIMS-Blog-Manager-template-Product2.0.xlsx
docs/                      マニュアルサイト用Markdown
product/                   製品仕様・変更履歴
tests/                     UATチェックリスト
```

## 最初に行うこと

1. `spreadsheet/SIMS-Blog-Manager-template-Product2.0.xlsx` をGoogleスプレッドシートにインポート
2. Apps Scriptを開く
3. `apps-script/Code.js` をコード.gsへ貼り付け
4. `apps-script/appsscript.json` をApps Scriptのマニフェストへ貼り付け
5. メニュー「SIMS-Blog-Manager」→「セットアップウィザード開始」

詳細は `docs/getting-started.md` を参照してください。
