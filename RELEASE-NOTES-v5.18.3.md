# SIMS Blog Manager v5.18.3

## Personal Knowledge bootstrap diagnostics and visibility

This patch follows the real-article A000076 test where Article Doctor registration succeeded but no `SIMS-Personal-Knowledge` folder appeared in Drive.

- Personal Knowledge bootstrap failures are now written both to the SBM System Log and Apps Script Cloud Logging (`console.warn`).
- A SITE candidate can no longer be silently converted to `REJECT` when the Personal Knowledge context itself failed to initialize. The ingest result now reports `PK_CONTEXT_UNAVAILABLE` as a non-blocking error.
- The Site Doctor treatment intake returns the Personal Knowledge ingest summary to the dialog. A single Article Doctor result now visibly reports candidate/save counts or the exact bootstrap error.
- The single-case completion label is corrected from `Site Doctor診断結果` to `Article Doctor診断結果`.
- Added `Personal Knowledge接続を確認` under the SBM maintenance/settings menu. It performs a one-time root/site initialization and verifies `MANIFEST.json`; normal daily operation does not require this command.
- Update instructions now explicitly require the bundled `appsscript.json` to be synchronized and Drive authorization to be granted when requested.

No Doctor/Writer/Merge contract names, internal `SIMS_DOCTOR_*` identifiers, physical sheet names, or existing `SiteID` values are changed.
