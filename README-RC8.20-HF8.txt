SIMS Blog Manager 5.10.0-RC8.20-HF8 - Drive Authorization + Safe Artifact Retry

WHY HF8
HF7 correctly received the long Merge result, but DriveApp failed because the explicit
appsscript.json oauthScopes did not include Google Drive write authorization.

OFFICIAL GOOGLE REQUIREMENT
DriveApp folder creation requires:
https://www.googleapis.com/auth/drive

REPLACE IN APPS SCRIPT
1. apps-script/Code.gs -> Code.gs
2. apps-script/appsscript.json -> appsscript.json

IMPORTANT
Unlike HF1-HF7, HF8 requires TWO Apps Script files to be replaced.

FIRST RUN
Google should request authorization for Drive access after the manifest change.
Approve the Drive permission once. This is not a recurring operation.

SAFE FAILURE BEHAVIOR
Artifact storage is no longer allowed to turn the entire Merge result registration into a hard failure.
If Drive storage fails:
- Merge result processing can continue.
- SBM records artifact_status=SAVE_FAILED and the error.
- The dialog shows "Drive保存を再試行".
- In the same dialog session, the user can authorize Drive and retry without copying the Merge result again.
- Re-registering the same Merge result is idempotent: deterministic filenames are upserted.

LONG RESULT NOTE
When the Merge JSON exceeds the Sheets cell limit and Drive storage fails, SBM can only retain
a compact failure/reference record in the sheet. After authorization, retry/re-registration is strongly
recommended so the full result and merged manuscript are durably stored on Drive.

CHANGED FILES
REPLACE:
- apps-script/Code.gs
- apps-script/appsscript.json
- distribution/Code.gs
- distribution/appsscript.json
ADD:
- tests/product5100_rc820_hf8_drive_authorization_safe_retry_test.js

NO CHANGE
- Shared
- Site Diagnosis
- SIMS Merge
- Writer / Creator
