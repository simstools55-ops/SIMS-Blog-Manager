# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT13

## Purpose

Fix the reproducible slowdown in `Doctor_精密診断候補` preparation where STEP 2/3 could remain active for minutes on a 427-article site.

## Root cause

STEP 2/3 called `sbmDoctorReconcileCompletedTreatments_()`. That maintenance routine is intentionally broad: it reconciles historical Doctor/Writer cases, syncs monitoring state/history, and may rebuild effectiveness data. Running it every time the user merely opens the detailed-diagnosis candidate list made the lightweight candidate-view operation inherit unrelated maintenance work.

STEP 3 also used per-article helper lookups that could repeatedly scan Article DB / Doctor Cases while filtering the candidate pool.

## Fix

- STEP 2/3 no longer runs Doctor/Writer historical reconciliation or effectiveness recalculation.
- Article DB, Doctor Cases, and the latest health snapshot are each read once to build a compact exclusion set for articles already in treatment/monitoring.
- The exclusion set is carried to STEP 3 through Document Cache.
- STEP 3 filters candidates with O(1) in-memory ID/normalized-URL lookups instead of per-article sheet/case searches.
- Existing treatment reconciliation remains available in its established maintenance/result-registration paths; it is only removed from the candidate-view operation.
- UAT12 public progress-dispatch entrypoint is preserved.

## Regression IDs

- `REG-DOCTOR-CANDIDATE-PERF-001`: STEP 2 must not call historical treatment reconciliation.
- `REG-DOCTOR-CANDIDATE-PERF-002`: STEP 2 must not recalculate effectiveness data.
- `REG-DOCTOR-CANDIDATE-PERF-003`: candidate exclusion context is built from one-pass sheet reads and cached for STEP 3.
- `REG-DOCTOR-CANDIDATE-PERF-004`: STEP 3 uses cached ID/normalized-URL exclusion checks instead of per-article sheet lookups.

## Automated verification

- RC8 JavaScript regression files: 38 PASS
- Python RC8 freeze/result guard: 8 PASS
- JavaScript syntax check: PASS
- `apps-script/Code.gs` == `distribution/Code.gs`: PASS
- distribution file names: ASCII only
- Release audit: PASS
- ZIP integrity: PASS

## Required real-sheet UAT

On the 427-article blog:

1. Choose `精密診断候補を見る`.
2. Confirm STEP 1/3 advances promptly.
3. Confirm STEP 2/3 advances within normal processing time and does not remain for minutes.
4. Confirm STEP 3/3 completes and the candidate sheet opens automatically.
5. Confirm up to 10 untreated candidates are shown and existing monitoring/Doctor-in-progress articles are excluded.
