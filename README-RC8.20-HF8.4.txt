SIMS Blog Manager 5.10.0-RC8.20-HF8.4 - Auto/Manual Resume Separation

ROOT CAUSE
HF8.3 called the same resumeExisting() function automatically on DOMContentLoaded.
That function disabled the manual reload button immediately, so when the server call stalled
the button stayed gray and could not be pressed.

HF8.4
- Separates autoResumeExisting() and manualResumeExisting().
- DOMContentLoaded runs only autoResumeExisting().
- Automatic resume NEVER disables the manual button.
- Clicking "前回の処置を再読み込み" invokes manualResumeExisting() and only then disables the button.
- If automatic resume has not returned after 5 seconds, the dialog explicitly tells the user
  that the manual reload button can be used.
- HF8.2 recovery and scan diagnostics are unchanged.

CHANGED
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf84_auto_manual_resume_test.js

UNCHANGED
- appsscript.json from HF8
- Drive Artifact storage
- HF8.2 recovery logic
- Shared
- Site Diagnosis
- Merge / Writer / Creator

INSTALL
Keep HF8 appsscript.json installed.
For HF8.4, replace Code.gs only.
