# Release Notes — SIMS Blog Manager v5.11.0

## Treatment Performance Feedback v1

- Adds hidden internal sheet `Treatment_Performance`.
- Freezes the 28-day clicks, impressions, CTR, and position when the fourth weekly measurement completes.
- Stores baseline-to-day-28 deltas and the existing SBM final outcome without changing the current success criteria.
- Preserves candidate provenance in `改善計画JSON`: candidate ID/category, target CTR, expected clicks, InstantScore, and CTRScore.
- Links Doctor diagnosis/treatment metadata by `改善履歴ID` when available.
- Does not backfill historical cases; only newly completed 28-day treatments are recorded, avoiding reconstructed or inaccurate historical values.
- Existing daily recommendation, Doctor, Writer, Merge, Creator, and 7/14/21/28-day judgment logic is unchanged.

## Versioning

This is a MINOR release because it adds a new internal treatment-performance data capability.
