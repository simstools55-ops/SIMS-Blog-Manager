# SIMS-Blog-Manager Product 5.0.0 STEP A Flow Profiler Dev

この版は、STEP Aでタイムアウトする原因を特定するための開発用確認版です。

## 製品本体

- `apps-script/Code.gs`
- `apps-script/appsscript.json`

## 使い方

1. `Code.gs` をApps Scriptへ貼り替えます。
2. 必要に応じて `appsscript.json` を反映します。
3. スプレッドシートを再読み込みします。
4. `管理` → `シートを作成・修復` を1回実行します。
5. `データ更新` → `STEP A Search Consoleデータ取得だけ実行` を実行します。
6. `データ更新` → `処理プロファイルを開く（開発用）` で工程別の所要時間を確認します。

## STEP Aで記録する工程

- 開始前チェック
- Home処理状況表示
- Search Console API取得
- SearchConsole_Data書込
- Home処理状況更新
- データ一覧反映
- 設定保存
- 処理ログ記録
- Home完了表示
