# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT29

## UAT28 real-sheet finding
- Runner dialog appeared only after about 45 seconds.
- STEP1 remained waiting for server response after 3 minutes.
- Several visible menu/sheet refresh flickers occurred before/around start.

## Root causes
1. PREPARING executed `sbmEnsureArticleListDisplayCompleteness_(20,40)`.
   This performs article-page/GSC completion work and is the same class of issue already removed from Article List view.
2. Every `sbmDoctorSaveHealthRun_()` called `sbmDoctorEnsureMedicalSheets_()`.
   That restyled five Doctor sheets, wrapped full data ranges and auto-resized columns on every progress checkpoint.
3. A brand-new HealthCheck ID immediately ran snapshot clear/rewrite even though no row could yet exist for that unique ID.

## Fix
- Remove article-info completion from Health Check PREPARING.
- Add lightweight medical-sheet structure guard with headers only; no full styling/auto-resize.
- Health-run checkpoint saves touch only the run sheet.
- Do not clear/rewrite snapshot for a brand-new unique HealthCheck ID.
- Keep UAT28 timing display temporarily for the next real-sheet measurement.
- Health diagnosis rules, Search Console periods, screening rules and report content are unchanged.

## Targets on 427 articles
- Runner dialog after confirmation: roughly 1-5 seconds.
- STEP1 / 開始準備: under 10 seconds.
- No visible Home/menu flicker from Doctor sheet restyling.
