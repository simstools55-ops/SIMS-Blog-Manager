# Next Phase: Legacy DataList Removal

## Remove completely

- Data List sheet and all related generation/update code
- Legacy STEP A / STEP B flows
- Legacy Search Console fetch implementations superseded by ArticleDB
- Legacy title/meta collection implementations superseded by ArticleDB completion
- Old Home aggregation paths that do not read ArticleDB
- Obsolete menus and unused settings
- Duplicate internal sheets and unused helper functions

## Preserve

- Home
- ArticleDB
- Settings
- Processing log
- Setup and ArticleDB foundation
- Today's Improvements
- Improvement Brief
- In-progress improvements
- ArticleID and fields needed for future effectiveness measurement/history

## Safety rule

ArticleDB foundation code is frozen during this phase. Removal work must not alter ArticleDB creation, normalization, metadata completion, resume state, or numeric settings behavior.
