SIMS-Blog-Manager 5.10.0-RC8.21 Release Candidate

USER-FACING VERSION
- Home: v5.10.0

INTERNAL BUILD
- 5.10.0-RC8.21

CONSOLIDATED FIXES
- Site Diagnosis resume recovery
- Generated dialog JavaScript syntax protection
- Merge long-package/full-result handling
- Automatic Google Drive Merge artifact storage + authorization-safe retry
- Merge completed-article direct return (no unnecessary Writer referral)
- Merge primary / absorbed article role navigation
- Two-check Merge completion (publish + 301)
- Dynamic Merge primary ArticleID in completion message
- Removal of visible HF debug labels

APPS SCRIPT UPDATE
REPLACE:
- Code.gs
- appsscript.json

The appsscript.json replacement is included because RC8.21 is a consolidated baseline and
must retain the Google Drive OAuth scope introduced by HF8.

FINAL QA PASSED
- Code.gs syntax
- Generated Site Diagnosis dialog JavaScript syntax
- RC8.21 release regression
- apps-script/distribution Code identity
- apps-script/distribution manifest identity
- Drive OAuth scope present
- No non-ASCII file names under distribution

RECOMMENDED GIT COMMIT
release: consolidate SBM 5.10.0 RC8.21 and finalize Merge workflow
