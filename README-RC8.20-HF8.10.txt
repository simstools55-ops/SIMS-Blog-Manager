SIMS Blog Manager 5.10.0-RC8.20-HF8.10 - Merge Role Navigation

CHANGES
- Removes temporary HF suffix from "前回の処置を再読み込み".
- Merge Step 2 now shows separate role-specific buttons:
  - 統合先記事 Axxxxx を開く
  - 吸収記事 Axxxxx を開く
- Merge Step 4 keeps the same role distinction/navigation.
- Writer/single-article workflows remain unchanged.
- HF8.9 two-check completion remains unchanged.

QA PASSED
- Code.gs syntax
- Actual generated Site Diagnosis dialog JavaScript syntax
- HF8.10 regression test

REPLACE
- apps-script/Code.gs
- distribution/Code.gs

ADD
- tests/product5100_rc820_hf810_merge_role_navigation_test.js

UNCHANGED
- appsscript.json from HF8
- Drive Artifact storage
- Shared / Site Diagnosis / Merge / Writer / Creator

INSTALL
Keep HF8 appsscript.json.
Replace Code.gs only.
