SIMS Blog Manager 5.10.0-RC8.20-HF8.9 - Two-Check Merge Completion

PURPOSE
Simplify the Merge completion UI based on real-use feedback.

BEFORE
1. Publish merged primary article
2. Configure absorbed -> primary 301 redirect
3. "Absorbed article handling completed" (ambiguous and largely redundant)

AFTER
1. Publish merged primary article
2. Configure absorbed -> primary 301 redirect

The third checkbox was removed from:
- dialog UI
- client validation
- server validation
- improvement-history change summary

HF8.8 PRESERVED
Merge cases still show separate navigation buttons:
- 統合先記事 Axxxxx を開く
- 吸収記事 Axxxxx を開く

QA REQUIRED AND PASSED
- Code.gs syntax check
- Actual generated Site Diagnosis dialog JavaScript syntax check
- HF8.9 regression test

CHANGED
REPLACE:
- apps-script/Code.gs
- distribution/Code.gs

ADD:
- tests/product5100_rc820_hf89_two_check_merge_completion_test.js

UNCHANGED
- appsscript.json from HF8
- Drive Artifact storage
- Resume recovery
- Shared
- Site Diagnosis
- SIMS Merge
- Writer / Creator

INSTALL
Keep HF8 appsscript.json installed.
Replace Code.gs only.
