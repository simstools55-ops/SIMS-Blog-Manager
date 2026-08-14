SIMS Blog Manager 5.10.0-RC8.20 - Referral Title Visibility

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc820_referral_title_visibility_test.js

NO CHANGE
- appsscript.json
- Shared contracts / knowledge
- Spreadsheet templates
- Site Diagnosis HF4/HF5

APPS SCRIPT INSTALL
Replace only Code.gs with apps-script/Code.gs.

UI IMPROVEMENT
- The treatment referral card now shows a human-readable "対象記事：<記事タイトル>" line.
- The title follows the selected referral when using 前の紹介状 / 次の紹介状.
- Resume, rebuilt referrals, and Merge->Writer generated referrals all preserve the article title.
- If a title cannot be recovered, the CaseID is shown as a fallback.
