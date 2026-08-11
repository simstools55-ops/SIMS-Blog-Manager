# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT27

## Root cause
UAT26で `sbmOpenArticleDb()` は表示専用にしたが、
実際の「記事一覧を開く」メニューは `sbmOpenAllBlogArticles()` を通り、
その前に `sbmDoctorReconcileCompletedTreatments_()` を実行していた。

このDoctor保守処理はDoctor Cases全件、改善履歴全件、モニター同期、
精密診断候補削除、改善経路同期、改善の推移再計算まで含むため、
単純な一覧表示の前処理として不適切だった。

## Fix
- `sbmOpenAllBlogArticles()` からDoctor reconcileを削除。
- 記事一覧メニューを `sbmOpenArticleDb()` へ直結。
- Doctor保守関数自体は削除せず保持。
- UAT26の外部タイトル/GSC補完除去も維持。

## Expected UAT
- 427記事でも記事一覧は1〜3秒程度で表示。
- 記事管理の既存表示・データ・チェックボックスは維持。
