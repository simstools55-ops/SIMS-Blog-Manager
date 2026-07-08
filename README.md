# SIMS-Blog-Manager Product 5.0.0

## 製品本体

- spreadsheet/SIMS-Blog-Manager.xlsx
- apps-script/Code.gs

## 今回の重点

Search Consoleデータ取得を軽量化しました。日次処理ではデータ取得だけを行い、シート修復・全体初期化・列幅自動調整などの重い処理は実行しません。

処理ログには、API取得・シート書込・設定更新の時間内訳が残ります。


## Product 5.0.0 Daily Fetch Fast Path

日次処理はSearch Consoleデータ取得のみに固定しています。軽快運用のため、日次取得上限は `Settings` の `DailyFetchMaxRows` で管理します。標準値は1500件です。
