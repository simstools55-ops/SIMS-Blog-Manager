SIMS-Blog-Manager Product 5.10.0-RC8.22

Full Response Contract Extraction Hotfix

点検対象:
- Doctor Site Diagnosis結果受付
- Writer通常結果受付
- Site Diagnosis Writer結果受付
- Merge通常結果受付
- Site Diagnosis Merge結果受付

修正:
- 「回答全文を貼り付け可能」と案内する受付は、最初のJSONではなく目的のcontract/formatを検索して抽出します。
- Writer: SIMS_WRITER_TREATMENT_RESULT_V1
- Merge: SIMS_MERGE_TREATMENT_RESULT_V1
- Site Diagnosis Doctor:
  SIMS_DOCTOR_CASE_RESULT_V2 または SIMS_DOCTOR_SITE_WIDE_PRECISION_RESULT_V1
- JSON単体貼付は後方互換として引き続き受付。
- Markdownコードフェンス、説明文、別JSONが先にある回答でも目的contractを選択。

非変更:
- appsscript.json
- 通常の日次改善 SIMS_FEEDBACK_V2 登録（UIがJSON貼付を明示している既存仕様）
