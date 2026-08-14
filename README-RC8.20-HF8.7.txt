SIMS Blog Manager 5.10.0-RC8.20-HF8.7 - Embedded Dialog Script Syntax Fix

ROOT CAUSE
The Site Diagnosis dialog JavaScript was embedded inside a large Apps Script string.
Several messages used \n inside that outer string. Apps Script converted those sequences into
literal line breaks in the generated <script>, including line breaks inside JavaScript quoted strings.
As a result, the browser could not parse the dialog script at all.

This explains the observed behavior:
- Google's native dialog close control still worked.
- The HF8.5/HF8.6 button was visibly rendered.
- But no custom click/pointer event or startup status fired.

HF8.7
- Escapes newline sequences correctly for the generated embedded JavaScript.
- Retains HF8.6 explicit addEventListener binding.
- Visible button fingerprint: "前回の処置を再読み込み（HF8.7）".
- Startup status fingerprint: "HF8.7イベント設定済み。..."
- Pointer input fingerprint: "【HF8.7】ボタン入力を検出しました。"

NEW QA
HF8.7 does TWO syntax checks:
1. Code.gs itself.
2. The actual generated <script> extracted from the Site Diagnosis dialog HTML.
Both pass.

CHANGED
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf87_embedded_script_syntax_test.js

UNCHANGED
- appsscript.json from HF8
- HF8.2 recovery logic
- Drive Artifact storage
- Shared / Site Diagnosis / Merge / Writer / Creator

INSTALL
Keep HF8 appsscript.json.
Replace Code.gs only.
Close the old dialog and open a NEW Site Diagnosis dialog.
