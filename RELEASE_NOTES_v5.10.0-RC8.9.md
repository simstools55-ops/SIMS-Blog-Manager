# SIMS-Blog-Manager Product 5.10.0-RC8.9

## Purpose

This revision formalizes version identification during RC8 validation and repairs packaging consistency.

## Changes

- Home now shows `v5.10.0-RC8.9`.
- `VERSION` and `PRODUCT_IDENTITY.json` now identify `5.10.0-RC8.9`.
- The Settings `Version` value is refreshed from the running code instead of remaining at the first installed value.
- `distribution/Code.gs` is synchronized byte-for-byte from `apps-script/Code.gs`.
- Hotfix8/Hotfix9 behavior is retained: profile-sheet UI guard, faster Today view, stale-health-run guard, and Writer-result registration progress feedback.

## Version rule

Stable releases use `major.minor.revision`. RC validation uses `major.minor.revision-RCx.y`.
