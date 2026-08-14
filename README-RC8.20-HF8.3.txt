SIMS Blog Manager 5.10.0-RC8.20-HF8.3 - Resume Reload Feedback

PURPOSE
Make it obvious that "前回の処置を再読み込み" was actually pressed and SBM is working.

IMMEDIATE FEEDBACK
- Button text changes to "読み込み中…"
- Button is temporarily disabled
- Status shows "前回の処置を再読み込み中…"

WHILE WAITING
- 未完了案件を読み込んでいます…
- 紹介状／処置結果を復元しています…
- 画面を前回の続きへ戻しています…

AFTER COMPLETION
- Button returns to "前回の処置を再読み込み"
- HF8.2 scan diagnostics remain visible

ON FAILURE
- Button is restored
- "再読み込みに失敗しました。" plus the error is shown

CHANGED
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs
ADD:
- tests/product5100_rc820_hf83_reload_feedback_test.js

UNCHANGED
- appsscript.json from HF8
- HF8.2 recovery logic
- Drive Artifact storage
- Shared
- Site Diagnosis
- Merge / Writer / Creator

INSTALL
Keep HF8 appsscript.json.
For HF8.3, replace Code.gs only.
