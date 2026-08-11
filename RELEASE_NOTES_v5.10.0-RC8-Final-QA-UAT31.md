# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT31

## UAT30 diagnosis
Saved timing data showed:
- Old UAT28 PREPARING: 233 sec (article-info completion 215 sec)
- UAT29 PREPARING: 5 sec
- 180-day aggregation: 205 sec
  - Search Console API: 2 sec
  - Snapshot merge: 194 sec
- Other periods: 15-30 sec
- Screening batches: mostly 4-11 sec, final batch 23 sec

Therefore UAT29 already fixed PREPARING; the current bottleneck is the 180-day Snapshot merge.

## Root cause
`sbmDoctorMergeSnapshotMetrics_()` loaded all historical Health Check Snapshot rows,
kept old health-check runs, cleared the entire sheet, and rewrote all historical + current rows.
Every later period repeated a full-sheet rewrite.

Snapshot is operational working data, while formal diagnosis history is stored elsewhere.

## Fix
- Treat Doctor Health Snapshot as current-health-check working data.
- At the 180-day step, clear only the existing data body and write the current article set once.
- Do not carry historical health-check Snapshot rows forward.
- Later periods update only the current Snapshot rows.
- Read SiteID once per merge rather than once per article.
- Keep UAT30 timing diagnostics for verification.

## Expected target on ~427 articles
- 180-day Snapshot merge: from ~194 sec to roughly 2-10 sec.
- 180-day stage total: roughly 10-20 sec, depending on Sheets service latency.
- Total Health Check should drop materially; screening/reporting remains unchanged in UAT31.
