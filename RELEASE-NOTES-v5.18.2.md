# SIMS-Blog-Manager v5.18.2

Release date: 2026-08-30

## Fix

This patch fixes a regression found in the real-article Personal Knowledge test after v5.18.1.

- `SIMS_DOCTOR_CASE_RESULT_V2` is now treated as a generic Article Doctor single-case result when it does not carry Site Doctor trace identifiers.
- `site_diagnosis_case_id` and `site_diagnosis_batch_id` remain mandatory only for Site Doctor-tracked cases. If only one of the pair is present, registration stops safely.
- Existing Doctor_Cases rows are used to restore Site Doctor trace IDs when they are already known, preserving the original Site Doctor route.
- Generic Article Doctor results are still validated against the current SBM `SiteID`, ArticleID, and article URL before registration.
- Personal Knowledge candidate ingestion now also runs in the `Site Doctor診断結果の処置を進める` intake path after successful validation/storage. Failure remains non-blocking.
- Writer/Merge referrals generated from generic Article Doctor results no longer receive empty `site_diagnosis_context` objects.

## Compatibility

No existing `SIMS_DOCTOR_*` contract, physical sheet name, Case ID, Batch ID, or legacy SiteID is renamed. Site Doctor-tracked results keep their strict traceability validation.

## Real test target

After updating to v5.18.2, re-register `CASE-20260830-A000076-001` unchanged. Expected behavior: the result registers without demanding Site Doctor IDs, `SIMS-Personal-Knowledge` is auto-created/resolved, and the two `MEDIUM` findings are stored as replay-safe `CANDIDATE` entries.
