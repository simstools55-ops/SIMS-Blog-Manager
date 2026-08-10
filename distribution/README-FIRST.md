# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT5

既存スプレッドシートを継続利用できます。

## 重要：distribution更新方法

旧版の日本語ファイル名や文字化けファイルを残さないため、**既存の `distribution` フォルダーへ上書きコピーしないでください。**
GitHub／ローカル更新時は、既存の `distribution` フォルダーを一度削除し、このZIPの `distribution` フォルダーで丸ごと置換してください。

1. `Code.gs`でApps Scriptを全置換します。
2. `appsscript.json`を必要に応じて更新します。
3. スプレッドシートを再読み込みします。
4. 「SIMS-Blog-Manager → シートの作成・修復」を1回実行します。

Platform用システムシートは非表示で追加されます。既存データは削除しません。

## Health check QA note (UAT7)
During a blog health check, do not run daily processing or another heavy SBM operation in another blog at the same time. Google Spreadsheet service load is shared outside this individual spreadsheet and cannot be locked across separate SBM copies. The same SBM file blocks health check and daily processing from running together.
