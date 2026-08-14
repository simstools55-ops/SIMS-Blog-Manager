SIMS Blog Manager 5.10.0-RC8.20-HF7 - Automatic Merge Artifact Storage

USER EXPERIENCE
No folder selection and no additional save operation.
The user still pastes the Merge response and presses "Merge処置結果を登録".

AUTOMATIC STORAGE
SBM creates/reuses the following folders next to the SBM spreadsheet:
SIMS-Artifacts/
  Merge-Results/
    <CaseID>/
      <TreatmentResultID>-result.json
      <TreatmentResultID>-merged-article.md

The files are upserted by deterministic names, so re-registering the same result does not create endless duplicates.

SBM STORAGE
- Short results can still be stored in Doctor_Cases normally.
- Results beyond the Sheets cell limit are stored as a compact reference record containing Drive URLs.
- The compact MERGE_COMPLETION_CONTEXT also carries artifact references.
- Step 4 shows "Merge完成原稿を開く" when an artifact is available.

FIRST-TIME AUTHORIZATION
Because HF7 uses Google Drive through DriveApp, Google may request Drive permission once after deployment.
No recurring user action is required after authorization.

CHANGED FILES
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf7_merge_artifact_storage_test.js

NO CHANGE:
- appsscript.json in this changed-files package
- Shared
- Site Diagnosis
- SIMS Merge
- Writer / Creator

INSTALL
Replace only apps-script/Code.gs in Apps Script.
