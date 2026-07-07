# セットアップガイド

## 1. スプレッドシートを作る

`spreadsheet/SIMS-Blog-Manager-template-Product2.0.xlsx` をGoogleスプレッドシートへインポートします。

## 2. Apps Scriptを貼り付ける

拡張機能 → Apps Script を開き、`apps-script/Code.js` の全文を `コード.gs` に貼り付けます。

## 3. appsscript.jsonを設定する

Apps Scriptのプロジェクト設定で「appsscript.json マニフェスト ファイルをエディタで表示」をONにします。
`apps-script/appsscript.json` の内容を貼り付けます。

## 4. セットアップウィザード

スプレッドシートに戻り、メニュー「SIMS-Blog-Manager」→「セットアップウィザード開始」を実行します。


## Product 2.1 追加手順

初回はメニュー **SIMS-Blog-Manager → セットアップウィザード開始** を実行してください。
ブログ名とSearch Console Propertyはポップアップ入力で登録できます。
接続テストがOKになるまで、1日1回のSearch Console取得は実行されません。
