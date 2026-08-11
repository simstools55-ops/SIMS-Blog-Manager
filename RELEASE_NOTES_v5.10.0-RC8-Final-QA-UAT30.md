# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT30

## Purpose
UAT29で保存済みの健康診断工程時間を、健康診断を再実行せず可視化する。

## New temporary menu
SIMS Doctor → 健康診断の工程時間を確認

## Shows
- HealthCheckID
- 各工程の所要時間
- 工程内訳
- 最長工程
- 記録工程の合計
- 記録時刻

## Safety
- 健康診断を再実行しない
- Search Console APIへアクセスしない
- 健康診断データを書き換えない
- UAT29のDocumentPropertiesを読み出すだけ

## Objective
Apps Script実行履歴で208.579秒かかった処理がどの工程だったかを特定する。
