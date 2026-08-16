# SIMS-Blog-Manager v5.10.10

This release corrects the repository package layout and keeps the two canonical Apps Script copies synchronized.

## Files to replace

- `apps-script/Code.gs` — replace
- `distribution/Code.gs` — replace

Both files are intentionally identical.

## Apps Script

When updating the live Google Apps Script project, paste the full contents of either synchronized `Code.gs` file into the existing `Code.gs` and save.

## Main functional change carried forward from v5.10.9

- Site Diagnosis `CREATOR` route support
- Creator cases no longer require an existing article URL/ArticleID as the treatment target
- Creator referral generation from `creator_plan`
- Site Diagnosis treatment dialog routing/count support for Creator

## Packaging correction in v5.10.10

The previous v5.10.9 artifact contained only `distribution/Code.gs`. The GitHub repository convention uses both `apps-script/Code.gs` and `distribution/Code.gs`, and release QA requires them to be byte-identical. v5.10.10 restores that layout.
