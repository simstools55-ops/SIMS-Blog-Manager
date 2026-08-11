# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT9

## Purpose
RC8 Final regression fix for Doctor detailed-candidate identity handoff.

## Fixes
- The checked Doctor candidate is now treated as the single source of truth for ArticleID, URL, title and severity.
- Added a hidden candidate identity key and cross-check against the latest health snapshot.
- Doctor request generation fails closed if candidate sheet, health snapshot and Article DB do not agree.
- The generated Doctor request ArticleID is checked again before the selected candidate row is removed.
- Candidate route is preserved as `DETAILED_CANDIDATE` with trigger `SBM_HEALTH_DETAILED_DIAGNOSIS`.
- Candidate severity is propagated into request urgency and exact `health_screening_severity`.
- The selected candidate row alone is removed after a successful request.
- Positive/healthy candidate metric coloring changed from green to light blue.

## Regression IDs
- REG-DOCTOR-CANDIDATE-HANDOFF-002
- REG-DOCTOR-CANDIDATE-SNAPSHOT-GUARD-001
- REG-DOCTOR-CANDIDATE-URGENCY-001
- REG-DOCTOR-CANDIDATE-REMOVE-001
- REG-UI-DOCTOR-COLOR-BLUE-001

## QA
- RC8 JavaScript regression: PASS (34 files)
- Targeted Python tests: PASS (8 tests)
- Release audit: PASS
- `apps-script/Code.gs` and `distribution/Code.gs`: identical
- distribution filenames: ASCII only
