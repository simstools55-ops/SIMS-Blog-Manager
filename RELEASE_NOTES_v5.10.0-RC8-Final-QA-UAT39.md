# UAT39 - Initial Setup STEP5 External I/O Batching

UAT38 removed avoidable Spreadsheet I/O.
UAT39 targets the remaining STEP5 external I/O while preserving retrieval semantics.

Changes:
- Article HTML metadata requests use UrlFetchApp.fetchAll.
- Search Console main-query requests use UrlFetchApp.fetchAll.
- Each Search Console request still uses the same page=equals filter, 10-row limit and date range.
- Existing metadata cache remains active.
- Failed batch items fall back to the previous individual fetch functions.
- STEP5 timing now records article-fetch seconds and query-fetch seconds separately.

Not changed:
- Article information fields and completion rules.
- Search Console main-query scoring/sort.
- Setup batch size.
- STEP4 logic.
- Final Home update behavior.
