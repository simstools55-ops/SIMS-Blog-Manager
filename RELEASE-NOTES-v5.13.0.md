# Release Notes — SIMS Blog Manager v5.13.0

## Post-improvement monitoring lifecycle

This release completes the operational path after the normal observation period finishes.

### Active trend list lifecycle
- Adds `4．観察終了後の処置を進める` to the `推移確認` menu.
- The action uses the selected checkbox row in `改善の推移`.
- Cases still inside the measurement period remain observation-only.
- Cases whose final outcome is `改善完了` graduate from the active trend list while their improvement history and 28-day performance records remain stored.
- Cases whose final outcome is `再改善必要`, or that remain inconclusive after the scheduled measurements, are routed to Doctor re-diagnosis instead of directly to Writer.

### Doctor WAIT / MONITOR
- A Doctor result with `workflow_handoff.next_action = MONITOR` or equivalent treatment action now starts a formal additional monitoring cycle.
- SBM creates a new `Doctor→経過観察` improvement-history record with the current metrics as its new baseline.
- The Doctor case is linked to the new improvement history, its review date is retained, and the article returns to `👀 モニター中`.
- Re-registering the same Doctor case does not create duplicate monitoring history.

### Display and state
- Active measurement rows distinguish `処置待ち`, `再診待ち`, and `追加経過観察中`.
- Successfully completed observation cycles no longer remain indefinitely in the active `改善の推移` list.
- History and `Treatment_Performance` data are preserved for later longitudinal analysis.

### Doctor request UX
- `改善の推移` Doctor requests now accept the row selected by the normal checkbox UI as well as the active row fallback.
- The new `推移確認` action makes the post-observation Doctor route discoverable without requiring users to know the separate Doctor menu.

## Versioning
MINOR release from v5.12.2. `appsscript.json` is unchanged.

## Apps Script replacement
Replace:
- `Code.gs`

No change:
- `appsscript.json`
