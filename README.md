# SIMS-Blog-Manager Product 4.1

Google Search Consoleのデータを使い、ブログ改善の「今日やること」を管理するスプレッドシートシステムです。

## Product 4.1の修正点

- STEP2 Google Cloud APIガイドで止まる問題を修正
- `Ui.showModalDialog` 用のOAuthスコープを追加
- モーダル表示ができない場合の代替案内を追加
- 初回・更新後のGoogle再承認案内を強化

## 導入

1. `spreadsheet/` のテンプレートをGoogleスプレッドシートへアップロードします。
2. `apps-script/Code.js` をApps Scriptへ貼り付けます。
3. `apps-script/appsscript.json` も反映します。
4. メニュー「SIMS-Blog-Manager」からSTEPを順番に実行します。

## 注意

Product 4.1ではOAuthスコープを追加しています。既存の4.0から更新した場合、Googleの再承認画面が表示されることがあります。正常な動作です。
