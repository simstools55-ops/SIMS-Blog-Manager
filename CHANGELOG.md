# Changelog

## Product 5.0.0 Daily Fetch Fast Path

- 日次処理をSearch Console取得だけに固定しました。
- 日次取得時のHome更新を開始・完了の2回だけに削減しました。
- 日次取得専用の取得上限 `DailyFetchMaxRows` を追加し、標準1500件にしました。
- 処理ログにAPI取得秒数・シート書込秒数・取得上限を記録するようにしました。
