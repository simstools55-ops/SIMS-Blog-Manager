# SIMS-Blog-Manager Product 4.0

Google Search Console のデータを使い、ブログ改善で「今日やること」を決めるためのGoogleスプレッドシート製品です。

Product 4.0 は、SIMS-Coreで実地確認済みだった Search Console 接続方式をベースに、Claude連携・AI Exchange・Knowledge系を外した Slim Edition です。

## 内容

- `spreadsheet/SIMS-Blog-Manager-template-Product4.0.xlsx`
- `apps-script/Code.js`
- `apps-script/appsscript.json`
- `docs/`
- `product/`

## 初回の流れ

1. スプレッドシートをGoogleスプレッドシートにインポート
2. Apps Scriptに `Code.js` を貼り付け
3. `appsscript.json` を上書き
4. メニュー `SIMS-Blog-Manager` から STEP1〜STEP4 を実行

## 初回認証について

初めてApps Scriptを実行すると、Googleの承認画面が表示されます。これは正常です。
承認後に処理が止まった場合は、同じSTEPをもう一度実行してください。

## Product 4.0の重要な変更

- 連続ウィザードを廃止
- Home上のチェックリスト型セットアップへ変更
- 外部URLを開いた後は処理をそこで止める
- Search Console接続テスト成功まで日次取得をブロック
- `Session.getActiveUser()` を使わないログ記録へ変更
