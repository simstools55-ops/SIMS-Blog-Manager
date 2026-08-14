SIMS Blog Manager 5.10.0-RC8.20-HF8.5 - Always Clickable Resume Button

PURPOSE
Remove ambiguity between a gray secondary-style button and a disabled button,
and eliminate the disabled property from manual resume entirely.

VISIBLE FINGERPRINT
The button text is:
前回の処置を再読み込み（HF8.5）

If the dialog does NOT show "(HF8.5)", the new Code.gs is not the code currently running.

BEHAVIOR
- Button uses blue outline style.
- type=button is explicit.
- pointer-events:auto and opacity:1 are forced.
- manual reload never sets button.disabled.
- Double-click is prevented with an internal manualResumeBusy flag.
- On click the status starts with:
  【HF8.5】前回の処置を再読み込み中…

CHANGED
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf85_always_clickable_reload_test.js

UNCHANGED
- appsscript.json from HF8
- HF8.2 recovery logic
- Drive Artifact storage
- Shared / Site Diagnosis / Merge / Writer / Creator

INSTALL
Keep HF8 appsscript.json.
Replace Code.gs only.
After saving Apps Script, close the existing dialog and open a NEW Site Diagnosis dialog.
