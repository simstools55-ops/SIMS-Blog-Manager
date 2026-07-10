# Changelog

## Product 5.0.0 ArticleDB Meta Query Budget SheetObjects Fix

- Fixed `sbmSheetObjects_ is not defined` recurrence in ArticleDB meta/query supplementation.
- Removed all remaining `sbmSheetObjects_` references from Code.gs.
- Kept ArticleDB meta/query budget behavior and 300-second safety stop.

## Product 5.0 ArticleDB Foundation Setup

- 初回セットアップに「記事DB初期構築（100件ずつ）」を追加しました。
- Search Console の `startRow` を保存し、最後の取得件数が100件未満になるまで続きから再開できます。
- URL収集完了後、記事情報を50件ずつ補完するSTEP5を追加しました。
- 記事DBに ArticleID、補完済み、補完日時、補完エラーを追加しました。
- Homeに記事URL収集・記事情報補完の進捗を表示します。
