# SIMS-Blog-Manager v5.13.0 Apply Instructions

## Apps Script
Replace only:
- `Code.gs` — replace

No change:
- `appsscript.json`

After saving, reload the spreadsheet.

## First verification
1. Open `改善の推移`.
2. Check one row whose 4 measurements are complete and whose final result needs review.
3. Run `推移確認` → `4．観察終了後の処置を進める`.
4. Confirm that a Doctor request is generated.
5. Register a Doctor `WAIT / MONITOR` result and confirm that the article returns to active monitoring with a new observation history.
6. Confirm that a successful completed cycle disappears from the active trend sheet but remains in `改善履歴`.

## Recommended commit
`feat(sbm): release v5.13.0 post-improvement monitoring lifecycle`
