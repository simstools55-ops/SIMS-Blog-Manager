# UAT41 - STEP5 Diagnostic-Only Runner

## Background
UAT40 diagnostics were not generated because STEP5 was not re-executed after applying UAT40.

## Added
SIMS-Blog-Manager menu:
- STEP5診断のみ実行

This runs only STEP5 external retrieval diagnostics without restarting setup.

Behavior:
- Reads article URLs from the existing Article DB.
- Uses up to 24 URLs.
- Runs article HTML batch retrieval.
- Runs Search Console main-query batch retrieval.
- Saves UAT40 article-fetch diagnostics.
- Records STEP5 timing.
- Does NOT write titles, SEO titles, meta descriptions, main queries, completion flags, or any other article data back to Article DB.
- Does NOT change setup completion state.
- Shows a spinner while the diagnostic is running.

After completion:
- Open STEP5の記事取得診断を確認.
- Open 初回セットアップの工程時間を確認.
