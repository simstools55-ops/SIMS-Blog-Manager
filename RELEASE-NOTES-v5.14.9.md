# SIMS Blog Manager v5.14.9

## Improvements

- Unified single-selection checkbox behavior. Selecting a new row automatically clears all previous selections, including Doctor detailed candidates whose header starts on row 6.
- Added an Article List management-state dialog driven by the sheet checkbox. Users can mark an article as noindex, unpublished, or otherwise excluded from search-improvement management.
- Added a reversible route for noindex/unpublished articles: after the blog-side setting is removed, the article can be returned to normal SBM management.
- Merge completion now supports blogs where HTTP 301 redirects cannot be configured. The user can confirm either a real 301 redirect or an alternative search-exclusion treatment.
- Absorbed Merge articles without 301 support are stored as `統合済み（リダイレクト不可） / 管理対象外` and excluded from improvement, Doctor, internal-link, and monitoring candidate reuse.
- noindex / management-excluded articles are retained as history instead of deleted, so they can be restored when appropriate.

## Version

- Product version: **v5.14.9**
