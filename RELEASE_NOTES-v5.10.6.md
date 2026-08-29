# SIMS-Blog-Manager v5.10.6

## Purpose

Fix incorrect Merge source selection in Site Diagnosis clusters that contain additional evidence articles.

## Root cause

The previous Merge request builder recursively collected every ArticleID/URL appearing in the Doctor result.
For a three-article cluster this could promote an explicitly excluded evidence article to `MERGE_SOURCE`,
even when `merge_plan.target_article` and `merge_plan.source_article` already defined the correct pair.

## New behavior

When an explicit `merge_plan` exists:

- `target_article` is the only Merge primary article.
- `source_article` is the only absorbed article.
- Other `articles[]` entries remain evidence only.
- Resume/UI displays use the same saved `merge_plan`.
- If the explicit target/source cannot be validated against the local Article DB, Merge generation stops instead of guessing.

Legacy results without `merge_plan` keep the prior fallback behavior.

## Regression case

`CLUSTER-GADGET-XIAOMISMARTBAND10`

- Target: A900019
- Source: A900027
- Evidence-only / excluded: A900014

The v5.10.6 logic keeps A900014 out of the Merge source set.

## Files to replace

- `apps-script/Code.gs`
- `distribution/Code.gs`
- `VERSION`
- `PRODUCT_IDENTITY.json`
- `README.md`
- `distribution/README-FIRST.md`
- `CHANGELOG.md`

New file:
- `RELEASE_NOTES-v5.10.6.md`
