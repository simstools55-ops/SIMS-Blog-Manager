# SIMS-Blog-Manager Product 5.0.0

## 製品本体

- スプレッドシート: `spreadsheet/SIMS-Blog-Manager.xlsx`
- Apps Script: `apps-script/Code.gs`
- Apps Script manifest: `apps-script/appsscript.json`

## 今回の注意

Search Consoleデータ取得で `UrlFetchApp.fetch` 権限エラーが出る場合は、`Code.gs` だけでなく `appsscript.json` もApps Scriptへ反映してください。

Apps Script画面で `appsscript.json` を表示し、ZIP内の `apps-script/appsscript.json` の内容に差し替えたうえで、スクリプトを再読み込みして再承認してください。

