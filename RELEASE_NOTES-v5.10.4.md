# SIMS-Blog-Manager v5.10.4

## Purpose

Compatibility patch for SIMS Doctor Site Diagnosis v0.5.6 handoff.

## Changed behavior

Site Diagnosis batch results can omit `article_id` when the authoritative `article_url`
matches an existing record in SBM Article DB. SBM resolves the ArticleID from the URL,
then applies the same existing identity validation and Writer / Merge routing.

## Safety

- Existing ArticleID is never overwritten when supplied.
- SiteID must still match the current SBM.
- Article URL must still match the local Article DB.
- No change to Writer / Merge contract generation.
- No change to monitoring, daily processing, or scoring logic.

## Files to replace

- `apps-script/Code.gs`
- `distribution/Code.gs`
- `VERSION`
- `PRODUCT_IDENTITY.json`
- `README.md`
- `distribution/README-FIRST.md`
- `CHANGELOG.md`

New file:
- `RELEASE_NOTES-v5.10.4.md`
