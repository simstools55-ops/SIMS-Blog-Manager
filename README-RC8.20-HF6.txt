SIMS Blog Manager 5.10.0-RC8.20-HF6 - Merge Target + Completion Progress

REPLACE
- apps-script/Code.gs
- distribution/Code.gs

ADD
- tests/product5100_rc820_hf6_merge_target_progress_test.js

NO CHANGE
- appsscript.json
- Shared
- Site Diagnosis
- SIMS Merge
- Writer / Creator
- Long Merge-result artifact persistence model

UI SAFETY
Step 4 now shows:
- Primary article ID + title
- Absorbed article ID(s) + title(s) when available
- Merge direction
The three confirmation labels also contain the actual ArticleIDs.

RESUME
A compact MERGE_COMPLETION_CONTEXT is saved in the existing Doctor_Cases confirmation fields.
This contains only IDs/titles/URLs needed to identify the pending user action; it does not duplicate
the long merged manuscript. Reopening the dialog restores the same target information.

COMPLETION PROGRESS
While the single server-side completion transaction runs, the dialog cycles through:
- Merge処置完了を確認しています…
- 改善履歴を登録しています…
- 記事管理を「モニター中」へ同期しています…
- 28日後の効果測定を設定しています…
- 改善の推移とHomeを更新しています…
Then it displays the real server result.

INSTALL
Replace only apps-script/Code.gs in Apps Script.
