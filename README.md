# SIMS-Blog-Manager Product 5.0.0 STEP A / STEP B Detailed Profiler Dev

この版は、STEP AとSTEP Bのタイムアウト原因を特定するための開発用計測版です。

## 製品本体

- `apps-script/Code.gs`
- `apps-script/appsscript.json`
- `spreadsheet/SIMS-Blog-Manager.xlsx`（同梱されている場合）

## 確認方法

1. `Code.gs` をApps Scriptへ貼り替える
2. 必要に応じて `appsscript.json` を確認する
3. スプレッドシートを再読み込みする
4. 管理メニューから「シートを作成・修復」を実行する
5. STEP Aを実行する
6. 「処理プロファイル」シートで工程別の所要時間を確認する
7. STEP Bを実行し、同じく「処理プロファイル」を確認する

## 注意

この版は開発用です。処理プロファイルは正式版では非表示または開発者向け扱いにします。
