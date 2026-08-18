# Release Notes — SIMS Blog Manager v5.12.2

## Creator direct publication registration

- Creator new-article registration now supports two routes: Diagnosis/SBM-linked Creator cases and Creator-direct articles with no `case_id`.
- When a valid Creator response has no matching active Creator case, SBM registers the published URL directly instead of rejecting it.
- Direct registrations receive a normal `ArticleID`, `👀 モニター中`, and `検索露出待ち` state before Search Console first observation.
- Search Console data later merges into the same article by normalized URL, avoiding duplicate article creation.
- Creator-direct provenance is recorded as `CREATOR_DIRECT` in the publication/history payload.
- Existing safeguards remain: current-site SiteID check when present, blog-host validation, URL validation, and duplicate-URL reuse.
- Existing Diagnosis/SBM-linked Creator publication behavior remains unchanged when a valid `case_id` is available.

## Versioning

PATCH release from v5.12.1. No `appsscript.json` change. Apps Script replacement file: `Code.gs` only.
