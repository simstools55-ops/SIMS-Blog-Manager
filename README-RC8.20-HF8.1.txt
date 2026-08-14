SIMS Blog Manager 5.10.0-RC8.20-HF8.1 - Resume Recovery

PURPOSE
Recover Site Diagnosis Merge cases that became invisible after a Drive/Artifact save failure
or another intermediate state introduced during HF7/HF8 validation.

RECOVERY RULE
The resume dialog no longer depends only on a small fixed list of 状態コード values.
For Site Diagnosis rows where:
- 紹介先 contains MERGE
- Merge依頼JSON still exists
- Case is not MONITORING or TREATMENT_FAILED
SBM restores the Merge action even if the state code is an older/unexpected intermediate value.

SPECIAL CASE
ARTIFACT_SAVE_FAILED is shown as:
"Merge結果受理済み・Drive保存を再試行できます"

UI SAFETY
- Restored cases disable the new Doctor registration button to prevent accidental restart.
- Added "前回の処置を再読み込み" button.
- No Doctor re-diagnosis is required.

CHANGED FILES
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf81_resume_recovery_test.js

UNCHANGED FROM HF8
- apps-script/appsscript.json
- distribution/appsscript.json
- Drive OAuth scope
- Artifact storage logic
- Shared / Site Diagnosis / Merge / Writer / Creator

INSTALL
HF8 must already be applied.
For HF8.1, replace Code.gs only.
