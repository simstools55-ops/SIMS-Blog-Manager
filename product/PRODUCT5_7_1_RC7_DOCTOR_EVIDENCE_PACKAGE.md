# Product 5.7.1 RC7 — Doctor Evidence Package

## 目的

個別診断では、SBMが対象記事について保持・取得できる証拠をまとめ、Claude版SIMS Doctorへ一度に渡します。

## Contract

- `SIMS_DOCTOR_SINGLE_CASE_REQUEST_V2`
- `contract_version: 2.0`
- `evidence_package.package_format: SIMS_DOCTOR_EVIDENCE_PACKAGE_V1`

## 標準添付

- URLから取得した記事本文
- Search Console 180日の日別推移
- 前半90日・後半90日・直近28日・その前28日の集計
- 上位200クエリの180日・前半90日・後半90日・直近28日・その前28日比較
- 最新のブログ健康診断結果
- 改善・モニタリング履歴
- 過去のDoctor診断履歴
- 内部リンク候補
- Evidence Index（証拠の有無）

## 比較期間保護

改善後28日未満の場合は、直近28日に改善前データが混在する可能性を明示し、正式な改善前後判定を保留するようDoctorへ指示します。

## 負荷

本処理は個別診断の依頼生成時だけ動きます。日次処理やブログ全体健康診断には追加しません。
