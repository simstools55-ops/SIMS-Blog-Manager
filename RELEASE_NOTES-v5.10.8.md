# SIMS-Blog-Manager v5.10.8

## Purpose

Close the remaining Site Diagnosis / Merge safety and usability issues found during the example-site production test.

## Changes

### Standardized "skip treatment" UI

`処置せず終了` now uses a radio-button dialog instead of free-text prompts. Available reasons:

- 現況確認で問題なし
- Doctor診断の前提と現況が不一致
- リダイレクト済み／旧URL
- すでに別の処置で解決済み
- その他

An optional verification memo can be stored. A memo is required for `その他`.

### Merge identity safety

When the stored Merge request contains an explicit `merge_plan`, SBM validates the returned Merge result against that exact target/source pair before accepting it. A mismatch stops registration instead of guessing. The final monitoring transition performs an additional target identity check.

Regression case:

- target: A900019
- absorbed: A900027
- evidence-only / excluded: A900014

### Drive Artifact is optional

Drive Artifact storage remains available when permission/environment allows it, but failure no longer blocks or alarms the treatment workflow. For long Merge results that do not fit in a cell and cannot be saved to Drive, SBM stores a compact result summary sufficient for resume/monitoring.

### Resume clarity

The resume status distinguishes referral/result work from Merge user actions and explicitly states that completed cases are not re-displayed.

## Files to replace

- `apps-script/Code.gs`
- `distribution/Code.gs`
- `VERSION`
- `PRODUCT_IDENTITY.json`
- `README.md`
- `distribution/README-FIRST.md`
- `CHANGELOG.md`

New file:
- `RELEASE_NOTES-v5.10.8.md`
