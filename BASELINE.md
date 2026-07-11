# Product 5.0 ArticleDB Foundation Baseline

Baseline name: `Product 5.0 ArticleDB Foundation Baseline`

Git tag recommendation: `v5.0.0-article-db-baseline`

## Baseline scope

This baseline freezes the ArticleDB foundation implemented up to this point:

- Initial setup and Search Console connection flow
- One-pass page-level Search Console collection for ArticleDB creation
- URL normalization and noise filtering
- ArticleDB as the master data source
- Article metadata completion with resumable batching
- Configurable numeric controls for metadata batch size and related settings
- Home progress and ArticleDB status summaries
- Continuation/resume support for setup-time data completion

## Frozen areas

Until the legacy-removal phase is completed, do not modify these areas except for critical bug fixes:

- ArticleDB initial creation
- URL normalization
- Article metadata completion
- Setup progress state
- Settings validation

## Next phase

`Product 5.0 Legacy DataList Removal`

The next phase removes obsolete implementations while retaining and rebuilding only the functions required for:

- Home
- ArticleDB
- Settings
- Processing log
- Today's Improvements
- Improvement Brief
- In-progress improvements
- Future effectiveness measurement
