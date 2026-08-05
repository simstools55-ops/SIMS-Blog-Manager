# Product 5.6.7 Writer Contract v4.2 Compatibility

## Purpose

SIMS Writer v2.2.0 / Contract v4.2 の `publication_result` を改善結果登録で受信する。

## Mapping order

1. `publication_result.public_ok_changes`
2. 旧 `changes`（後方互換）
3. どちらもない場合のみエラー

## Saved fields

- 公開OK変更JSON
- 利用者判断変更JSON
- 変更サマリーJSON
- AI改善結果JSON（原文全体）

`change_summary` は文字列・オブジェクトの両方を許容する。

## Compatibility

旧 `changes: {}` と `changes: []` は継続して登録可能。未知フィールドも許容する。
