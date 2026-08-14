SIMS Blog Manager 5.10.0-RC8.17 - Merge to Writer Bridge

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc817_merge_to_writer_bridge_test.js

NO CHANGE
- appsscript.json
- Shared Merge contracts / knowledge
- Spreadsheet templates
- Site Diagnosis HF4/HF5

APPS SCRIPT INSTALL
Replace only Code.gs with apps-script/Code.gs.

RC8.17
1. After a successful SIMS_MERGE_TREATMENT_RESULT_V1, SBM detects Writer-owned publication steps/preserved sections.
2. SBM generates SIMS_WRITER_TREATMENT_REQUEST_V1 with request_mode=MERGE_REFERRAL_TREATMENT.
3. Writer completion stops at "301等の利用者処置待ち"; it does not enter monitoring before redirect/noindex/delete decisions.
4. Article work-state lookup now batch-reads ArticleID/URL columns instead of per-row Spreadsheet calls, reducing Site Diagnosis batch registration latency.
