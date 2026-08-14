SIMS Blog Manager 5.10.0-RC8.20-HF4 - Merge UI + Resume Progress

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc820_hf4_merge_ui_resume_progress_test.js

NO CHANGE
- appsscript.json
- Shared contracts / knowledge
- Spreadsheet templates
- Site Diagnosis product
- Merge result persistence/storage model

UI CHANGES
- "③ Mergeの統合設計結果を登録" -> "③ Mergeの統合処置結果を登録"
- Resume progress shows what SBM is doing while the dialog restores previous work:
  1. 前回の処置状態を確認しています…
  2. 未完了案件を読み込んでいます…
  3. 紹介状／処置結果を復元しています…
  4. 画面を前回の続きへ戻しています…
  5. 前回の続きから再開しました

APPS SCRIPT INSTALL
Replace only Code.gs with apps-script/Code.gs.

NEXT
The long Merge-result persistence problem beyond the Google Sheets single-cell limit is intentionally left for the next design step.
