# 製品本体の場所

- スプレッドシート: `spreadsheet/SIMS-Blog-Manager.xlsx`
- 利用者向けApps Script: `apps-script/Code.gs`
- 権限設定: `apps-script/appsscript.json`

`Code.gs`だけを差し替えても `UrlFetchApp.fetch` 権限エラーが出る場合は、`appsscript.json`も差し替えて再承認してください。
