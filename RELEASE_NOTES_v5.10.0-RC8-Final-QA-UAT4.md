# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT4

## Regression fixes

- REG-DOCTOR-CANDIDATE-IDENTITY-001
  - Precision diagnosis candidate selection now resolves ArticleID + canonical URL as a pair when both are available.
  - The visible candidate title is cross-checked against Article Management before creating a Doctor request.
  - On mismatch the request fails closed and the candidate is not removed.
- REG-HOME-COUNT-001
  - Fixed Article Management array offsets used for improving/monitoring counts.
  - `改善中` and `モニター中` are counted independently from the correct Work Status column.
- REG-DIST-FILENAME-001
  - End-user distribution file names are ASCII-only: `Code.gs` and `README-FIRST.md`.
  - Repository documentation/tests were updated to the new distribution file names.

## QA

- RC8 JavaScript regression tests: 27/27 PASS.
- RC8 freeze contract: 6/6 PASS.
- Release UTF-8/transient audit: PASS.
