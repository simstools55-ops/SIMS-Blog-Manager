# CHANGELOG

## Product 5.0.0 Search Console Auth / Daily Fetch Stability Fix

- Search Console取得時の `UrlFetchApp.fetch` 権限不足エラーを利用者向けメッセージに変換。
- 日次処理をSearch Console取得だけに限定し、Home更新を開始・完了の2回に削減。
- `apps-script/appsscript.json` に必要スコープを明記。

