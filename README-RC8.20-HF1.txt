SIMS Blog Manager 5.10.0-RC8.20-HF1 - Merge Acceptance Resend

PURPOSE
Temporary/diagnostic bridge for the SIMS Merge v1.1.0-RC1 real-article acceptance test.
It does NOT implement the future official Merge v1.1 workflow.

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc820_hf1_merge_acceptance_resend_test.js

NO CHANGE
- appsscript.json
- Shared contracts / knowledge
- Spreadsheet templates
- Site Diagnosis HF4/HF5
- Official Merge->SBM workflow (to be redesigned only after Merge v1.1 acceptance passes)

BEHAVIOR
- A Site Diagnosis case already in MERGE_WRITER_IN_PROGRESS exposes its original Merge Package
  as an additional "実記事再試験" action.
- If the stored Merge Package exceeded the Sheets cell limit, the existing full rebuild mechanism
  regenerates it from SBM evidence.
- Doctor diagnosis does not need to be rerun.
