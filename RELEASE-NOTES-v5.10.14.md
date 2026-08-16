# SIMS-Blog-Manager v5.10.14

## Purpose
Site Diagnosis v0.7.3がCreator新記事案件で明示する「新規記事対象」と「既存関連記事（参照専用）」の意味情報を、SBMが欠落なく保持するためのPATCHです。

## Changes
- `sbmDoctorSiteWideExpandUnits_()` が `new_article_target` / `reference_articles` / `article_identity_semantics` を単案件Doctor JSONへ継承。
- `sbmDoctorBuildCreatorReferral_()` が同3項目をCreator紹介状へ継承。
- 既存のCreator公開登録、ArticleID採番、記事DB登録、モニター開始、Writer/Merge/Monitor処理には変更なし。

## Compatibility
Site Diagnosis v0.7.3のCreator意味情報を受理できるようにした後方互換PATCHです。従来形式で3項目がない場合も既存Creator処理は従来どおり動作します。
