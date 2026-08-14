SIMS Blog Manager 5.10.0-RC8.19 - Merge Writer Routing + Referral Rebuild

CHANGED FILES
- REPLACE: apps-script/Code.gs
- REPLACE: distribution/Code.gs
- ADD: tests/product5100_rc819_merge_writer_and_referral_rebuild_test.js

NO CHANGE
- appsscript.json
- Shared contracts / knowledge
- Spreadsheet templates
- Site Diagnosis HF4/HF5

APPS SCRIPT INSTALL
Replace only Code.gs with apps-script/Code.gs.

FIXES
1. Re-registering an already saved SIMS_MERGE_TREATMENT_RESULT_V1 now preserves result_status,
   so Merge -> SBM -> Writer referral routing still executes.
2. Merge -> Writer routing uses the normalized Merge result status directly.
3. Large Writer/Merge referrals summarized because of the Google Sheets cell limit are no longer
   treated as the source of truth during resume.
4. The dialog marks such referrals as needing rebuild and regenerates the full referral/package
   from Doctor_Cases + Article DB + SBM Evidence only when the user requests it.
