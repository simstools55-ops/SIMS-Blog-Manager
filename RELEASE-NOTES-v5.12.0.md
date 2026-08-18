# Release Notes — SIMS Blog Manager v5.12.0

## Creator publication registration

- Adds **Creatorで作った新記事を登録** to the SIMS-Blog-Manager menu.
- Accepts the full SIMS Article Creator response, extracts the embedded JSON, validates the site and Creator case, and registers the published article without waiting for Search Console exposure.
- Reuses the existing Site Diagnosis→Creator publication pipeline, assigns/retains ArticleID, sets the article to `👀 モニター中`, and marks it `検索露出待ち` until GSC begins returning the URL.
- Prevents duplicate article creation by matching the normalized published URL against the existing article database.
- Rejects mismatched SiteID, missing/invalid published URLs, unknown Creator cases, and non-Creator workflow states.

## Article-title data quality

- Numeric-only URL slugs such as WordPress `/1223/` and Hatena timestamp tails are no longer used as fallback H1/article titles.
- When a real title cannot be obtained, SBM keeps `タイトル取得待ち` instead of displaying a misleading numeric title.
- Existing article-list completion logic can therefore repair affected rows on the next refresh/open path that runs completeness normalization.

## Versioning

This is a MINOR release because it adds a new user-facing Creator→SBM workflow capability.
