# SIMS-Blog-Manager 5.10.0-RC8.11 — Site Diagnosis Intake Dialog Hotfix

## Purpose

RC8.10 used `SpreadsheetApp.getUi().prompt()` to receive long Doctor JSON. During the user input wait, the Apps Script execution remained paused and could reach the maximum startup/execution time.

RC8.11 replaces that input path with an HTML modal. The user can take any amount of time to paste JSON. Apps Script starts only when **診断結果を登録** is clicked.

## Apps Script change

- Replace: `Code.gs`
- Add: none
- Unchanged: all other Apps Script files

## Preserved behavior

- SiteID / ArticleID / URL validation
- `site_diagnosis_batch_id` / `site_diagnosis_case_id` / `case_id` storage
- `Doctor_Cases` traceability
- Writer referral generation
- Existing SBM → Doctor workflow

## Regression guard

The intake menu now only opens the HTML modal. JSON registration is executed by `sbmDoctorSubmitSiteDiagnosisResult(rawText)` through `google.script.run`.
