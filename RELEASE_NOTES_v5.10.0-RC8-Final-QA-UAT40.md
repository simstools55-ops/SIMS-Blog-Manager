# UAT40 - STEP5 Article Fetch Diagnostics

UAT39 showed STEP5 article retrieval as the remaining dominant cost.
UAT40 adds measurement only; it does not change retrieval semantics.

Added:
- Save fetchAll batch wall time.
- Save network URL count and cache-hit count.
- Save HTTP status/source for each URL.
- Save fallback individual time when fallback occurs.
- New menu: STEP5の記事取得診断を確認.

Important:
Apps Script fetchAll does not expose per-request wall-clock timing.
UAT40 therefore does not invent per-URL timings for normal fetchAll rows.
The diagnostic identifies cache/fallback/HTTP anomalies and measures the batch wait time.
