SIMS Blog Manager 5.10.0-RC8.20-HF3 - Merge Final Result Routing

PURPOSE
Switch the completed Merge v1.1 path from the legacy Merge -> Writer referral to:
Doctor -> SBM -> Merge -> SBM -> user article/redirect actions.

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc820_hf3_merge_final_result_routing_test.js

NO CHANGE
- appsscript.json
- Shared contracts / knowledge
- Spreadsheet templates
- Site Diagnosis product
- Writer / Creator contracts

BEHAVIOR
- SIMS_MERGE_TREATMENT_RESULT_V1 now normalizes payload.merged_article.
- A SUCCESS/READY/COMPLETED Merge result with publication_ready=true and non-empty content_markdown
  is treated as the final writing artifact.
- SBM sets the case to MERGE_USER_ACTION_REQUIRED /
  "統合原稿反映・301等の利用者処置待ち".
- SBM does NOT generate a Writer referral for that completed Merge.
- The dialog removes stale legacy Writer/Merge actions for the same CaseID instead of jumping to Writer.
- 301/noindex/delete remain manual/user decisions.

NOTE
This HF3 fixes routing. Large Merge result persistence beyond the Sheets single-cell limit is still stored
as the existing summary record; artifact persistence strategy should be finalized separately.
