SIMS Blog Manager 5.10.0-RC8.20-HF5 - Merge Completion Monitoring

REPLACE
- apps-script/Code.gs
- distribution/Code.gs

ADD
- tests/product5100_rc820_hf5_merge_completion_monitoring_test.js

NO CHANGE
- appsscript.json
- Shared
- Site Diagnosis
- SIMS Merge
- Writer / Creator

New Step 4:
1) Confirm merged primary article is published.
2) Confirm absorbed -> primary 301 redirect.
3) Confirm absorbed article handling is complete.
Then "処置完了として登録".

SBM then:
- sets primary article to モニター中
- records 改善経路 Doctor→Merge
- registers improvement history
- schedules 28-day review
- removes the improvement candidate
- refreshes monitoring/effectiveness/Home

Reopening the dialog while MERGE_USER_ACTION_REQUIRED restores Step 4 automatically.

INSTALL: replace only apps-script/Code.gs in Apps Script.
