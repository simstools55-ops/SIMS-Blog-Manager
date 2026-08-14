SIMS Blog Manager 5.10.0-RC8.20-HF8.6 - Explicit Resume Event Binding

ROOT CAUSE TARGET
HF8.5 was visibly loaded, but clicking the resume button produced no status change.
This means the inline onclick handler was not reaching manualResumeExisting() in the live dialog.

HF8.6
- Removes inline onclick from the resume button.
- Binds pointerdown and click handlers with addEventListener after DOMContentLoaded.
- pointerdown immediately shows:
  【HF8.6】ボタン入力を検出しました。
- click then calls manualResumeExisting().
- Button is forced to position:relative; z-index:9999 to avoid invisible overlay interception.
- Button label includes (HF8.6).
- Initial status includes "HF8.6イベント設定済み。"

DIAGNOSTIC INTERPRETATION
A) Initial "HF8.6イベント設定済み" appears:
   DOMContentLoaded and script execution are working.
B) Clicking shows "ボタン入力を検出しました":
   Pointer reaches the button.
C) Then "前回の処置を再読み込み中":
   Click handler and manual function are working.
If A appears but B does not, a UI overlay/browser-level interception remains.

CHANGED
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf86_explicit_event_binding_test.js

UNCHANGED
- appsscript.json from HF8
- HF8.2 recovery logic
- Drive Artifact storage
- Shared / Site Diagnosis / Merge / Writer / Creator

INSTALL
Keep HF8 appsscript.json.
Replace Code.gs only.
Close the old dialog and open a new Site Diagnosis dialog.
